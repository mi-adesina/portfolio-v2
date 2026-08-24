import type { Metadata } from "next";
import { getAllExperience } from "@/lib/data/experience";
import { JsonLd } from "@/components/seo/json-ld";
import { webPageLd } from "@/lib/structured-data";

const description = "Professional experience.";

export const metadata: Metadata = {
  title: "Experience",
  description,
  alternates: { canonical: "/experience" },
};

export const revalidate = 60;

function formatDate(iso: string | null) {
  if (!iso) return "Present";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  });
}

export default async function ExperiencePage() {
  const experience = await getAllExperience();

  return (
    <section className="mx-auto max-w-content px-6 py-20">
      <JsonLd
        data={webPageLd({
          name: "Experience",
          description,
          path: "/experience",
        })}
      />

      <p className="font-mono text-xs uppercase tracking-widest text-accent">
        Experience
      </p>
      <h1 className="mt-3 font-display text-3xl font-semibold text-ink md:text-4xl">
        Where I&apos;ve worked
      </h1>

      {experience.length === 0 ? (
        <div className="mt-16 rounded-sm border border-dashed border-border p-10 text-center">
          <p className="font-mono text-xs text-muted">
            No experience entries yet — add one from /admin.
          </p>
        </div>
      ) : (
        <div className="mt-14 flex flex-col gap-14">
          {experience.map((role) => (
            <div
              key={role.id}
              className="grid gap-3 md:grid-cols-[200px_1fr] md:gap-12"
            >
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-muted">
                  {formatDate(role.start_date)} — {formatDate(role.end_date)}
                </p>
              </div>
              <div className="max-w-2xl">
                <h2 className="font-display text-lg font-semibold text-ink">
                  {role.position}
                </h2>
                <p className="mt-1 font-body text-sm text-muted">
                  {role.company}
                </p>

                {role.description && (
                  <p className="mt-4 font-body text-base leading-relaxed text-ink">
                    {role.description}
                  </p>
                )}

                {role.responsibilities.length > 0 && (
                  <ul className="mt-4 list-disc space-y-1 pl-5 font-body text-sm leading-relaxed text-ink">
                    {role.responsibilities.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}

                {role.achievements.length > 0 && (
                  <ul className="mt-4 list-disc space-y-1 pl-5 font-body text-sm leading-relaxed text-ink">
                    {role.achievements.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}

                {role.technologies.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {role.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-sm border border-border px-2 py-1 font-mono text-xs text-muted"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
