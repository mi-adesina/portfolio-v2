import { requireAdmin } from "@/lib/auth/require-admin";
import { getAllTechnologies } from "@/lib/data/admin-projects";
import { ProjectForm } from "@/components/admin/project-form";
import { createProject } from "@/lib/actions/projects";

export default async function NewProjectPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const { supabase } = await requireAdmin();
  const technologies = await getAllTechnologies(supabase);

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink">
        New project
      </h1>

      {searchParams.error && (
        <p
          role="alert"
          className="mt-4 rounded-sm border border-red-300 bg-red-50 px-4 py-2 font-mono text-xs text-red-700"
        >
          {searchParams.error}
        </p>
      )}

      <div className="mt-8 max-w-2xl">
        <ProjectForm technologies={technologies} action={createProject} />
      </div>
    </div>
  );
}
