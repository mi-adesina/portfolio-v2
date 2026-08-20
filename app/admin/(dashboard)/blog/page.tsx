import Link from "next/link";
import { requireAdmin } from "@/lib/auth/require-admin";
import { getAllPostsAdmin } from "@/lib/data/admin-blog";
import { setPostStatus, deletePost } from "@/lib/actions/blog";
import { ConfirmSubmitButton } from "@/components/admin/confirm-submit-button";

export const dynamic = "force-dynamic";

export default async function AdminBlogPage() {
  const { supabase } = await requireAdmin();
  const posts = await getAllPostsAdmin(supabase);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-ink">
          Blog posts
        </h1>
        <Link
          href="/admin/blog/new"
          className="rounded-sm border border-accent bg-accent px-4 py-2 font-mono text-xs text-white transition-opacity hover:opacity-90"
        >
          New post
        </Link>
      </div>

      {posts.length === 0 ? (
        <p className="mt-10 font-mono text-xs text-muted">
          No posts yet — write your first one.
        </p>
      ) : (
        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse text-left">
            <thead>
              <tr className="border-b border-border font-mono text-xs uppercase tracking-widest text-muted">
                <th className="py-2 pr-4 font-medium">Title</th>
                <th className="py-2 pr-4 font-medium">Status</th>
                <th className="py-2 pr-4 font-medium">Published</th>
                <th className="py-2 pr-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} className="border-b border-border">
                  <td className="py-3 pr-4">
                    <Link
                      href={`/admin/blog/${post.id}`}
                      className="font-body text-sm text-ink hover:text-accent"
                    >
                      {post.title}
                    </Link>
                  </td>
                  <td className="py-3 pr-4">
                    <form
                      action={setPostStatus.bind(
                        null,
                        post.id,
                        post.status === "published" ? "draft" : "published"
                      )}
                    >
                      <button
                        type="submit"
                        title="Click to toggle"
                        className="rounded-sm border border-border px-2 py-1 font-mono text-xs text-muted hover:border-accent hover:text-accent"
                      >
                        {post.status}
                      </button>
                    </form>
                  </td>
                  <td className="py-3 pr-4 font-mono text-xs text-muted">
                    {post.published_at
                      ? new Date(post.published_at).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-4">
                      <Link
                        href={`/admin/blog/${post.id}`}
                        className="font-mono text-xs text-accent hover:underline"
                      >
                        Edit
                      </Link>
                      <form action={deletePost.bind(null, post.id)}>
                        <ConfirmSubmitButton
                          label="Delete"
                          confirmMessage={`Delete "${post.title}"? This can't be undone.`}
                        />
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
