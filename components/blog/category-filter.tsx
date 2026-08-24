import Link from "next/link";
import type { Route } from "next";
import { cn } from "@/lib/utils";

export function CategoryFilter({
  categories,
  active,
}: {
  categories: string[];
  active?: string;
}) {
  const chip = (isActive: boolean) =>
    cn(
      "rounded-sm border px-3 py-1.5 font-mono text-xs transition-colors",
      isActive
        ? "border-accent bg-accent text-white"
        : "border-border text-muted hover:border-accent hover:text-accent"
    );

  return (
    <nav
      aria-label="Filter posts by category"
      className="flex flex-wrap gap-2"
    >
      <Link href="/blog" aria-current={!active ? "true" : undefined} className={chip(!active)}>
        All
      </Link>
      {categories.map((category) => (
        <Link
          key={category}
          href={`/blog?category=${encodeURIComponent(category)}` as Route}
          aria-current={active === category ? "true" : undefined}
          className={chip(active === category)}
        >
          {category}
        </Link>
      ))}
    </nav>
  );
}
