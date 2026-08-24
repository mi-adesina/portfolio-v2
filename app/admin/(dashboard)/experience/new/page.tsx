import { requireAdmin } from "@/lib/auth/require-admin";
import { ExperienceForm } from "@/components/admin/experience-form";
import { createExperience } from "@/lib/actions/experience";

export default async function NewExperiencePage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  await requireAdmin();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink">
        New experience entry
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
        <ExperienceForm action={createExperience} />
      </div>
    </div>
  );
}
