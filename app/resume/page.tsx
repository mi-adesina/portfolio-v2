import type { Metadata } from "next";
import Link from "next/link";
import type { Route } from "next";
import { Download } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { Button } from "@/components/ui/button";
import { getAllExperience } from "@/lib/data/experience";
import { getFeaturedProjects } from "@/lib/data/projects";
import { JsonLd } from "@/components/seo/json-ld";
import { webPageLd } from "@/lib/structured-data";

const description = `${siteConfig.name}'s resume — skills, experience, and education.`;

export const metadata: Metadata = {
  title: "Resume",
  description,
  alternates: { canonical: "/resume" },
};

export const revalidate = 60;

function formatDate(iso: string | null) {
  if (!iso) return "Present";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  });
}

export default async function ResumePage() {
  const [experience, projects] = await Promise.all([
    getAllExperience(),
    getFeaturedProjects(3),
  ]);

  const skillGroups = Object.entries(siteConfig.skills) as [
    keyof typeof siteConfig.skills,
    readonly string[],
  ][];

  return (
    <section className="mx-auto max-w-content px-6 py-20">
      <JsonLd data={webPageLd({ name: "Resume", description, path: "/resume" })} />

      <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-accent">
            Resume
          </p>
          <h1 className="mt-3 font-display text-3xl font-semibold text-ink md:text-4xl">
            {siteConfig.name}
          </h1>
          <p className="mt-2 font-body text-muted">{siteConfig.role}</p>
        </div>
        <Button href={siteConfig.links.resume} variant="primary">
          <Download size={16} aria-hidden />
          Download Resume
        </Button>
      </div>

      <div className="mt-16">
        <h2 className="font-mono text-xs uppercase tracking-widest text-muted">
          Skills
        </h2>
        <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {skillGroups.map(([category, skills]) => (
            <div key={category}>
              <p className="font-mono text-xs capitalize text-accent">
                {category}
              </p>
              <ul className="mt-2 flex flex-col gap-1 font-body text-sm text-ink">
                {skills.map((skill) => (
                  <li key={skill}>{skill}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-16">
        <h2 className="font-mono text-xs uppercase tracking-widest text-muted">
          Experience
        </h2>
        {experience.length === 0 ? (
          <p className="mt-4 font-mono text-xs text-muted">
            No experience entries yet.
          </p>
        ) : (
          <div className="mt-4 flex flex-col gap-6">
            {experience.map((role) => (
              <div key={role.id}>
                <p className="font-body text-sm font-semibold text-ink">
                  {role.position} · {role.company}
                </p>
                <p className="font-mono text-xs text-muted">
                  {formatDate(role.start_date)} — {formatDate(role.end_date)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {projects.length > 0 && (
        <div className="mt-16">
          <h2 className="font-mono text-xs uppercase tracking-widest text-muted">
            Relevant projects
          </h2>
          <ul className="mt-4 flex flex-col gap-2">
            {projects.map((project) => (
              <li key={project.id}>
                <Link
                  href={`/projects/${project.slug}` as Route}
                  className="font-body text-sm text-accent hover:underline"
                >
                  {project.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-16">
        <h2 className="font-mono text-xs uppercase tracking-widest text-muted">
          Education
        </h2>
        <p className="mt-4 font-body text-sm text-ink">
          Pure Mathematics, University of Lagos
        </p>
      </div>
    </section>
  );
}
