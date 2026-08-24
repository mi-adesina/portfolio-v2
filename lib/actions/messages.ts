"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/require-admin";
import type { Database } from "@/types/database";

type ContactStatus =
  Database["public"]["Tables"]["contact_messages"]["Row"]["status"];

function revalidateMessagePaths(id?: string) {
  revalidatePath("/admin/messages");
  revalidatePath("/admin");
  if (id) revalidatePath(`/admin/messages/${id}`);
}

export async function setMessageStatus(id: string, status: ContactStatus) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase
    .from("contact_messages")
    .update({ status })
    .eq("id", id);

  if (error) throw error;
  revalidateMessagePaths(id);
}

export async function deleteMessage(id: string) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase
    .from("contact_messages")
    .delete()
    .eq("id", id);

  if (error) throw error;
  revalidateMessagePaths();
}

/**
 * Bumps 'new' -> 'read' the first time a message is opened. Never
 * downgrades a status the admin already moved further along
 * (replied/archived) just because the detail page was viewed again.
 */
export async function markAsRead(id: string) {
  const { supabase } = await requireAdmin();

  const { data: existing } = await supabase
    .from("contact_messages")
    .select("status")
    .eq("id", id)
    .maybeSingle();

  if (existing?.status === "new") {
    await supabase
      .from("contact_messages")
      .update({ status: "read" })
      .eq("id", id);
    revalidateMessagePaths(id);
  }
}
