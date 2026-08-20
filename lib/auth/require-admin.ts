import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * Confirms the current request has a logged-in, admin-listed user,
 * redirecting to /admin/login otherwise. This is a UX layer — it
 * exists so a logged-out visitor gets redirected instead of seeing a
 * broken page or a raw Postgres error. It is NOT what actually stops
 * an unauthorized write; the RLS policies in supabase/migrations do
 * that regardless of whether this function is called correctly
 * everywhere. Still, every admin page and Server Action calls this
 * first, both for the redirect UX and so errors surface clearly.
 */
export async function requireAdmin() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: isAdmin, error } = await supabase.rpc("is_admin");

  if (error || !isAdmin) {
    redirect("/admin/login?error=" + encodeURIComponent("Not authorized"));
  }

  return { supabase, user };
}
