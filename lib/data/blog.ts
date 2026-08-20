import { createPublicClient } from "@/lib/supabase/public";
import type { Database } from "@/types/database";

type PostRow = Database["public"]["Tables"]["blog_posts"]["Row"];

export type PostListItem = Pick<
  PostRow,
  "id" | "title" | "slug" | "excerpt" | "cover_image" | "category" | "published_at"
> & {
  tags: { name: string; slug: string }[];
};

export type PostDetail = PostRow & {
  tags: { name: string; slug: string }[];
};

/** Same two-query pattern as lib/data/projects.ts — see the comment there. */
async function attachTags(
  posts: Omit<PostListItem, "tags">[]
): Promise<PostListItem[]> {
  if (posts.length === 0) return [];

  const supabase = createPublicClient();
  const postIds = posts.map((p) => p.id);

  const { data: links, error: linksError } = await supabase
    .from("blog_post_tags")
    .select("post_id, tag_id")
    .in("post_id", postIds);
  if (linksError) throw linksError;

  const tagIds = Array.from(new Set((links ?? []).map((l) => l.tag_id)));

  const { data: tags, error: tagsError } =
    tagIds.length > 0
      ? await supabase.from("tags").select("id, name, slug").in("id", tagIds)
      : { data: [] as { id: string; name: string; slug: string }[], error: null };
  if (tagsError) throw tagsError;

  const tagById = new Map((tags ?? []).map((t) => [t.id, t]));

  return posts.map((post) => ({
    ...post,
    tags: (links ?? [])
      .filter((link) => link.post_id === post.id)
      .map((link) => tagById.get(link.tag_id))
      .filter((t): t is { id: string; name: string; slug: string } =>
        Boolean(t)
      )
      .map((t) => ({ name: t.name, slug: t.slug })),
  }));
}

export async function getPublishedPosts(): Promise<PostListItem[]> {
  const supabase = createPublicClient();

  const { data, error } = await supabase
    .from("blog_posts")
    .select("id, title, slug, excerpt, cover_image, category, published_at")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error) throw error;

  return attachTags(data ?? []);
}

/** Distinct categories among published posts, for the filter chips. */
export function collectCategories(posts: PostListItem[]): string[] {
  const categories = new Set<string>();
  for (const post of posts) {
    if (post.category) categories.add(post.category);
  }
  return Array.from(categories).sort();
}

export async function getPostBySlug(slug: string): Promise<PostDetail | null> {
  const supabase = createPublicClient();

  const { data: post, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) throw error;
  if (!post) return null;

  const { data: links, error: linksError } = await supabase
    .from("blog_post_tags")
    .select("tag_id")
    .eq("post_id", post.id);
  if (linksError) throw linksError;

  const tagIds = (links ?? []).map((l) => l.tag_id);

  const { data: tags, error: tagsError } =
    tagIds.length > 0
      ? await supabase.from("tags").select("name, slug").in("id", tagIds)
      : { data: [] as { name: string; slug: string }[], error: null };
  if (tagsError) throw tagsError;

  return { ...post, tags: tags ?? [] };
}
