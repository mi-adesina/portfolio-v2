import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { publicImageUrl } from "@/lib/supabase/storage";
import type { PostListItem } from "@/lib/data/blog";

function formatDate(iso: string | null) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function PostCard({ post }: { post: PostListItem }) {
  const coverUrl = publicImageUrl(post.cover_image);
  const date = formatDate(post.published_at);

  return (
    <Link
      href={`/blog/${post.slug}` as Route}
      className="group block overflow-hidden rounded-xl border border-border bg-surface p-1.5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-accent/40 hover:shadow-lg"
    >
      <div className="relative aspect-[16/9] overflow-hidden rounded-lg bg-bg">
        {coverUrl ? (
          <Image
            src={coverUrl}
            alt={`${post.title} cover image`}
            fill
            sizes="(min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="font-mono text-xs text-muted">
              No cover image
            </span>
          </div>
        )}
      </div>

      <div className="p-5">
        {(post.category || date) && (
          <p className="font-mono text-xs uppercase tracking-widest text-muted">
            {post.category}
            {post.category && date && " · "}
            {date}
          </p>
        )}
        <h3 className="mt-2 font-display text-lg font-semibold text-ink">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="mt-2 line-clamp-2 font-body text-sm text-muted">
            {post.excerpt}
          </p>
        )}
      </div>
    </Link>
  );
}
