"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { PostgrestError } from "@supabase/supabase-js";
import { requireAdmin } from "@/lib/auth/require-admin";
import {
  projectSchema,
  parseProjectFormData,
} from "@/lib/validations/project";
import {
  uploadImage,
  deleteStoredImages,
  ImageUploadError,
} from "@/lib/supabase/upload";

function revalidateProjectPaths(slug?: string) {
  revalidatePath("/admin/projects");
  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath("/projects");
  if (slug) revalidatePath(`/projects/${slug}`);
}

/**
 * Postgres error code 23505 is unique_violation — the exact case the
 * `projects_slug_idx` unique constraint produces on a duplicate slug
 * (see supabase/migrations). The constraint itself is what actually
 * prevents the duplicate row from ever being created (including
 * under a double-submission race — two concurrent inserts with the
 * same slug can't both succeed no matter how the UI behaves); this
 * only turns the raw constraint-violation message into something a
 * person can act on.
 */
function friendlyProjectError(
  error: PostgrestError | null,
  fallback: string
): string {
  if (error?.code === "23505") {
    return "A project with this slug already exists. Please choose a different slug or edit the existing project.";
  }
  return error?.message ?? fallback;
}

export async function createProject(formData: FormData) {
  const { supabase } = await requireAdmin();

  const parsed = projectSchema.safeParse(parseProjectFormData(formData));
  if (!parsed.success) {
    redirect(
      `/admin/projects/new?error=${encodeURIComponent(
        parsed.error.issues[0]?.message ?? "Invalid input"
      )}`
    );
  }
  const values = parsed.data;

  let coverPath: string | null = null;
  let ogPath: string | null = null;

  try {
    const coverFile = formData.get("cover_image_file");
    if (coverFile instanceof File && coverFile.size > 0) {
      coverPath = await uploadImage(supabase, values.slug, coverFile);
    }

    const ogFile = formData.get("og_image_file");
    if (ogFile instanceof File && ogFile.size > 0) {
      ogPath = await uploadImage(supabase, values.slug, ogFile);
    }
  } catch (err) {
    const message =
      err instanceof ImageUploadError ? err.message : "Image upload failed";
    redirect(`/admin/projects/new?error=${encodeURIComponent(message)}`);
  }

  const { data: project, error } = await supabase
    .from("projects")
    .insert({
      title: values.title,
      slug: values.slug,
      short_description: values.short_description,
      full_description: values.full_description || null,
      status: values.status,
      featured: values.featured,
      github_url: values.github_url || null,
      live_url: values.live_url || null,
      cover_image: coverPath,
      og_image: ogPath,
      features: values.features,
      challenges: values.challenges || null,
      solutions: values.solutions || null,
      lessons_learned: values.lessons_learned || null,
      start_date: values.start_date || null,
      completion_date: values.completion_date || null,
      display_order: values.display_order,
      seo_title: values.seo_title || null,
      seo_description: values.seo_description || null,
    })
    .select("id")
    .single();

  if (error || !project) {
    redirect(
      `/admin/projects/new?error=${encodeURIComponent(
        friendlyProjectError(
          error,
          "Could not create project — please try again."
        )
      )}`
    );
  }

  if (values.technology_ids.length > 0) {
    await supabase.from("project_technologies").insert(
      values.technology_ids.map((technology_id) => ({
        project_id: project.id,
        technology_id,
      }))
    );
  }

  revalidateProjectPaths(values.slug);
  redirect(`/admin/projects/${project.id}`);
}

