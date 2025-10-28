-- Add early_access and email_validated columns to leads
alter table public.leads
  add column if not exists early_access boolean default false,
  add column if not exists email_validated boolean;

-- Note: Supabase service_role bypasses RLS by design, so no policy is required
-- for server-side updates (API routes/webhooks) using the service role key.
-- If you later need non-service roles to update these columns, create explicit
-- policies without using unsupported "IF NOT EXISTS".
