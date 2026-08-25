import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

/**
 * Forces every request this client makes to bypass Next.js's fetch
 * Data Cache. Root cause of a real admin-auth bypass found in
 * production testing: neither @supabase/supabase-js nor @supabase/ssr
 * set a `cache` option on their own fetch() calls, so
 * supabase.auth.getUser() / supabase.rpc("is_admin") were subject to
 * Next's default fetch caching — meaning one real admin session's
 * "authenticated" response could be cached and replayed to a
 * completely different, unauthenticated visitor. This client is used
 * for exactly the calls that make that decision (requireAdmin() and
 * every admin Server Action), so this is where it must be fixed,
 * rather than relying on every current and future admin route
 * remembering a route-segment config.
 */
function noStoreFetch(input: RequestInfo | URL, init?: RequestInit) {
  return fetch(input, { ...init, cache: "no-store" });
}

/**
 * The type used everywhere a Supabase client is passed between
 * functions (admin data-layer helpers, upload helpers, Server
 * Actions). Deliberately derived from @supabase/supabase-js's own
 * `createClient` rather than from this file's `createClient()`
 * (which wraps @supabase/ssr's `createServerClient`) — an earlier
 * version of this type used `Awaited<ReturnType<typeof createClient>>`
 * here instead, and it mostly worked, but a real `tsc` run showed its
 * generic resolution behaving inconsistently for one specific
 * pattern: a `.maybeSingle()` query result later spread into a
 * return object came back typed as `never`, even though a simpler
 * `.select().order()` array query using the exact same type worked
 * fine in the same file. `lib/supabase/public.ts`'s
 * `createPublicClient()` — built directly on
 * `@supabase/supabase-js`'s `createClient`, not `@supabase/ssr` —
 * handles that exact multi-query + `.maybeSingle()` + spread pattern
 * correctly, so that's the shape used here instead.
 *
 * At runtime this doesn't change what object flows through the app:
 * `@supabase/ssr`'s `createServerClient` constructs and returns a
 * real `@supabase/supabase-js` `SupabaseClient` under its
 * cookie-handling wrapper — it doesn't reimplement query building.
 * The one-line cast in `createClient()` below reconciles the
 * type-level description with a shape proven to behave correctly for
 * every query pattern actually used in this codebase; it doesn't
 * change behavior.
 */
export type AppSupabaseClient = ReturnType<typeof createSupabaseClient<Database>>;

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
export async function createClient(): Promise<AppSupabaseClient> {
  const cookieStore = await cookies();

  const client = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        fetch: noStoreFetch,
      },
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        // Explicitly typed rather than left to inference: passing this
        // object inline as an argument to a generic call
        // (createServerClient<Database>(...)) doesn't reliably flow
        // contextual types down into nested method parameters, which
        // is what was producing "implicitly has an 'any' type" here.
        setAll(
          cookiesToSet: { name: string; value: string; options?: CookieOptions }[]
        ) {
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

  // See the AppSupabaseClient comment above: this reconciles the
  // type description with the shape that behaves correctly across
  // this app's actual query patterns. The object returned is
  // unchanged — same session, same cookies, same RLS enforcement.
  return client as unknown as AppSupabaseClient;
}
