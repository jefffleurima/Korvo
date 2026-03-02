-- Optional webhook secret per org for form/inbound webhook authentication.
alter table public.organizations
  add column if not exists webhook_secret text;

comment on column public.organizations.webhook_secret is 'Secret for authenticating inbound webhooks (e.g. form submissions). Shown once in dashboard; use in X-Korvo-Webhook-Secret header.';
