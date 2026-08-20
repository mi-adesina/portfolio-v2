"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { requireAdmin } from "@/lib/auth/require-admin";
import { postSchema, parsePostFormData, slugifyTag } from "@/lib/validations/blog";
import { uploadImage, deleteStoredImages, ImageUploadError } from "@/lib/supabase/upload";

function revalidateBlogPaths(slug?: string) {
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  if (slug) revalidatePath(`/blog/${slug}`);
}

/**
 * Turns comma-separated tag names into tag ids, creating any tag that
 * doesn't exist yet. Simpler UX than a pre-populated checkbox list —
 * the tradeoff is a small chance of a duplicate-slug race between two
 * concurrent saves, handled below by re-reading on conflict rather
 * than failing the whole post save over it.
 */
async function resolveTagIds(
  supabase: SupabaseClient<Database>,
  tagNames: string[]
): Promise<string[]> {
  const ids: string[] = [];

  for (const rawName of tagNames) {
    const slug = slugifyTag(rawName);
    if (!slug) continue;

    const { data: existing } = await supabase
      .from("tags")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();

    if (existing) {
      ids.push(existing.id);
      continue;
    }

    const { data: created, error } = await supabase
      .from("tags")
      .insert({ name: rawName.trim(), slug })
      .select("id")
      .single();

    if (error || !created) {
      const { data: fallback } = await supabase
        .from("tags")
        .select("id")
        .eq("slug", slug)
        .maybeSingle();
      if (fallback) ids.push(fallback.id);
      continue;
    }

    ids.push(created.id);
  }

  return ids;
}

export async function createPost(formData: FormData) {
  const { supabase } = await requireAdmin();

  const parsed = postSchema.safeParse(parsePostFormData(formData));
  if (!parsed.success) {
    redirect(
      `/admin/blog/new?error=${encodeURIComponent(
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
      coverPath = await uploadImage(supabase, `blog/${values.slug}`, coverFile);
    }
    const ogFile = formData.get("og_image_file");
    if (ogFile instanceof File && ogFile.size > 0) {
      ogPath = await uploadImage(supabase, `blog/${values.slug}`, ogFile);
    }
  } catch (err) {
    const message =
      err instanceof ImageUploadError ? err.message : "Image upload failed";
    redirect(`/admin/blog/new?error=${encodeURIComponent(message)}`);
  }

  const { data: post, error } = await supabase
    .from("blog_posts")
    .insert({
      title: values.title,
      slug: values.slug,
      excerpt: values.excerpt || null,
      content: values.content,
      cover_image: coverPath,
      og_image: ogPath,
      status: values.status,
      published_at: values.status === "published" ? new Date().toISOString() : null,
      category: values.category || null,
      seo_title: values.seo_title || null,
      seo_description: values.seo_description || null,
    })
    .select("id")
    .single();

  if (error || !post) {
    redirect(
      `/admin/blog/new?error=${encodeURIComponent(
        error?.message ?? "Could not create post — slug may already be taken"
      )}`
    );
  }

  const tagIds = await resolveTagIds(supabase, values.tags);
  if (tagIds.length > 0) {
    await supabase.from("blog_post_tags").insert(
      tagIds.map((tag_id) => ({ post_id: post.id, tag_id }))
    );
  }

  revalidateBlogPaths(values.slug);
  redirect(`/admin/blog/${post.id}`);
}

export async function updatePost(id: string, formData: FormData) {
  const { supabase } = await requireAdmin();

  const parsed = postSchema.safeParse(parsePostFormData(formData));
  if (!parsed.success) {
    redirect(
      `/admin/blog/${id}?error=${encodeURIComponent(
        parsed.error.issues[0]?.message ?? "Invalid input"
      )}`
    );
  }
  const values = parsed.data;

  const { data: existing } = await supabase
    .from("blog_posts")
    .select("cover_image, og_image, status, published_at")
    .eq("id", id)
    .maybeSingle();

  let coverPath = existing?.cover_image ?? null;
  let ogPath = existing?.og_image ?? null;

  try {
    const coverFile = formData.get("cover_image_file");
    if (coverFile instanceof File && coverFile.size > 0) {
      const newPath = await uploadImage(supabase, `blog/${values.slug}`, coverFile);
      await deleteStoredImages(supabase, [coverPath]);
      coverPath = newPath;
    }
    const ogFile = formData.get("og_image_file");
    if (ogFile instanceof File && ogFile.size > 0) {
      const newPath = await uploadImage(supabase, `blog/${values.slug}`, ogFile);
      await deleteStoredImages(supabase, [ogPath]);
      ogPath = newPath;
    }
  } catch (err) {
    const message =
      err instanceof ImageUploadError ? err.message : "Image upload failed";
    redirect(`/admin/blog/${id}?error=${encodeURIComponent(message)}`);
  }

  // Set published_at the first time a post goes live; keep the
  // original timestamp on every save after that (including
  // unpublishing — republishing later shouldn't look brand new).
  const publishedAt =
    values.status === "published"
      ? existing?.published_at ?? new Date().toISOString()
      : existing?.published_at ?? null;

  const { error } = await supabase
    .from("blog_posts")
    .update({
      title: values.title,
      slug: values.slug,
      excerpt: values.excerpt || null,
      content: values.content,
      cover_image: coverPath,
      og_image: ogPath,
      status: values.status,
      published_at: publishedAt,
      category: values.category || null,
      seo_title: values.seo_title || null,
      seo_description: values.seo_description || null,
    })
    .eq("id", id);

  if (error) {
    redirect(`/admin/blog/${id}?error=${encodeURIComponent(error.message)}`);
  }

  await supabase.from("blog_post_tags").delete().eq("post_id", id);
  const tagIds = await resolveTagIds(supabase, values.tags);
  if (tagIds.length > 0) {
    await supabase.from("blog_post_tags").insert(
      tagIds.map((tag_id) => ({ post_id: id, tag_id }))
    );
  }

  revalidateBlogPaths(values.slug);
  redirect(`/admin/blog/${id}?saved=1`);
}

export async function deletePost(id: string) {
  const { supabase } = await requireAdmin();

  const { data: post } = await supabase
    .from("blog_posts")
    .select("cover_image, og_image, slug")
    .eq("id", id)
    .maybeSingle();

  await deleteStoredImages(supabase, [post?.cover_image, post?.og_image]);

  const { error } = await supabase.from("blog_posts").delete().eq("id", id);
  if (error) throw error;

  revalidateBlogPaths(post?.slug);
}

export async function setPostStatus(id: string, status: "draft" | "published") {
  const { supabase } = await requireAdmin();

  const { data: existing } = await supabase
    .from("blog_posts")
    .select("published_at, slug")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase
    .from("blog_posts")
    .update({
      status,
      published_at:
        status === "published"
          ? existing?.published_at ?? new Date().toISOString()
          : existing?.published_at ?? null,
    })
    .eq("id", id);

  if (error) throw error;
  revalidateBlogPaths(existing?.slug);
}
