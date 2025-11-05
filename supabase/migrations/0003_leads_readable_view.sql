-- Create a view with desired column order for readability
create or replace view public.leads_readable as
select
  id,
  email,
  company,
  invoices_per_month,
  early_access,
  email_validated,
  unsubscribe,
  utm_source,
  utm_medium,
  utm_campaign,
  utm_term,
  utm_content,
  user_agent,
  ip,
  referer,
  created_at
from public.leads;

-- Note: Postgres does not support physical reordering of columns easily without table rewrite.
-- Using a view is a safe and non-destructive way to control display order for reads.

