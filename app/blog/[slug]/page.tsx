import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getPostBySlug, getPublishedPosts } from "@/lib/data/blog";
import { publicImageUrl } from "@/lib/supabase/storage";
import { TagBadge } from "@/components/blog/tag-badge";
import { BlogContent } from "@/components/blog/blog-content";
import { JsonLd } from "@/components/seo/json-ld";
import { articleLd } from "@/lib/structured-data";

export const revalidate = 60;

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);
  if (!post) return {};

  const title = post.seo_title || post.title;
  const description = post.seo_description || post.excerpt || undefined;
  const ogImage = publicImageUrl(post.og_image || post.cover_image);

  return {
    title,
    description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: post.published_at ?? undefined,
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
    // See the same note on the project detail page — openGraph and
    // twitter don't sync automatically in Next.js metadata.
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

function formatDate(iso: string | null) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPostBySlug(params.slug);
  if (!post) notFound();

  const coverUrl = publicImageUrl(post.cover_image);
  const date = formatDate(post.published_at);

  return (
    <article className="mx-auto max-w-2xl px-6 py-20">
      <JsonLd
        data={articleLd({
          headline: post.title,
          description: post.excerpt ?? undefined,
          datePublished: post.published_at,
          dateModified: post.updated_at,
          image: coverUrl,
        })}
      />

      {post.category && (
        <p className="font-mono text-xs uppercase tracking-widest text-accent">
          {post.category}
        </p>
      )}
      <h1 className="mt-3 font-display text-3xl font-semibold text-ink md:text-4xl">
        {post.title}
      </h1>
      {date && <p className="mt-3 font-mono text-xs text-muted">{date}</p>}

      {post.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <TagBadge key={tag.slug} name={tag.name} />
          ))}
        </div>
      )}

      {coverUrl && (
        <div className="tick-frame relative mt-10 aspect-[16/9] w-full overflow-hidden rounded-sm border border-border">
          <Image
            src={coverUrl}
            alt={`${post.title} cover image`}
            fill
            sizes="100vw"
            priority
            className="object-cover"
          />
        </div>
      )}

      <div className="mt-10">
        <BlogContent content={post.content} />
      </div>
    </article>
  );
}
