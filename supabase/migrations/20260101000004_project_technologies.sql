-- =========================================================
-- project_technologies — many-to-many join
-- =========================================================
create table if not exists public.project_technologies (
  project_id uuid not null references public.projects (id) on delete cascade,
  technology_id uuid not null references public.technologies (id) on delete cascade,
  primary key (project_id, technology_id)
);

create index if not exists project_technologies_technology_idx
  on public.project_technologies (technology_id);

alter table public.project_technologies enable row level security;

create policy "readable when parent project is published"
  on public.project_technologies for select
  using (
    exists (
      select 1 from public.projects p
      where p.id = project_id and p.status = 'published'
    )
  );

create policy "admin can read all project_technologies"
  on public.project_technologies for select
  using (public.is_admin());

create policy "admin can manage project_technologies"
  on public.project_technologies for insert
  with check (public.is_admin());

create policy "admin can update project_technologies"
  on public.project_technologies for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "admin can delete project_technologies"
  on public.project_technologies for delete
  using (public.is_admin());
