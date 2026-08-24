import Link from "next/link";
import type { Route } from "next";
import { requireAdmin } from "@/lib/auth/require-admin";
import { getDashboardStats } from "@/lib/data/admin-projects";
import { getNewMessageCount } from "@/lib/data/admin-messages";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const { supabase } = await requireAdmin();
  const [stats, newMessages] = await Promise.all([
    getDashboardStats(supabase),
    getNewMessageCount(supabase),
  ]);

  const cards: { label: string; value: number; href?: Route }[] = [
    { label: "Total projects", value: stats.total },
    { label: "Published", value: stats.published },
    { label: "Drafts", value: stats.draft },
    { label: "Featured", value: stats.featured },
    {
      label: "New messages",
      value: newMessages,
      href: "/admin/messages?status=new" as Route,
    },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink">
        Dashboard
      </h1>

      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-5">
        {cards.map((card) => {
          const content = (
            <>
              <p className="font-mono text-xs uppercase tracking-widest text-muted">
                {card.label}
              </p>
              <p className="mt-2 font-display text-3xl font-semibold text-ink">
                {card.value}
              </p>
            </>
          );
          return card.href ? (
            <Link
              key={card.label}
              href={card.href}
              className="rounded-sm border border-border p-4 transition-colors hover:border-accent"
            >
              {content}
            </Link>
          ) : (
            <div key={card.label} className="rounded-sm border border-border p-4">
              {content}
            </div>
          );
        })}
      </div>

      <div className="mt-10">
        <h2 className="font-mono text-xs uppercase tracking-widest text-muted">
          Recent projects
        </h2>
        <ul className="mt-4 divide-y divide-border">
          {stats.recent.map((project) => (
            <li
              key={project.id}
              className="flex items-center justify-between py-3"
            >
              <Link
                href={`/admin/projects/${project.id}` as Route}
                className="font-body text-sm text-ink hover:text-accent"
              >
                {project.title}
              </Link>
              <span className="font-mono text-xs text-muted">
                {project.status}
              </span>
            </li>
          ))}
          {stats.recent.length === 0 && (
            <p className="py-3 font-mono text-xs text-muted">
              No projects yet —{" "}
              <Link href="/admin/projects/new" className="text-accent underline">
                create your first one
              </Link>
              .
            </p>
          )}
        </ul>
      </div>
    </div>
  );
}
