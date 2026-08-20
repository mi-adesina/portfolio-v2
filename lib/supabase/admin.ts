import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

/**
 * ⚠️ Bypasses Row Level Security entirely. This client authenticates
 * as the Supabase service role, not as any particular user.
 *
 * The `server-only` import above makes it a build error to import
 * this file from any Client Component — but that alone is not
 * authorization. Every call site using this client MUST independently
 * verify the caller is the authenticated admin (e.g. by checking the
 * session via lib/supabase/server.ts) BEFORE using it. Never call
 * this in response to unauthenticated input.
 *
 * Typical legitimate uses: admin file upload/delete in Server
 * Actions, after confirming the session belongs to an admin.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. " +
        "This client must only be constructed in server-side code."
    );
  }

  return createSupabaseClient<Database>(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
