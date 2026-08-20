-- =========================================================
-- experience
-- =========================================================
create table if not exists public.experience (
  id uuid primary key default gen_random_uuid(),
  company text not null,
  position text not null,
  start_date date not null,
  -- null end_date = current role
  end_date date,
  description text,
  responsibilities text[] not null default '{}',
  technologies text[] not null default '{}',
  achievements text[] not null default '{}',
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists experience_display_order_idx on public.experience (display_order);

create trigger experience_set_updated_at
  before update on public.experience
  for each row
  execute function public.set_updated_at();

alter table public.experience enable row level security;

-- Experience is public résumé content by nature — no draft/published
-- gate. If you want to stage entries before they go live, add a
-- status column and follow the projects pattern instead.
create policy "experience is publicly readable"
  on public.experience for select
  using (true);

create policy "admin can manage experience"
  on public.experience for insert
  with check (public.is_admin());

create policy "admin can update experience"
  on public.experience for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "admin can delete experience"
  on public.experience for delete
  using (public.is_admin());
