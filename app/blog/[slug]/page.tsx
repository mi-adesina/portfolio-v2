import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getPostBySlug, getPublishedPosts } from "@/lib/data/blog";
import { publicImageUrl } from "@/lib/supabase/storage";
import { TagBadge } from "@/components/blog/tag-badge";
import { siteConfig } from "@/lib/site-config";

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

  // Content is stored as plain text — paragraphs are separated by a
  // blank line. No markdown renderer here by design (see README):
  // it's an unnecessary dependency for a single-author blog until
  // there's an actual need for rich formatting.
  const paragraphs = post.content
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    ...(post.excerpt ? { description: post.excerpt } : {}),
    author: { "@type": "Person", name: siteConfig.name, url: siteConfig.url },
    ...(post.published_at ? { datePublished: post.published_at } : {}),
    dateModified: post.updated_at,
    ...(coverUrl ? { image: coverUrl } : {}),
  };

  return (
    <article className="mx-auto max-w-2xl px-6 py-20">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
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

      <div className="mt-10 flex flex-col gap-5 font-body text-base leading-relaxed text-ink">
        {paragraphs.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </article>
  );
}
