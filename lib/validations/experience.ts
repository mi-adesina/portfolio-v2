import { z } from "zod";

export const experienceSchema = z.object({
  company: z.string().min(1, "Company is required").max(200),
  position: z.string().min(1, "Position is required").max(200),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().optional().or(z.literal("")),
  description: z.string().max(2000).optional().or(z.literal("")),
  responsibilities: z.array(z.string()).default([]),
  technologies: z.array(z.string()).default([]),
  achievements: z.array(z.string()).default([]),
  display_order: z.number().int(),
});

export type ExperienceFormValues = z.infer<typeof experienceSchema>;

function linesToArray(value: string): string[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export function parseExperienceFormData(formData: FormData) {
  return {
    company: String(formData.get("company") ?? ""),
    position: String(formData.get("position") ?? ""),
    start_date: String(formData.get("start_date") ?? ""),
    end_date: String(formData.get("end_date") ?? ""),
    description: String(formData.get("description") ?? ""),
    responsibilities: linesToArray(String(formData.get("responsibilities") ?? "")),
    technologies: linesToArray(String(formData.get("technologies") ?? "")),
    achievements: linesToArray(String(formData.get("achievements") ?? "")),
    display_order: Number(formData.get("display_order") ?? 0),
  };
}
