"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/require-admin";
import {
  experienceSchema,
  parseExperienceFormData,
} from "@/lib/validations/experience";

function revalidateExperiencePaths() {
  revalidatePath("/admin/experience");
  revalidatePath("/experience");
}

export async function createExperience(formData: FormData) {
  const { supabase } = await requireAdmin();

  const parsed = experienceSchema.safeParse(parseExperienceFormData(formData));
  if (!parsed.success) {
    redirect(
      `/admin/experience/new?error=${encodeURIComponent(
        parsed.error.issues[0]?.message ?? "Invalid input"
      )}`
    );
  }
  const values = parsed.data;

  const { error } = await supabase.from("experience").insert({
    company: values.company,
    position: values.position,
    start_date: values.start_date,
    end_date: values.end_date || null,
    description: values.description || null,
    responsibilities: values.responsibilities,
    technologies: values.technologies,
    achievements: values.achievements,
    display_order: values.display_order,
  });

  if (error) {
    redirect(
      `/admin/experience/new?error=${encodeURIComponent(error.message)}`
    );
  }

  revalidateExperiencePaths();
  redirect("/admin/experience");
}

export async function updateExperience(id: string, formData: FormData) {
  const { supabase } = await requireAdmin();

  const parsed = experienceSchema.safeParse(parseExperienceFormData(formData));
  if (!parsed.success) {
    redirect(
      `/admin/experience/${id}?error=${encodeURIComponent(
        parsed.error.issues[0]?.message ?? "Invalid input"
      )}`
    );
  }
  const values = parsed.data;

  const { error } = await supabase
    .from("experience")
    .update({
      company: values.company,
      position: values.position,
      start_date: values.start_date,
      end_date: values.end_date || null,
      description: values.description || null,
      responsibilities: values.responsibilities,
      technologies: values.technologies,
      achievements: values.achievements,
      display_order: values.display_order,
    })
    .eq("id", id);

  if (error) {
    redirect(`/admin/experience/${id}?error=${encodeURIComponent(error.message)}`);
  }

  revalidateExperiencePaths();
  redirect(`/admin/experience/${id}?saved=1`);
}

export async function deleteExperience(id: string) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("experience").delete().eq("id", id);
  if (error) throw error;
  revalidateExperiencePaths();
}
