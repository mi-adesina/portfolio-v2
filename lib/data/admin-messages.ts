import type { AppSupabaseClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";
type ContactStatus =
  Database["public"]["Tables"]["contact_messages"]["Row"]["status"];

export async function getAllMessagesAdmin(
  supabase: AppSupabaseClient,
  status?: ContactStatus
) {
  let query = supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });

  if (status) {
    query = query.eq("status", status);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function getMessageById(supabase: AppSupabaseClient, id: string) {
  const { data, error } = await supabase
    .from("contact_messages")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function getNewMessageCount(supabase: AppSupabaseClient) {
  const { count, error } = await supabase
    .from("contact_messages")
    .select("*", { count: "exact", head: true })
    .eq("status", "new");

  if (error) throw error;
  return count ?? 0;
}
