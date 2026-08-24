import Link from "next/link";
import type { Route } from "next";
import { requireAdmin } from "@/lib/auth/require-admin";
import { deleteExperience } from "@/lib/actions/experience";
import { ConfirmSubmitButton } from "@/components/admin/confirm-submit-button";

export const dynamic = "force-dynamic";

export default async function AdminExperiencePage() {
  const { supabase } = await requireAdmin();
  const { data: roles, error } = await supabase
    .from("experience")
    .select("*")
    .order("display_order", { ascending: true });

  if (error) throw error;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-ink">
          Experience
        </h1>
        <Link
          href="/admin/experience/new"
          className="rounded-sm border border-accent bg-accent px-4 py-2 font-mono text-xs text-white transition-opacity hover:opacity-90"
        >
          New entry
        </Link>
      </div>

      {(roles ?? []).length === 0 ? (
        <p className="mt-10 font-mono text-xs text-muted">
          No entries yet — add your first role.
        </p>
      ) : (
        <ul className="mt-8 divide-y divide-border">
          {(roles ?? []).map((role) => (
            <li key={role.id} className="flex items-center justify-between py-3">
              <div>
                <Link
                  href={`/admin/experience/${role.id}` as Route}
                  className="font-body text-sm text-ink hover:text-accent"
                >
                  {role.position} · {role.company}
                </Link>
                <p className="font-mono text-xs text-muted">
                  {role.start_date} — {role.end_date ?? "Present"}
                </p>
              </div>
              <form action={deleteExperience.bind(null, role.id)}>
                <ConfirmSubmitButton
                  label="Delete"
                  confirmMessage={`Delete "${role.position} at ${role.company}"? This can't be undone.`}
                />
              </form>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
