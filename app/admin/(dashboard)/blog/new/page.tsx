import { requireAdmin } from "@/lib/auth/require-admin";
import { PostForm } from "@/components/admin/post-form";
import { createPost } from "@/lib/actions/blog";

export default async function NewPostPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  await requireAdmin();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink">
        New post
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
        <PostForm action={createPost} />
      </div>
    </div>
  );
}
