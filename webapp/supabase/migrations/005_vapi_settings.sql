-- Vapi: AI answers when human doesn't pick up. Store assistant ID and Vapi phone number ID (Twilio number linked in Vapi).
alter table public.organizations
  add column if not exists vapi_assistant_id text,
  add column if not exists vapi_phone_number_id text;

comment on column public.organizations.vapi_assistant_id is 'Vapi assistant ID for no-answer AI. Create assistant in Vapi dashboard, set Server URL to Korvo webhook.';
comment on column public.organizations.vapi_phone_number_id is 'Vapi phone number ID: your Twilio number linked in Vapi (BYOC). Required for create-call bypass.';
