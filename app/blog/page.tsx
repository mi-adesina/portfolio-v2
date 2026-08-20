import type { Metadata } from "next";
import { getPublishedPosts, collectCategories } from "@/lib/data/blog";
import { PostCard } from "@/components/blog/post-card";
import { CategoryFilter } from "@/components/blog/category-filter";

export const metadata: Metadata = {
  title: "Blog",
  description: "Technical writing on software development and mathematics.",
  alternates: { canonical: "/blog" },
};

export const revalidate = 60;

export default async function BlogPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const allPosts = await getPublishedPosts();
  const categories = collectCategories(allPosts);

  const activeCategory = searchParams.category;
  const posts = activeCategory
    ? allPosts.filter((p) => p.category === activeCategory)
    : allPosts;

  return (
    <section className="mx-auto max-w-content px-6 py-20">
      <p className="font-mono text-xs uppercase tracking-widest text-accent">
        Blog
      </p>
      <h1 className="mt-3 font-display text-3xl font-semibold text-ink md:text-4xl">
        Writing
      </h1>

      {categories.length > 0 && (
        <div className="mt-8">
          <CategoryFilter categories={categories} active={activeCategory} />
        </div>
      )}

      {posts.length === 0 ? (
        <div className="mt-16 rounded-sm border border-dashed border-border p-10 text-center">
          <p className="font-mono text-xs text-muted">
            {allPosts.length === 0
              ? "No published posts yet. Write one from /admin."
              : "No posts in this category."}
          </p>
        </div>
      ) : (
        <div className="mt-10 grid gap-8 sm:grid-cols-2">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </section>
  );
}
