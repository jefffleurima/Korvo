-- Call/voice settings per organization: ring timeout (seconds before AI picks up), forwarding number, Twilio number for webhook lookup.

alter table public.organizations
  add column if not exists call_ring_timeout_seconds integer not null default 15,
  add column if not exists forwarding_phone text,
  add column if not exists twilio_phone_number text;

comment on column public.organizations.call_ring_timeout_seconds is 'Seconds to ring human before AI answers (e.g. 15)';
comment on column public.organizations.forwarding_phone is 'Phone number to ring (human) on inbound call; E.164';
comment on column public.organizations.twilio_phone_number is 'Twilio number that receives inbound calls for this org (E.164); used to look up org in webhooks';

create index if not exists organizations_twilio_phone_number_idx on public.organizations(twilio_phone_number) where twilio_phone_number is not null;
