import { publicImageUrl } from "@/lib/supabase/storage";
import { addProjectImage, deleteProjectImage } from "@/lib/actions/projects";
import { ConfirmSubmitButton } from "@/components/admin/confirm-submit-button";
import { Button } from "@/components/ui/button";

type GalleryImage = {
  id: string;
  path: string;
  alt: string;
  sort_order: number;
};

export function ImageGalleryManager({
  projectId,
  images,
}: {
  projectId: string;
  images: GalleryImage[];
}) {
  return (
    <div>
      {images.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((image) => {
            const url = publicImageUrl(image.path);
            return (
              <div
                key={image.id}
                className="rounded-sm border border-border p-2"
              >
                {url && (
                  // eslint-disable-next-line @next/next/no-img-element -- small admin-only gallery thumbnail
                  <img
                    src={url}
                    alt={image.alt || "Project screenshot"}
                    className="aspect-[4/3] w-full rounded-sm object-cover"
                  />
                )}
                <p className="mt-2 truncate font-mono text-xs text-muted">
                  {image.alt || "(no alt text)"}
                </p>
                <form
                  action={deleteProjectImage.bind(
                    null,
                    image.id,
                    image.path,
                    projectId
                  )}
                  className="mt-2"
                >
                  <ConfirmSubmitButton
                    label="Delete"
                    confirmMessage="Delete this image?"
                  />
                </form>
              </div>
            );
          })}
        </div>
      )}

      <form
        action={addProjectImage.bind(null, projectId)}
        className="mt-6 flex flex-wrap items-end gap-4"
      >
        <div>
          <label
            htmlFor="image_file"
            className="font-mono text-xs uppercase tracking-widest text-muted"
          >
            Add screenshot
          </label>
          <input
            id="image_file"
            name="image_file"
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            required
            className="mt-2 block font-body text-sm text-ink"
          />
        </div>
        <div className="flex-1">
          <label
            htmlFor="alt"
            className="font-mono text-xs uppercase tracking-widest text-muted"
          >
            Alt text
          </label>
          <input
            id="alt"
            name="alt"
            placeholder="Describe what's shown"
            className="mt-2 w-full rounded-sm border border-border bg-transparent px-3 py-2 font-body text-sm text-ink"
          />
        </div>
        <Button type="submit" variant="secondary">
          Upload
        </Button>
      </form>
    </div>
  );
}
