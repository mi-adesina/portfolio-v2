import { randomUUID } from "crypto";
import type { AppSupabaseClient } from "@/lib/supabase/server";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];

export class ImageUploadError extends Error {}

/**
 * Uploads via the caller's already RLS-scoped, admin-authenticated
 * client — the 'admin can upload portfolio-images' Storage policy
 * (supabase/migrations) is what actually enforces this is an admin
 * upload, not this function.
 */
export async function uploadImage(
  supabase: AppSupabaseClient,
  folder: string,
  file: File
): Promise<string> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new ImageUploadError(
      "Unsupported image type — use PNG, JPEG, WebP, or GIF."
    );
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new ImageUploadError("Image must be under 5MB.");
  }

  const extension = file.name.split(".").pop() || "bin";
  const path = `${folder}/${randomUUID()}.${extension}`;

  const { error } = await supabase.storage
    .from("portfolio-images")
    .upload(path, file, { contentType: file.type, upsert: false });

  if (error) {
    throw new ImageUploadError(error.message);
  }

  return path;
}

export async function deleteStoredImages(
  supabase: AppSupabaseClient,
  paths: (string | null | undefined)[]
) {
  const validPaths = paths.filter((p): p is string => Boolean(p));
  if (validPaths.length === 0) return;
  await supabase.storage.from("portfolio-images").remove(validPaths);
}
