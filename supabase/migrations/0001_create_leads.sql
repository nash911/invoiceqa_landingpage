-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create leads table
create table if not exists public.leads (
  id uuid primary key default uuid_generate_v4(),
  email text not null,
  company text,
  invoices_per_month text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_term text,
  utm_content text,
  user_agent text,
  ip inet,
  referer text,
  created_at timestamptz default now()
);

-- Create unique index on email
create unique index if not exists leads_email_key on public.leads (email);

-- Add RLS policies (optional, adjust based on your needs)
alter table public.leads enable row level security;

-- Allow service role to insert
create policy "Allow service role to insert leads"
  on public.leads
  for insert
  to service_role
  with check (true);

-- Allow service role to select
create policy "Allow service role to select leads"
  on public.leads
  for select
  to service_role
  using (true);

