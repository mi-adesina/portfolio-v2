import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth/require-admin";
import { getAdminPostById } from "@/lib/data/admin-blog";
import { PostForm } from "@/components/admin/post-form";
import { updatePost } from "@/lib/actions/blog";

export default async function EditPostPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { error?: string; saved?: string };
}) {
  const { supabase } = await requireAdmin();
  const post = await getAdminPostById(supabase, params.id);

  if (!post) notFound();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink">
        Edit post
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
        <PostForm post={post} action={updatePost.bind(null, post.id)} />
      </div>
    </div>
  );
}
