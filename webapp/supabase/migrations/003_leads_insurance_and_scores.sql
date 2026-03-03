-- Optional intake: insurance or other notes. Text only in MVP; no document upload.
alter table public.leads
  add column if not exists insurance_info text,
  add column if not exists budget_score integer check (budget_score >= 1 and budget_score <= 5),
  add column if not exists urgency_score integer check (urgency_score >= 1 and urgency_score <= 5),
  add column if not exists conversion_score integer check (conversion_score >= 1 and conversion_score <= 5);

comment on column public.leads.insurance_info is 'Optional intake info (e.g. insurance if relevant). Collect at intake or note at consultation.';
comment on column public.leads.budget_score is 'Intent scoring 1-5: estimated budget / budget fit';
comment on column public.leads.urgency_score is 'Intent scoring 1-5: how soon they want to move';
comment on column public.leads.conversion_score is 'Intent scoring 1-5: likelihood to convert (combined signal)';
