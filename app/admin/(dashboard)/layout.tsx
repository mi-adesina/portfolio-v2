import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/require-admin";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { signOut } from "@/lib/actions/auth";

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
