import Link from "next/link";
import { Hero } from "@/components/marketing/hero";
import { ProjectCard } from "@/components/projects/project-card";
import { getFeaturedProjects } from "@/lib/data/projects";

export const revalidate = 60;

export default async function HomePage() {
  const featuredProjects = await getFeaturedProjects(3);

  return (
    <>
      <Hero />

      <section className="mx-auto max-w-content px-6 py-24">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-accent">
              Portfolio
            </p>
            <h2 className="mt-2 font-display text-2xl font-semibold text-ink md:text-3xl">
              Selected work
            </h2>
          </div>
          <Link
            href="/projects"
            className="font-mono text-xs uppercase tracking-widest text-accent hover:underline"
          >
            View all →
          </Link>
        </div>

        {featuredProjects.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-10 text-center">
            <p className="font-mono text-xs text-muted">
              No featured projects yet — mark a published project as
              featured from /admin (Phase 4).
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
