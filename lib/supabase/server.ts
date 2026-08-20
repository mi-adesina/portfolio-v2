import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "@/types/database";

/**
 * Server Components, Server Actions, and Route Handlers. Still uses
 * the public anon key — this client respects RLS and is what
 * establishes *who* the current user is (via their session cookie),
 * which the is_admin() policies check against.
 *
 * This does NOT bypass RLS. For operations that must run as a
 * privileged service, use lib/supabase/admin.ts instead, and only
 * from trusted server-side code paths.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component during render, where
            // cookies can't be set. Safe to ignore as long as
            // middleware.ts is refreshing the session (see below).
          }
        },
      },
    }
  );
}
