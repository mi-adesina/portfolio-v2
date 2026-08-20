import { z } from "zod";

const optionalString = z.string().max(5000).optional().or(z.literal(""));
const optionalUrl = z
  .string()
  .url("Must be a valid URL")
  .optional()
  .or(z.literal(""));

export const projectSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must be lowercase letters, numbers, and hyphens only"
    ),
  short_description: z
    .string()
    .min(1, "Short description is required")
    .max(300),
  full_description: optionalString,
  status: z.enum(["draft", "published"]),
  featured: z.boolean(),
  github_url: optionalUrl,
  live_url: optionalUrl,
  features: z.array(z.string()).default([]),
  challenges: optionalString,
  solutions: optionalString,
  lessons_learned: optionalString,
  start_date: z.string().optional().or(z.literal("")),
  completion_date: z.string().optional().or(z.literal("")),
  display_order: z.number().int(),
  seo_title: z.string().max(70).optional().or(z.literal("")),
  seo_description: z.string().max(160).optional().or(z.literal("")),
  technology_ids: z.array(z.string()).default([]),
});

export type ProjectFormValues = z.infer<typeof projectSchema>;

/** Converts raw FormData into the plain object projectSchema expects. */
export function parseProjectFormData(formData: FormData) {
  return {
    title: String(formData.get("title") ?? ""),
    slug: String(formData.get("slug") ?? "")
      .trim()
      .toLowerCase(),
    short_description: String(formData.get("short_description") ?? ""),
    full_description: String(formData.get("full_description") ?? ""),
    status: String(formData.get("status") ?? "draft"),
    featured: formData.get("featured") === "on",
    github_url: String(formData.get("github_url") ?? ""),
    live_url: String(formData.get("live_url") ?? ""),
    features: String(formData.get("features") ?? "")
      .split("\n")
      .map((f) => f.trim())
      .filter(Boolean),
    challenges: String(formData.get("challenges") ?? ""),
    solutions: String(formData.get("solutions") ?? ""),
    lessons_learned: String(formData.get("lessons_learned") ?? ""),
    start_date: String(formData.get("start_date") ?? ""),
    completion_date: String(formData.get("completion_date") ?? ""),
    display_order: Number(formData.get("display_order") ?? 0),
    seo_title: String(formData.get("seo_title") ?? ""),
    seo_description: String(formData.get("seo_description") ?? ""),
    technology_ids: formData.getAll("technology_ids").map(String),
  };
}
