import { publicImageUrl } from "@/lib/supabase/storage";
import { Field, inputClass } from "@/components/admin/form-field";
import { SubmitButton } from "@/components/admin/submit-button";

type PostFormPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image: string | null;
  og_image: string | null;
  status: "draft" | "published";
  category: string | null;
  seo_title: string | null;
  seo_description: string | null;
  tagNames: string[];
};

export function PostForm({
  post,
  action,
}: {
  post?: PostFormPost;
  action: (formData: FormData) => void;
}) {
  const coverUrl = publicImageUrl(post?.cover_image);
  const ogUrl = publicImageUrl(post?.og_image);
  const isEditing = Boolean(post);

  return (
    <form action={action} className="flex flex-col gap-10">
      <fieldset className="flex flex-col gap-4">
        <legend className="font-mono text-xs uppercase tracking-widest text-accent">
          Core
        </legend>

        <Field label="Title" htmlFor="title">
          <input
            id="title"
            name="title"
            required
            defaultValue={post?.title}
            className={inputClass}
          />
        </Field>

        <Field
          label="Slug"
          htmlFor="slug"
          hint="Lowercase, numbers, hyphens only — used in the URL"
        >
          <input
            id="slug"
            name="slug"
            required
            pattern="[a-z0-9]+(-[a-z0-9]+)*"
            defaultValue={post?.slug}
            className={inputClass}
          />
        </Field>

        <Field
          label="Excerpt"
          htmlFor="excerpt"
          hint="Shown on the blog index and in search results"
        >
          <textarea
            id="excerpt"
            name="excerpt"
            rows={2}
            maxLength={300}
            defaultValue={post?.excerpt ?? ""}
            className={inputClass}
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Status" htmlFor="status">
            <select
              id="status"
              name="status"
              defaultValue={post?.status ?? "draft"}
              className={inputClass}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </Field>
          <Field label="Category" htmlFor="category">
            <input
              id="category"
              name="category"
              defaultValue={post?.category ?? ""}
              className={inputClass}
            />
          </Field>
        </div>
      </fieldset>

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
            // eslint-disable-next-line @next/next/no-img-element -- small admin-only preview thumbnail
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
          hint="Used for social share previews. Falls back to the cover image if left empty."
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

      <fieldset className="flex flex-col gap-4">
        <legend className="font-mono text-xs uppercase tracking-widest text-accent">
          Content
        </legend>
        <Field
          label="Content"
          htmlFor="content"
          hint="Write using simple Markdown. Use a blank line between paragraphs."
        >
          <textarea
            id="content"
            name="content"
            required
            rows={16}
            defaultValue={post?.content ?? ""}
            className={inputClass}
          />
        </Field>
        <Field
          label="Tags"
          htmlFor="tags"
          hint="Comma-separated — new tags are created automatically"
        >
          <input
            id="tags"
            name="tags"
            defaultValue={post?.tagNames.join(", ") ?? ""}
            className={inputClass}
          />
        </Field>
      </fieldset>

      <fieldset className="flex flex-col gap-4">
        <legend className="font-mono text-xs uppercase tracking-widest text-accent">
          SEO
        </legend>
        <Field
          label="SEO title"
          htmlFor="seo_title"
          hint="Falls back to the post title if left empty"
        >
          <input
            id="seo_title"
            name="seo_title"
            maxLength={70}
            defaultValue={post?.seo_title ?? ""}
            className={inputClass}
          />
        </Field>
        <Field
          label="SEO description"
          htmlFor="seo_description"
          hint="Falls back to the excerpt if left empty"
        >
          <textarea
            id="seo_description"
            name="seo_description"
            rows={2}
            maxLength={160}
            defaultValue={post?.seo_description ?? ""}
            className={inputClass}
          />
        </Field>
      </fieldset>

      <div>
        <SubmitButton
          label={isEditing ? "Save changes" : "Create post"}
          pendingLabel={isEditing ? "Saving changes..." : "Creating post..."}
        />
      </div>
    </form>
  );
}
