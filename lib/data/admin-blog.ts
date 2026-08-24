import type { AppSupabaseClient } from "@/lib/supabase/server";

export async function getAllPostsAdmin(supabase: AppSupabaseClient) {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getAdminPostById(
  supabase: AppSupabaseClient,
  id: string
) {
  const { data: post, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  if (!post) return null;

  const { data: links, error: linksError } = await supabase
    .from("blog_post_tags")
    .select("tag_id")
    .eq("post_id", id);
  if (linksError) throw linksError;

  const tagIds = (links ?? []).map((l) => l.tag_id);

  const { data: tags, error: tagsError } =
    tagIds.length > 0
      ? await supabase.from("tags").select("name").in("id", tagIds)
      : { data: [] as { name: string }[], error: null };
  if (tagsError) throw tagsError;

  return { ...post, tagNames: (tags ?? []).map((t) => t.name) };
}
