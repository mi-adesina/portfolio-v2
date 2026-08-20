/**
 * `projects.cover_image`, `projects.og_image`, and `project_images.path`
 * all store a path *within* the `portfolio-images` bucket (e.g.
 * "learnarc/cover.png"), not a full URL — set by the admin upload flow
 * in Phase 4. This resolves that path to the bucket's public CDN URL.
 */
export function publicImageUrl(path: string | null | undefined): string | null {
  if (!path) return null;

  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) return null;

  return `${base}/storage/v1/object/public/portfolio-images/${path}`;
}
