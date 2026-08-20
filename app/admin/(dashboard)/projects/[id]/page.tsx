import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth/require-admin";
import {
  getAdminProjectById,
  getAllTechnologies,
} from "@/lib/data/admin-projects";
import { ProjectForm } from "@/components/admin/project-form";
import { ImageGalleryManager } from "@/components/admin/image-gallery-manager";
import { updateProject } from "@/lib/actions/projects";

export default async function EditProjectPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { error?: string; saved?: string };
}) {
  const { supabase } = await requireAdmin();
  const [project, technologies] = await Promise.all([
    getAdminProjectById(supabase, params.id),
    getAllTechnologies(supabase),
  ]);

  if (!project) notFound();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink">
        Edit project
      </h1>

      {searchParams.error && (
        <p
          role="alert"
          className="mt-4 rounded-sm border border-red-300 bg-red-50 px-4 py-2 font-mono text-xs text-red-700"
        >
          {searchParams.error}
        </p>
      )}
      {searchParams.saved && (
        <p className="mt-4 rounded-sm border border-border bg-surface px-4 py-2 font-mono text-xs text-muted">
          Saved.
        </p>
      )}

      <div className="mt-8 max-w-2xl">
        <ProjectForm
          technologies={technologies}
          project={project}
          action={updateProject.bind(null, project.id)}
        />
      </div>

      <div className="mt-16 max-w-2xl border-t border-border pt-10">
        <h2 className="font-display text-lg font-semibold text-ink">
          Gallery
        </h2>
        <div className="mt-6">
          <ImageGalleryManager projectId={project.id} images={project.images} />
        </div>
      </div>
    </div>
  );
}
