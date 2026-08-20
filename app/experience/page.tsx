import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Experience",
  description: "Professional experience.",
  alternates: { canonical: "/experience" },
};

export default function ExperiencePage() {
  return (
    <section className="mx-auto max-w-content px-6 py-20">
      <p className="font-mono text-xs uppercase tracking-widest text-accent">
        Experience
      </p>
      <h1 className="mt-3 font-display text-3xl font-semibold text-ink md:text-4xl">
        Where I&apos;ve worked
      </h1>
      <div className="mt-16 rounded-sm border border-dashed border-border p-10 text-center">
        <p className="font-mono text-xs text-muted">
          Experience entries render here once the `experience` table is
          seeded (Phase 3+). Add real roles — nothing is fabricated by
          default.
        </p>
      </div>
    </section>
  );
}
