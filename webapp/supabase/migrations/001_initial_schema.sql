-- Korvo initial schema: organizations, users (app profile), and core tables.
-- Run this in Supabase Dashboard → SQL Editor.

-- Organizations
create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  website text,
  service_area text,
  minimum_project_value numeric,
  created_at timestamptz not null default now()
);

-- App users (links auth.users to organization). id = auth.uid()
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  email text not null,
  role text not null default 'owner' check (role in ('owner', 'admin')),
  created_at timestamptz not null default now()
);

create index if not exists users_organization_id_idx on public.users(organization_id);

-- Leads
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text,
  phone text,
  email text,
  service_type text,
  estimated_budget text,
  timeline text,
  address text,
  qualification_status text not null default 'pending' check (qualification_status in ('qualified', 'disqualified', 'pending')),
  ai_score integer,
  created_at timestamptz not null default now()
);

create index if not exists leads_organization_id_idx on public.leads(organization_id);

-- Calls
create table if not exists public.calls (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  lead_id uuid references public.leads(id) on delete set null,
  twilio_call_sid text,
  duration integer,
  recording_url text,
  outcome text check (outcome in ('booked', 'disqualified', 'missed', 'voicemail')),
  transcript text,
  created_at timestamptz not null default now()
);

create index if not exists calls_organization_id_idx on public.calls(organization_id);

-- Messages
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  lead_id uuid references public.leads(id) on delete set null,
  direction text not null check (direction in ('inbound', 'outbound')),
  content text not null,
  created_at timestamptz not null default now()
);

create index if not exists messages_organization_id_idx on public.messages(organization_id);

-- Appointments
create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  lead_id uuid references public.leads(id) on delete set null,
  start_time timestamptz not null,
  end_time timestamptz not null,
  calendar_event_id text,
  created_at timestamptz not null default now()
);

create index if not exists appointments_organization_id_idx on public.appointments(organization_id);

-- Integrations (credentials stored server-side; type + status here)
create table if not exists public.integrations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  type text not null check (type in ('twilio', 'stripe', 'google', 'crm', 'elevenlabs')),
  status text not null default 'pending' check (status in ('pending', 'connected', 'error')),
  created_at timestamptz not null default now(),
  unique(organization_id, type)
);

create index if not exists integrations_organization_id_idx on public.integrations(organization_id);

-- Billing
create table if not exists public.billing (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade unique,
  stripe_customer_id text,
  subscription_status text default 'inactive',
  plan text,
  created_at timestamptz not null default now()
);

create index if not exists billing_organization_id_idx on public.billing(organization_id);

-- Helper for RLS: current user's organization_id
create or replace function public.get_my_org_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select organization_id from public.users where id = auth.uid()
$$;

-- Enable RLS on all tables
alter table public.organizations enable row level security;
alter table public.users enable row level security;
alter table public.leads enable row level security;
alter table public.calls enable row level security;
alter table public.messages enable row level security;
alter table public.appointments enable row level security;
alter table public.integrations enable row level security;
alter table public.billing enable row level security;

-- Organizations: user can only read/update their own org
create policy "Users can view own organization"
  on public.organizations for select
  using (id = public.get_my_org_id());

create policy "Users can update own organization"
  on public.organizations for update
  using (id = public.get_my_org_id());

-- Users: can view/update users in same org
create policy "Users can view same org users"
  on public.users for select
  using (organization_id = public.get_my_org_id());

create policy "Users can update own row"
  on public.users for update
  using (id = auth.uid());

-- Insert: allow insert for own user row (used when creating profile after signup)
create policy "Users can insert own row"
  on public.users for insert
  with check (id = auth.uid());

-- Organizations: allow insert so new signups can create an org (we'll use service role or a secure function; for RLS we allow insert and then user row ties them)
-- Actually the flow is: we create organization first (no user row yet - so get_my_org_id() is null). So we need to either use a trigger with service role or allow insert. Easiest: create a database function that creates org + user and is called with SECURITY DEFINER so it runs as superuser. Then the app calls that function. Let me add a function create_organization_and_user(org_name text) that creates the org and the user row for auth.uid(). Then we don't need to allow anonymous org insert.
create or replace function public.create_organization_and_user(org_name text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  new_org_id uuid;
  auth_id uuid := auth.uid();
begin
  if auth_id is null then
    raise exception 'Not authenticated';
  end if;
  insert into public.organizations (name) values (org_name) returning id into new_org_id;
  insert into public.users (id, organization_id, email)
  select auth_id, new_org_id, email from auth.users where id = auth_id;
  return new_org_id;
end;
$$;

-- Leads, calls, messages, appointments, integrations, billing: org-scoped access
create policy "Org members can manage leads"
  on public.leads for all
  using (organization_id = public.get_my_org_id())
  with check (organization_id = public.get_my_org_id());

create policy "Org members can manage calls"
  on public.calls for all
  using (organization_id = public.get_my_org_id())
  with check (organization_id = public.get_my_org_id());

create policy "Org members can manage messages"
  on public.messages for all
  using (organization_id = public.get_my_org_id())
  with check (organization_id = public.get_my_org_id());

create policy "Org members can manage appointments"
  on public.appointments for all
  using (organization_id = public.get_my_org_id())
  with check (organization_id = public.get_my_org_id());

create policy "Org members can manage integrations"
  on public.integrations for all
  using (organization_id = public.get_my_org_id())
  with check (organization_id = public.get_my_org_id());

create policy "Org members can manage billing"
  on public.billing for all
  using (organization_id = public.get_my_org_id())
  with check (organization_id = public.get_my_org_id());
