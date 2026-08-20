-- Extensions
create extension if not exists pgcrypto;

-- =========================================================
-- Admin allow-list
-- =========================================================
-- Rather than checking a role or a hard-coded email in every policy,
-- every RLS policy below calls is_admin(), which checks membership in
-- this table. To grant yourself admin access after creating your
-- Supabase Auth account, insert your auth.users id here manually
-- (see README → "Creating your admin account").
create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;

-- Nobody can read/write the admins table directly via the API — it's
-- only ever consulted through is_admin(), which runs with definer
-- privileges. No policies are added here on purpose: default-deny.

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.admins where user_id = auth.uid()
  );
$$;

-- =========================================================
-- Shared helper: keep updated_at current on every UPDATE
-- =========================================================
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