export async function updateProject(id: string, formData: FormData) {
  const { supabase } = await requireAdmin();

  const parsed = projectSchema.safeParse(parseProjectFormData(formData));
  if (!parsed.success) {
    redirect(
      `/admin/projects/${id}?error=${encodeURIComponent(
        parsed.error.issues[0]?.message ?? "Invalid input"
      )}`
    );
  }
  const values = parsed.data;

  const { data: existing } = await supabase
    .from("projects")
    .select("cover_image, og_image")
    .eq("id", id)
    .maybeSingle();

  let coverPath = existing?.cover_image ?? null;
  let ogPath = existing?.og_image ?? null;

  try {
    const coverFile = formData.get("cover_image_file");
    if (coverFile instanceof File && coverFile.size > 0) {
      const newPath = await uploadImage(
        supabase,
        values.slug,
        coverFile
      );
      await deleteStoredImages(supabase, [coverPath]);
      coverPath = newPath;
    }

    const ogFile = formData.get("og_image_file");
    if (ogFile instanceof File && ogFile.size > 0) {
      const newPath = await uploadImage(supabase, values.slug, ogFile);
      await deleteStoredImages(supabase, [ogPath]);
      ogPath = newPath;
    }
  } catch (err) {
    const message =
      err instanceof ImageUploadError ? err.message : "Image upload failed";
    redirect(`/admin/projects/${id}?error=${encodeURIComponent(message)}`);
  }

  const { error } = await supabase
    .from("projects")
    .update({
      title: values.title,
      slug: values.slug,
      short_description: values.short_description,
      full_description: values.full_description || null,
      status: values.status,
      featured: values.featured,
      github_url: values.github_url || null,
      live_url: values.live_url || null,
      cover_image: coverPath,
      og_image: ogPath,
      features: values.features,
      challenges: values.challenges || null,
      solutions: values.solutions || null,
      lessons_learned: values.lessons_learned || null,
      start_date: values.start_date || null,
      completion_date: values.completion_date || null,
      display_order: values.display_order,
      seo_title: values.seo_title || null,
      seo_description: values.seo_description || null,
    })
    .eq("id", id);

  if (error) {
    redirect(
      `/admin/projects/${id}?error=${encodeURIComponent(
        friendlyProjectError(error, "Could not save project — please try again.")
      )}`
    );
  }

  // Replace technology links wholesale — simplest correct approach at
  // this scale (a handful of technologies per project).
  await supabase.from("project_technologies").delete().eq("project_id", id);
  if (values.technology_ids.length > 0) {
    await supabase.from("project_technologies").insert(
      values.technology_ids.map((technology_id) => ({
        project_id: id,
        technology_id,
      }))
    );
  }

  revalidateProjectPaths(values.slug);
  redirect(`/admin/projects/${id}?saved=1`);
}

export async function deleteProject(id: string) {
  const { supabase } = await requireAdmin();

  const { data: project } = await supabase
    .from("projects")
    .select("cover_image, og_image, slug")
    .eq("id", id)
    .maybeSingle();

  const { data: images } = await supabase
    .from("project_images")
    .select("path")
    .eq("project_id", id);

  await deleteStoredImages(supabase, [
    project?.cover_image,
    project?.og_image,
    ...(images ?? []).map((i) => i.path),
  ]);

  // project_technologies and project_images rows cascade-delete via
  // their foreign keys (see supabase/migrations).
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw error;

  revalidateProjectPaths(project?.slug);
}

export async function setProjectStatus(
  id: string,
  status: "draft" | "published"
) {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase
    .from("projects")
    .update({ status })
    .eq("id", id)
    .select("slug")
    .single();

  if (error) throw error;
  revalidateProjectPaths(data?.slug);
}

export async function setFeatured(id: string, featured: boolean) {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase
    .from("projects")
    .update({ featured })
    .eq("id", id)
    .select("slug")
    .single();

  if (error) throw error;
  revalidateProjectPaths(data?.slug);
}

export async function updateDisplayOrder(id: string, formData: FormData) {
  const { supabase } = await requireAdmin();
  const order = Number(formData.get("display_order"));
  if (Number.isNaN(order)) return;

  const { error } = await supabase
    .from("projects")
    .update({ display_order: order })
    .eq("id", id);

  if (error) throw error;
  revalidateProjectPaths();
}

export async function addProjectImage(projectId: string, formData: FormData) {
  const { supabase } = await requireAdmin();

  const file = formData.get("image_file");
  if (!(file instanceof File) || file.size === 0) {
    redirect(
      `/admin/projects/${projectId}?error=${encodeURIComponent(
        "Choose an image file"
      )}`
    );
  }
  const alt = String(formData.get("alt") ?? "");

  const { data: project } = await supabase
    .from("projects")
    .select("slug")
    .eq("id", projectId)
    .maybeSingle();

  let path: string;
  try {
    path = await uploadImage(
      supabase,
      project?.slug ?? "misc",
      file as File
    );
  } catch (err) {
    const message =
      err instanceof ImageUploadError ? err.message : "Image upload failed";
    redirect(
      `/admin/projects/${projectId}?error=${encodeURIComponent(message)}`
    );
  }

  const { count } = await supabase
    .from("project_images")
    .select("*", { count: "exact", head: true })
    .eq("project_id", projectId);

  const { error } = await supabase.from("project_images").insert({
    project_id: projectId,
    path: path!,
    alt,
    sort_order: count ?? 0,
  });

  if (error) throw error;

  revalidatePath(`/admin/projects/${projectId}`);
  revalidatePath("/projects");
  if (project?.slug) revalidatePath(`/projects/${project.slug}`);
}

export async function deleteProjectImage(
  imageId: string,
  path: string,
  projectId: string
) {
  const { supabase } = await requireAdmin();

  await deleteStoredImages(supabase, [path]);

  const { error } = await supabase
    .from("project_images")
    .delete()
    .eq("id", imageId);
  if (error) throw error;

  revalidatePath(`/admin/projects/${projectId}`);
  revalidatePath("/projects");
}
