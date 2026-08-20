-- =========================================================
-- projects
-- =========================================================
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),

  title text not null,
  slug text not null unique,
  short_description text not null,
  full_description text,

  status text not null default 'draft'
    check (status in ('draft', 'published')),
  featured boolean not null default false,

  github_url text,
  live_url text,
  cover_image text,

  -- Project-specific narrative fields (features/technologies live in
  -- their own tables; this holds free-text case-study content).
  features text[] not null default '{}',
  challenges text,
  solutions text,
  lessons_learned text,

  start_date date,
  completion_date date,

  display_order integer not null default 0,

  seo_title text,
  seo_description text,
  og_image text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists projects_status_idx on public.projects (status);
create index if not exists projects_featured_idx on public.projects (featured);
create index if not exists projects_display_order_idx on public.projects (display_order);
create unique index if not exists projects_slug_idx on public.projects (slug);

create trigger projects_set_updated_at
  before update on public.projects
  for each row
  execute function public.set_updated_at();

alter table public.projects enable row level security;

create policy "published projects are publicly readable"
  on public.projects for select
  using (status = 'published');

create policy "admin can read all projects"
  on public.projects for select
  using (public.is_admin());

create policy "admin can manage projects"
  on public.projects for insert
  with check (public.is_admin());

create policy "admin can update projects"
  on public.projects for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "admin can delete projects"
  on public.projects for delete
  using (public.is_admin());
