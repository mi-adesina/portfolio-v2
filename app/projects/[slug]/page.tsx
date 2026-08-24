import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Github, ExternalLink } from "lucide-react";
import { getProjectBySlug, getPublishedProjects } from "@/lib/data/projects";
import { publicImageUrl } from "@/lib/supabase/storage";
import { TechBadge } from "@/components/projects/tech-badge";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/seo/json-ld";
import { softwareApplicationLd } from "@/lib/structured-data";

export const revalidate = 60;

export async function generateStaticParams() {
  const projects = await getPublishedProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const project = await getProjectBySlug(params.slug);
  if (!project) return {};

  const title = project.seo_title || project.title;
  const description = project.seo_description || project.short_description;
  const ogImage = publicImageUrl(project.og_image || project.cover_image);

  return {
    title,
    description,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      title,
      description,
      type: "article",
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
    // Without this, Twitter cards fall back to the root layout's
    // generic site title/description instead of this project's —
    // openGraph and twitter are separate metadata namespaces in
    // Next.js and don't sync automatically.
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: { slug: string };
}) {
  const project = await getProjectBySlug(params.slug);
  if (!project) notFound();

  const coverUrl = publicImageUrl(project.cover_image);

  const narrativeSections: { heading: string; body: string | null }[] = [
    { heading: "Overview", body: project.full_description },
    { heading: "Challenges", body: project.challenges },
    { heading: "Solutions", body: project.solutions },
    { heading: "Lessons learned", body: project.lessons_learned },
  ];

  return (
    <article className="mx-auto max-w-content px-6 py-20">
      <JsonLd
        data={softwareApplicationLd({
          name: project.title,
          description: project.short_description,
          url: project.live_url ?? undefined,
        })}
      />

      <p className="font-mono text-xs uppercase tracking-widest text-accent">
        Case study
      </p>
      <h1 className="mt-3 max-w-2xl font-display text-3xl font-semibold text-ink md:text-5xl">
        {project.title}
      </h1>
      <p className="mt-4 max-w-2xl font-body text-lg text-muted">
        {project.short_description}
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        {project.live_url && (
          <Button href={project.live_url} external variant="primary">
            <ExternalLink size={16} aria-hidden />
            Live demo
          </Button>
        )}
        {project.github_url && (
          <Button href={project.github_url} external variant="secondary">
            <Github size={16} aria-hidden />
            GitHub
          </Button>
        )}
      </div>

      {project.technologies.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {project.technologies.map((t) => (
            <TechBadge key={t.slug} name={t.name} />
          ))}
        </div>
      )}

      {coverUrl && (
        <div className="tick-frame relative mt-12 aspect-[16/9] w-full overflow-hidden rounded-sm border border-border">
          <Image
            src={coverUrl}
            alt={`${project.title} cover image`}
            fill
            sizes="100vw"
            priority
            className="object-cover"
          />
        </div>
      )}

      <div className="mt-14 grid gap-12 md:grid-cols-[200px_1fr]">
        {narrativeSections
          .filter((section) => section.body)
          .map((section) => (
            <div key={section.heading} className="contents">
              <h2 className="font-mono text-xs uppercase tracking-widest text-muted">
                {section.heading}
              </h2>
              <p className="max-w-2xl whitespace-pre-line font-body text-base leading-relaxed text-ink md:-mt-1">
                {section.body}
              </p>
            </div>
          ))}

        {project.features.length > 0 && (
          <div className="contents">
            <h2 className="font-mono text-xs uppercase tracking-widest text-muted">
              Features
            </h2>
            <ul className="max-w-2xl list-disc space-y-1 pl-5 font-body text-base leading-relaxed text-ink md:-mt-1">
              {project.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {project.images.length > 0 && (
        <div className="mt-16">
          <h2 className="font-mono text-xs uppercase tracking-widest text-muted">
            Gallery
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {project.images.map((image) => {
              const url = publicImageUrl(image.path);
              if (!url) return null;
              return (
                <div
                  key={image.path}
                  className="relative aspect-[4/3] overflow-hidden rounded-sm border border-border"
                >
                  <Image
                    src={url}
                    alt={image.alt || `${project.title} screenshot`}
                    fill
                    sizes="(min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </article>
  );
}
