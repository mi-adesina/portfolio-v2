-- =========================================================
-- technologies — reusable tags referenced by projects
-- =========================================================
create table if not exists public.technologies (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  -- e.g. 'frontend' | 'backend' | 'database' | 'tool'
  category text not null default 'tool',
  created_at timestamptz not null default now()
);

create index if not exists technologies_slug_idx on public.technologies (slug);

alter table public.technologies enable row level security;

create policy "technologies are publicly readable"
  on public.technologies for select
  using (true);

create policy "admin can manage technologies"
  on public.technologies for all
  using (public.is_admin())
  with check (public.is_admin());
