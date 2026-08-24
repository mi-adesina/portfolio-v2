import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth/require-admin";
import { ExperienceForm } from "@/components/admin/experience-form";
import { updateExperience } from "@/lib/actions/experience";

export default async function EditExperiencePage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { error?: string; saved?: string };
}) {
  const { supabase } = await requireAdmin();
  const { data: role, error } = await supabase
    .from("experience")
    .select("*")
    .eq("id", params.id)
    .maybeSingle();

  if (error) throw error;
  if (!role) notFound();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink">
        Edit experience entry
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
        <ExperienceForm role={role} action={updateExperience.bind(null, role.id)} />
      </div>
    </div>
  );
}
