-- =========================================================
-- project_images — gallery / screenshots, stored in Supabase Storage
-- =========================================================
-- This table stores only the reference (path/URL) returned by Supabase
-- Storage after upload — never binary image data.
create table if not exists public.project_images (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  -- Path within the 'project-images' storage bucket, e.g.
  -- 'learnarc/screenshot-1.png'. Resolve to a public URL client-side.
  path text not null,
  alt text not null default '',
  sort_order integer not null default 0,
  is_cover boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists project_images_project_idx on public.project_images (project_id);

alter table public.project_images enable row level security;

create policy "readable when parent project is published"
  on public.project_images for select
  using (
    exists (
      select 1 from public.projects p
      where p.id = project_id and p.status = 'published'
    )
  );

create policy "admin can read all project_images"
  on public.project_images for select
  using (public.is_admin());

create policy "admin can manage project_images"
  on public.project_images for insert
  with check (public.is_admin());

create policy "admin can update project_images"
  on public.project_images for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "admin can delete project_images"
  on public.project_images for delete
  using (public.is_admin());
