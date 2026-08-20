import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

/**
 * For public, read-only content (published projects/posts). Uses the
 * anon key and is fully RLS-scoped — it just skips the cookie-based
 * session handling in lib/supabase/server.ts, which isn't available
 * outside a request (e.g. inside generateStaticParams/generateMetadata).
 * Since these queries only ever need the public policies (is_admin()
 * is false with no session either way), that's never a problem here.
 */
export function createPublicClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  );
}
