import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  subject: z.string().max(200).optional().or(z.literal("")),
  message: z.string().min(1, "Message is required").max(5000),
});

export type ContactFormValues = z.infer<typeof contactSchema>;

export function parseContactFormData(formData: FormData) {
  return {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    subject: String(formData.get("subject") ?? ""),
    message: String(formData.get("message") ?? ""),
  };
}
