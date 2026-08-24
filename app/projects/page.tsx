import type { Metadata } from "next";
import {
  getPublishedProjects,
  collectFilterTechnologies,
} from "@/lib/data/projects";
import { ProjectCard } from "@/components/projects/project-card";
import { TechnologyFilter } from "@/components/projects/technology-filter";
import { JsonLd } from "@/components/seo/json-ld";
import { webPageLd } from "@/lib/structured-data";

const description =
  "Selected full-stack software projects built with Next.js, React, TypeScript, and Supabase.";

export const metadata: Metadata = {
  title: "Projects",
  description,
  alternates: { canonical: "/projects" },
};

// Revalidate periodically so admin edits show up without a full redeploy.
export const revalidate = 60;

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: { tech?: string };
}) {
  const allProjects = await getPublishedProjects();
  const technologies = collectFilterTechnologies(allProjects);

  const activeTech = searchParams.tech;
  const projects = activeTech
    ? allProjects.filter((p) =>
        p.technologies.some((t) => t.slug === activeTech)
      )
    : allProjects;

  return (
    <section className="mx-auto max-w-content px-6 py-20">
      <JsonLd data={webPageLd({ name: "Projects", description, path: "/projects" })} />
      <p className="font-mono text-xs uppercase tracking-widest text-accent">
        Projects
      </p>
      <h1 className="mt-3 font-display text-3xl font-semibold text-ink md:text-4xl">
        Selected work
      </h1>

      {technologies.length > 0 && (
        <div className="mt-8">
          <TechnologyFilter technologies={technologies} active={activeTech} />
        </div>
      )}

      {projects.length === 0 ? (
        <div className="mt-16 rounded-sm border border-dashed border-border p-10 text-center">
          <p className="font-mono text-xs text-muted">
            {allProjects.length === 0
              ? "No published projects yet. Publish one from /admin (Phase 4), or review the placeholder in supabase/seed.sql."
              : "No projects match this filter."}
          </p>
        </div>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </section>
  );
}
