import { publicImageUrl } from "@/lib/supabase/storage";
import { Button } from "@/components/ui/button";
import { Field, inputClass } from "@/components/admin/form-field";

type Technology = { id: string; name: string; slug: string; category: string };

type ProjectFormProject = {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  full_description: string | null;
  status: "draft" | "published";
  featured: boolean;
  github_url: string | null;
  live_url: string | null;
  cover_image: string | null;
  og_image: string | null;
  features: string[];
  challenges: string | null;
  solutions: string | null;
  lessons_learned: string | null;
  start_date: string | null;
  completion_date: string | null;
  display_order: number;
  seo_title: string | null;
  seo_description: string | null;
  technologyIds: string[];
};

export function ProjectForm({
  technologies,
  project,
  action,
}: {
  technologies: Technology[];
  project?: ProjectFormProject;
  action: (formData: FormData) => void;
}) {
  const byCategory = technologies.reduce<Record<string, Technology[]>>(
    (acc, tech) => {
      (acc[tech.category] ??= []).push(tech);
      return acc;
    },
    {}
  );

  const coverUrl = publicImageUrl(project?.cover_image);
  const ogUrl = publicImageUrl(project?.og_image);

  return (
    <form action={action} className="flex flex-col gap-10">
      {/* Core */}
      <fieldset className="flex flex-col gap-4">
        <legend className="font-mono text-xs uppercase tracking-widest text-accent">
          Core
        </legend>

        <Field label="Title" htmlFor="title">
          <input
            id="title"
            name="title"
            required
            defaultValue={project?.title}
            className={inputClass}
          />
        </Field>

        <Field label="Slug" htmlFor="slug" hint="Lowercase, numbers, hyphens only — used in the URL">
          <input
            id="slug"
            name="slug"
            required
            pattern="[a-z0-9]+(-[a-z0-9]+)*"
            defaultValue={project?.slug}
            className={inputClass}
          />
        </Field>

        <Field label="Short description" htmlFor="short_description" hint="Shown on cards and in search results">
          <textarea
            id="short_description"
            name="short_description"
            required
            rows={2}
            maxLength={300}
            defaultValue={project?.short_description}
            className={inputClass}
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Status" htmlFor="status">
            <select
              id="status"
              name="status"
              defaultValue={project?.status ?? "draft"}
              className={inputClass}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </Field>

          <Field label="Display order" htmlFor="display_order" hint="Lower shows first">
            <input
              id="display_order"
              name="display_order"
              type="number"
              defaultValue={project?.display_order ?? 0}
              className={inputClass}
            />
          </Field>
        </div>

        <label className="flex items-center gap-2 font-body text-sm text-ink">
          <input
            type="checkbox"
            name="featured"
            defaultChecked={project?.featured}
          />
          Featured (shown on the homepage)
        </label>
      </fieldset>

      {/* Links */}
      <fieldset className="flex flex-col gap-4">
        <legend className="font-mono text-xs uppercase tracking-widest text-accent">
          Links
        </legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Live URL" htmlFor="live_url">
            <input
              id="live_url"
              name="live_url"
              type="url"
              placeholder="https://"
              defaultValue={project?.live_url ?? ""}
              className={inputClass}
            />
          </Field>
          <Field label="GitHub URL" htmlFor="github_url">
            <input
              id="github_url"
              name="github_url"
              type="url"
              placeholder="https://"
              defaultValue={project?.github_url ?? ""}
              className={inputClass}
            />
          </Field>
        </div>
      </fieldset>

      {/* Images */}
      <fieldset className="flex flex-col gap-4">
        <legend className="font-mono text-xs uppercase tracking-widest text-accent">
          Images
        </legend>
        <Field
          label="Cover image"
          htmlFor="cover_image_file"
          hint="PNG, JPEG, WebP, or GIF, under 5MB. Leave empty to keep the current one."
        >
          {coverUrl && (
            // eslint-disable-next-line @next/next/no-img-element -- small admin-only preview thumbnail, not worth next/image's fixed-dimension setup here
            <img
              src={coverUrl}
              alt="Current cover"
              className="mb-2 h-24 w-40 rounded-sm border border-border object-cover"
            />
          )}
          <input
            id="cover_image_file"
            name="cover_image_file"
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            className="font-body text-sm text-ink"
          />
        </Field>

        <Field
          label="OG image"
          htmlFor="og_image_file"
          hint="Used for social share previews. Falls back to the cover image if left empty on first save."
        >
          {ogUrl && (
            // eslint-disable-next-line @next/next/no-img-element -- small admin-only preview thumbnail
            <img
              src={ogUrl}
              alt="Current OG image"
              className="mb-2 h-24 w-40 rounded-sm border border-border object-cover"
            />
          )}
          <input
            id="og_image_file"
            name="og_image_file"
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            className="font-body text-sm text-ink"
          />
        </Field>
      </fieldset>

      {/* Case study content */}
      <fieldset className="flex flex-col gap-4">
        <legend className="font-mono text-xs uppercase tracking-widest text-accent">
          Case study
        </legend>

        <Field label="Overview" htmlFor="full_description">
          <textarea
            id="full_description"
            name="full_description"
            rows={5}
            defaultValue={project?.full_description ?? ""}
            className={inputClass}
          />
        </Field>

        <Field label="Features" htmlFor="features" hint="One per line">
          <textarea
            id="features"
            name="features"
            rows={4}
            defaultValue={project?.features.join("\n") ?? ""}
            className={inputClass}
          />
        </Field>

        <Field label="Challenges" htmlFor="challenges">
          <textarea
            id="challenges"
            name="challenges"
            rows={4}
            defaultValue={project?.challenges ?? ""}
            className={inputClass}
          />
        </Field>

        <Field label="Solutions" htmlFor="solutions">
          <textarea
            id="solutions"
            name="solutions"
            rows={4}
            defaultValue={project?.solutions ?? ""}
            className={inputClass}
          />
        </Field>

        <Field label="Lessons learned" htmlFor="lessons_learned">
          <textarea
            id="lessons_learned"
            name="lessons_learned"
            rows={4}
            defaultValue={project?.lessons_learned ?? ""}
            className={inputClass}
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Start date" htmlFor="start_date">
            <input
              id="start_date"
              name="start_date"
              type="date"
              defaultValue={project?.start_date ?? ""}
              className={inputClass}
            />
          </Field>
          <Field label="Completion date" htmlFor="completion_date">
            <input
              id="completion_date"
              name="completion_date"
              type="date"
              defaultValue={project?.completion_date ?? ""}
              className={inputClass}
            />
          </Field>
        </div>
      </fieldset>

      {/* Technologies */}
      <fieldset className="flex flex-col gap-4">
        <legend className="font-mono text-xs uppercase tracking-widest text-accent">
          Technologies
        </legend>
        {Object.entries(byCategory).map(([category, techs]) => (
          <div key={category}>
            <p className="font-mono text-xs capitalize text-muted">
              {category}
            </p>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2">
              {techs.map((tech) => (
                <label
                  key={tech.id}
                  className="flex items-center gap-2 font-body text-sm text-ink"
                >
                  <input
                    type="checkbox"
                    name="technology_ids"
                    value={tech.id}
                    defaultChecked={project?.technologyIds.includes(tech.id)}
                  />
                  {tech.name}
                </label>
              ))}
            </div>
          </div>
        ))}
        {technologies.length === 0 && (
          <p className="font-mono text-xs text-muted">
            No technologies yet — add rows to the `technologies` table.
          </p>
        )}
      </fieldset>

      {/* SEO */}
      <fieldset className="flex flex-col gap-4">
        <legend className="font-mono text-xs uppercase tracking-widest text-accent">
          SEO
        </legend>
        <Field label="SEO title" htmlFor="seo_title" hint="Falls back to the project title if left empty">
          <input
            id="seo_title"
            name="seo_title"
            maxLength={70}
            defaultValue={project?.seo_title ?? ""}
            className={inputClass}
          />
        </Field>
        <Field label="SEO description" htmlFor="seo_description" hint="Falls back to the short description if left empty">
          <textarea
            id="seo_description"
            name="seo_description"
            rows={2}
            maxLength={160}
            defaultValue={project?.seo_description ?? ""}
            className={inputClass}
          />
        </Field>
      </fieldset>

      <div>
        <Button type="submit" variant="primary">
          Save project
        </Button>
      </div>
    </form>
  );
}
