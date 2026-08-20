import Link from "next/link";
import { requireAdmin } from "@/lib/auth/require-admin";
import { getAllProjectsAdmin } from "@/lib/data/admin-projects";
import {
  setProjectStatus,
  setFeatured,
  deleteProject,
  updateDisplayOrder,
} from "@/lib/actions/projects";
import { ConfirmSubmitButton } from "@/components/admin/confirm-submit-button";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const { supabase } = await requireAdmin();
  const projects = await getAllProjectsAdmin(supabase);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-ink">
          Projects
        </h1>
        <Link
          href="/admin/projects/new"
          className="rounded-sm border border-accent bg-accent px-4 py-2 font-mono text-xs text-white transition-opacity hover:opacity-90"
        >
          New project
        </Link>
      </div>

      {projects.length === 0 ? (
        <p className="mt-10 font-mono text-xs text-muted">
          No projects yet — create your first one.
        </p>
      ) : (
        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left">
            <thead>
              <tr className="border-b border-border font-mono text-xs uppercase tracking-widest text-muted">
                <th className="py-2 pr-4 font-medium">Title</th>
                <th className="py-2 pr-4 font-medium">Status</th>
                <th className="py-2 pr-4 font-medium">Featured</th>
                <th className="py-2 pr-4 font-medium">Order</th>
                <th className="py-2 pr-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id} className="border-b border-border">
                  <td className="py-3 pr-4">
                    <Link
                      href={`/admin/projects/${project.id}`}
                      className="font-body text-sm text-ink hover:text-accent"
                    >
                      {project.title}
                    </Link>
                  </td>
                  <td className="py-3 pr-4">
                    <form
                      action={setProjectStatus.bind(
                        null,
                        project.id,
                        project.status === "published" ? "draft" : "published"
                      )}
                    >
                      <button
                        type="submit"
                        title="Click to toggle"
                        className="rounded-sm border border-border px-2 py-1 font-mono text-xs text-muted hover:border-accent hover:text-accent"
                      >
                        {project.status}
                      </button>
                    </form>
                  </td>
                  <td className="py-3 pr-4">
                    <form
                      action={setFeatured.bind(
                        null,
                        project.id,
                        !project.featured
                      )}
                    >
                      <button
                        type="submit"
                        aria-label={
                          project.featured
                            ? "Unmark as featured"
                            : "Mark as featured"
                        }
                        className="text-base text-accent"
                      >
                        {project.featured ? "★" : "☆"}
                      </button>
                    </form>
                  </td>
                  <td className="py-3 pr-4">
                    <form
                      action={updateDisplayOrder.bind(null, project.id)}
                      className="flex items-center gap-2"
                    >
                      <label className="sr-only" htmlFor={`order-${project.id}`}>
                        Display order for {project.title}
                      </label>
                      <input
                        id={`order-${project.id}`}
                        type="number"
                        name="display_order"
                        defaultValue={project.display_order}
                        className="w-16 rounded-sm border border-border bg-transparent px-2 py-1 font-mono text-xs"
                      />
                      <button
                        type="submit"
                        className="font-mono text-xs text-muted hover:text-accent"
                      >
                        Save
                      </button>
                    </form>
                  </td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-4">
                      <Link
                        href={`/admin/projects/${project.id}`}
                        className="font-mono text-xs text-accent hover:underline"
                      >
                        Edit
                      </Link>
                      <form action={deleteProject.bind(null, project.id)}>
                        <ConfirmSubmitButton
                          label="Delete"
                          confirmMessage={`Delete "${project.title}"? This can't be undone.`}
                        />
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
