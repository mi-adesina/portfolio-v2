import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { ArrowUpRight } from "lucide-react";
import { publicImageUrl } from "@/lib/supabase/storage";
import { TechBadge } from "@/components/projects/tech-badge";
import type { ProjectListItem } from "@/lib/data/projects";

export function ProjectCard({ project }: { project: ProjectListItem }) {
  const coverUrl = publicImageUrl(project.cover_image);

  return (
    <Link
      href={`/projects/${project.slug}` as Route}
      className="group block overflow-hidden rounded-xl border border-border bg-surface p-1.5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-accent/40 hover:shadow-lg"
    >
      <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-bg">
        {coverUrl ? (
          <Image
            src={coverUrl}
            alt={`${project.title} cover image`}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
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
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-display text-lg font-semibold text-ink">
            {project.title}
          </h3>
          <ArrowUpRight
            size={18}
            className="mt-1 shrink-0 text-muted transition-colors group-hover:text-accent"
            aria-hidden
          />
        </div>

        <p className="mt-2 line-clamp-2 font-body text-sm text-muted">
          {project.short_description}
        </p>

        {project.technologies.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {project.technologies.slice(0, 4).map((t) => (
              <TechBadge key={t.slug} name={t.name} />
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
