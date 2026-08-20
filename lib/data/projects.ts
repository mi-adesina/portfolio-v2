import { createPublicClient } from "@/lib/supabase/public";
import type { Database } from "@/types/database";

type ProjectRow = Database["public"]["Tables"]["projects"]["Row"];

export type ProjectListItem = Pick<
  ProjectRow,
  | "id"
  | "title"
  | "slug"
  | "short_description"
  | "cover_image"
  | "featured"
  | "display_order"
  | "github_url"
  | "live_url"
> & {
  technologies: { name: string; slug: string }[];
};

export type ProjectDetail = ProjectRow & {
  technologies: { name: string; slug: string }[];
  images: { path: string; alt: string; sort_order: number }[];
};

/**
 * Attaches each project's technologies via two follow-up queries
 * rather than a single nested `select`, so every result stays fully
 * typed against database.ts without relying on generated
 * `Relationships` metadata we don't have yet (that arrives once you
 * regenerate types from a live project). Fine at portfolio scale —
 * a handful of round trips, not per-row N+1 queries.
 */
async function attachTechnologies(
  projects: Omit<ProjectListItem, "technologies">[]
): Promise<ProjectListItem[]> {
  if (projects.length === 0) return [];

  const supabase = createPublicClient();
  const projectIds = projects.map((p) => p.id);

  const { data: links, error: linksError } = await supabase
    .from("project_technologies")
    .select("project_id, technology_id")
    .in("project_id", projectIds);
  if (linksError) throw linksError;

  const technologyIds = Array.from(
    new Set((links ?? []).map((l) => l.technology_id))
  );

  const { data: technologies, error: techError } =
    technologyIds.length > 0
      ? await supabase
          .from("technologies")
          .select("id, name, slug")
          .in("id", technologyIds)
      : { data: [] as { id: string; name: string; slug: string }[], error: null };
  if (techError) throw techError;

  const techById = new Map((technologies ?? []).map((t) => [t.id, t]));

  return projects.map((project) => ({
    ...project,
    technologies: (links ?? [])
      .filter((link) => link.project_id === project.id)
      .map((link) => techById.get(link.technology_id))
      .filter((t): t is { id: string; name: string; slug: string } =>
        Boolean(t)
      )
      .map((t) => ({ name: t.name, slug: t.slug })),
  }));
}

/** All published projects, ordered for display. */
export async function getPublishedProjects(): Promise<ProjectListItem[]> {
  const supabase = createPublicClient();

  const { data, error } = await supabase
    .from("projects")
    .select(
      "id, title, slug, short_description, cover_image, featured, display_order, github_url, live_url"
    )
    .eq("status", "published")
    .order("display_order", { ascending: true });

  if (error) throw error;

  return attachTechnologies(data ?? []);
}

export async function getFeaturedProjects(
  limit = 3
): Promise<ProjectListItem[]> {
  const projects = await getPublishedProjects();
  return projects.filter((p) => p.featured).slice(0, limit);
}

/** Distinct technologies actually used by at least one published project. */
export function collectFilterTechnologies(
  projects: ProjectListItem[]
): { name: string; slug: string }[] {
  const bySlug = new Map<string, { name: string; slug: string }>();
  for (const project of projects) {
    for (const tech of project.technologies) {
      bySlug.set(tech.slug, tech);
    }
  }
  return Array.from(bySlug.values()).sort((a, b) =>
    a.name.localeCompare(b.name)
  );
}

/** A single published project by slug, with technologies and gallery images. */
export async function getProjectBySlug(
  slug: string
): Promise<ProjectDetail | null> {
  const supabase = createPublicClient();

  const { data: project, error } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) throw error;
  if (!project) return null;

  const { data: links, error: linksError } = await supabase
    .from("project_technologies")
    .select("technology_id")
    .eq("project_id", project.id);
  if (linksError) throw linksError;

  const technologyIds = (links ?? []).map((l) => l.technology_id);

  const { data: technologies, error: techError } =
    technologyIds.length > 0
      ? await supabase
          .from("technologies")
          .select("name, slug")
          .in("id", technologyIds)
      : { data: [] as { name: string; slug: string }[], error: null };
  if (techError) throw techError;

  const { data: images, error: imagesError } = await supabase
    .from("project_images")
    .select("path, alt, sort_order")
    .eq("project_id", project.id)
    .order("sort_order", { ascending: true });
  if (imagesError) throw imagesError;

  return {
    ...project,
    technologies: technologies ?? [],
    images: images ?? [],
  };
}
