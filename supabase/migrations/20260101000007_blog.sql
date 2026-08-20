-- =========================================================
-- blog_posts
-- =========================================================
create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),

  title text not null,
  slug text not null unique,
  excerpt text,
  content text not null,
  cover_image text,

  status text not null default 'draft'
    check (status in ('draft', 'published')),
  published_at timestamptz,

  category text,

  seo_title text,
  seo_description text,
  og_image text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists blog_posts_slug_idx on public.blog_posts (slug);
create index if not exists blog_posts_status_idx on public.blog_posts (status);
create index if not exists blog_posts_published_at_idx on public.blog_posts (published_at desc);

create trigger blog_posts_set_updated_at
  before update on public.blog_posts
  for each row
  execute function public.set_updated_at();

alter table public.blog_posts enable row level security;

create policy "published posts are publicly readable"
  on public.blog_posts for select
  using (status = 'published');

create policy "admin can read all blog_posts"
  on public.blog_posts for select
  using (public.is_admin());

create policy "admin can manage blog_posts"
  on public.blog_posts for insert
  with check (public.is_admin());

create policy "admin can update blog_posts"
  on public.blog_posts for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "admin can delete blog_posts"
  on public.blog_posts for delete
  using (public.is_admin());

-- =========================================================
-- tags + blog_post_tags
-- =========================================================
create table if not exists public.tags (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique
);

create table if not exists public.blog_post_tags (
  post_id uuid not null references public.blog_posts (id) on delete cascade,
  tag_id uuid not null references public.tags (id) on delete cascade,
  primary key (post_id, tag_id)
);

alter table public.tags enable row level security;
alter table public.blog_post_tags enable row level security;

create policy "tags are publicly readable"
  on public.tags for select
  using (true);

create policy "admin can manage tags"
  on public.tags for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "readable when parent post is published"
  on public.blog_post_tags for select
  using (
    exists (
      select 1 from public.blog_posts p
      where p.id = post_id and p.status = 'published'
    )
  );

create policy "admin can read all blog_post_tags"
  on public.blog_post_tags for select
  using (public.is_admin());

create policy "admin can manage blog_post_tags"
  on public.blog_post_tags for insert
  with check (public.is_admin());

create policy "admin can delete blog_post_tags"
  on public.blog_post_tags for delete
  using (public.is_admin());
