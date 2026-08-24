import { Field, inputClass } from "@/components/admin/form-field";
import { SubmitButton } from "@/components/admin/submit-button";

type ExperienceFormRole = {
  id: string;
  company: string;
  position: string;
  start_date: string;
  end_date: string | null;
  description: string | null;
  responsibilities: string[];
  technologies: string[];
  achievements: string[];
  display_order: number;
};

export function ExperienceForm({
  role,
  action,
}: {
  role?: ExperienceFormRole;
  action: (formData: FormData) => void;
}) {
  const isEditing = Boolean(role);

  return (
    <form action={action} className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Company" htmlFor="company">
          <input
            id="company"
            name="company"
            required
            defaultValue={role?.company}
            className={inputClass}
          />
        </Field>
        <Field label="Position" htmlFor="position">
          <input
            id="position"
            name="position"
            required
            defaultValue={role?.position}
            className={inputClass}
          />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Start date" htmlFor="start_date">
          <input
            id="start_date"
            name="start_date"
            type="date"
            required
            defaultValue={role?.start_date ?? ""}
            className={inputClass}
          />
        </Field>
        <Field
          label="End date"
          htmlFor="end_date"
          hint="Leave empty for a current role"
        >
          <input
            id="end_date"
            name="end_date"
            type="date"
            defaultValue={role?.end_date ?? ""}
            className={inputClass}
          />
        </Field>
        <Field label="Display order" htmlFor="display_order">
          <input
            id="display_order"
            name="display_order"
            type="number"
            defaultValue={role?.display_order ?? 0}
            className={inputClass}
          />
        </Field>
      </div>

      <Field label="Description" htmlFor="description">
        <textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={role?.description ?? ""}
          className={inputClass}
        />
      </Field>

      <Field label="Responsibilities" htmlFor="responsibilities" hint="One per line">
        <textarea
          id="responsibilities"
          name="responsibilities"
          rows={4}
          defaultValue={role?.responsibilities.join("\n") ?? ""}
          className={inputClass}
        />
      </Field>

      <Field label="Achievements" htmlFor="achievements" hint="One per line — don't invent any">
        <textarea
          id="achievements"
          name="achievements"
          rows={4}
          defaultValue={role?.achievements.join("\n") ?? ""}
          className={inputClass}
        />
      </Field>

      <Field label="Technologies" htmlFor="technologies" hint="One per line">
        <textarea
          id="technologies"
          name="technologies"
          rows={3}
          defaultValue={role?.technologies.join("\n") ?? ""}
          className={inputClass}
        />
      </Field>

      <div>
        <SubmitButton
          label={isEditing ? "Save changes" : "Add entry"}
          pendingLabel={isEditing ? "Saving changes..." : "Adding entry..."}
        />
      </div>
    </form>
  );
}
