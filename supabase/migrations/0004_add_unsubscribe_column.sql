-- Add unsubscribe column to leads table
alter table public.leads
  add column if not exists unsubscribe boolean;
