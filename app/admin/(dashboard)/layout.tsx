import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/require-admin";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { signOut } from "@/lib/actions/auth";

// Explicit, rather than relying on cookies() usage inside
// requireAdmin() to implicitly opt this route into dynamic
// rendering. That implicit behavior governs whether the HTML is
// re-rendered per request — it does NOT reliably prevent an
// individual fetch() call (like the ones requireAdmin() makes to
// check auth) from being served out of Next's Data Cache. This
// directive is the explicit, documented way to guarantee neither
// this layout nor anything nested under it is cached, for every
// current and future route in the admin tree.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await requireAdmin();

  return (
    <div className="mx-auto flex max-w-content gap-10 px-6 py-10">
      <AdminSidebar />
      <div className="min-w-0 flex-1">
        <div className="mb-8 flex items-center justify-between border-b border-border pb-4">
          <p className="font-mono text-xs text-muted">{user.email}</p>
          <form action={signOut}>
            <button
              type="submit"
              className="font-mono text-xs text-muted hover:text-accent"
            >
              Sign out
            </button>
          </form>
        </div>
        {children}
      </div>
    </div>
  );
}
