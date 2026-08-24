import Link from "next/link";
import type { Route } from "next";
import { cn } from "@/lib/utils";

export function TechnologyFilter({
  technologies,
  active,
}: {
  technologies: { name: string; slug: string }[];
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
      aria-label="Filter projects by technology"
      className="flex flex-wrap gap-2"
    >
      <Link
        href="/projects"
        aria-current={!active ? "true" : undefined}
        className={chip(!active)}
      >
        All
      </Link>
      {technologies.map((t) => (
        <Link
          key={t.slug}
          href={`/projects?tech=${t.slug}` as Route}
          aria-current={active === t.slug ? "true" : undefined}
          className={chip(active === t.slug)}
        >
          {t.name}
        </Link>
      ))}
    </nav>
  );
}
