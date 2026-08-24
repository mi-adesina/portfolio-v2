import type { AppSupabaseClient } from "@/lib/supabase/server";

/**
 * These all take an already-authenticated client (from requireAdmin())
 * rather than constructing their own, so every caller goes through
 * that single auth gate — there's no way to call these without it.
 */

export async function getAllProjectsAdmin(supabase: AppSupabaseClient) {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("display_order", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function getAdminProjectById(
  supabase: AppSupabaseClient,
  id: string
) {
  const { data: project, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  if (!project) return null;

  const { data: links, error: linksError } = await supabase
    .from("project_technologies")
    .select("technology_id")
    .eq("project_id", id);
  if (linksError) throw linksError;

  const { data: images, error: imagesError } = await supabase
    .from("project_images")
    .select("*")
    .eq("project_id", id)
    .order("sort_order", { ascending: true });
  if (imagesError) throw imagesError;

  return {
    ...project,
    technologyIds: (links ?? []).map((l) => l.technology_id),
    images: images ?? [],
  };
}

export async function getAllTechnologies(supabase: AppSupabaseClient) {
  const { data, error } = await supabase
    .from("technologies")
    .select("*")
    .order("name", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function getDashboardStats(supabase: AppSupabaseClient) {
  const [
    { count: total },
    { count: published },
    { count: draft },
    { count: featured },
    { data: recent, error: recentError },
  ] = await Promise.all([
    supabase.from("projects").select("*", { count: "exact", head: true }),
    supabase
      .from("projects")
      .select("*", { count: "exact", head: true })
      .eq("status", "published"),
    supabase
      .from("projects")
      .select("*", { count: "exact", head: true })
      .eq("status", "draft"),
    supabase
      .from("projects")
      .select("*", { count: "exact", head: true })
      .eq("featured", true),
    supabase
      .from("projects")
      .select("id, title, slug, status, created_at")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  if (recentError) throw recentError;

  return {
    total: total ?? 0,
    published: published ?? 0,
    draft: draft ?? 0,
    featured: featured ?? 0,
    recent: recent ?? [],
  };
}
