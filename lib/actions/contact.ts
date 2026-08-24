"use server";

import { redirect } from "next/navigation";
import { createPublicClient } from "@/lib/supabase/public";
import { contactSchema, parseContactFormData } from "@/lib/validations/contact";

export async function submitContactMessage(formData: FormData) {
  // Honeypot: a field named "company", hidden from real visitors via
  // CSS (not display:none, which some bots skip) and out of the tab
  // order. A human never fills it in; a bot that auto-fills every
  // field usually does. We don't reveal that it failed — just
  // pretend success without writing anything, so the bot learns
  // nothing about why it didn't work.
  const honeypot = String(formData.get("company") ?? "");
  if (honeypot.trim().length > 0) {
    redirect("/contact?sent=1");
  }

  const parsed = contactSchema.safeParse(parseContactFormData(formData));
  if (!parsed.success) {
    redirect(
      `/contact?error=${encodeURIComponent(
        parsed.error.issues[0]?.message ?? "Please check your input and try again"
      )}`
    );
  }
  const values = parsed.data;

  // Uses the anon client deliberately — this write happens as a
  // public visitor, matching the 'anyone can submit a contact
  // message' RLS policy (insert-only, unconditional). No session or
  // cookie handling is needed for this action.
  const supabase = createPublicClient();
  const { error } = await supabase.from("contact_messages").insert({
    name: values.name,
    email: values.email,
    subject: values.subject || null,
    message: values.message,
  });

  if (error) {
    redirect(
      `/contact?error=${encodeURIComponent(
        "Something went wrong sending your message — please try again or email directly."
      )}`
    );
  }

  redirect("/contact?sent=1");
}
