-- =========================================================
-- Storage buckets
-- =========================================================
-- Public bucket: cover images, gallery screenshots, and OG images are
-- meant to be publicly viewable once a project/post is published, so
-- they're served directly from Supabase's public CDN URL.
insert into storage.buckets (id, name, public)
values ('portfolio-images', 'portfolio-images', true)
on conflict (id) do nothing;

-- Anyone can view files in the public bucket (this mirrors the bucket
-- being marked `public`, but is stated explicitly for clarity).
create policy "portfolio-images are publicly readable"
  on storage.objects for select
  using (bucket_id = 'portfolio-images');

-- Only the admin can upload, replace, or delete files.
create policy "admin can upload portfolio-images"
  on storage.objects for insert
  with check (bucket_id = 'portfolio-images' and public.is_admin());

create policy "admin can update portfolio-images"
  on storage.objects for update
  using (bucket_id = 'portfolio-images' and public.is_admin())
  with check (bucket_id = 'portfolio-images' and public.is_admin());

create policy "admin can delete portfolio-images"
  on storage.objects for delete
  using (bucket_id = 'portfolio-images' and public.is_admin());
