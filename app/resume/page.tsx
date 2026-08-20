import type { Metadata } from "next";
import { Download } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Resume",
  description: `${siteConfig.name}'s resume — skills, experience, and education.`,
  alternates: { canonical: "/resume" },
};

export default function ResumePage() {
  return (
    <section className="mx-auto max-w-content px-6 py-20">
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

      {/*
        Phase 3+ pulls Skills / Experience / Projects sections from the same
        Supabase tables used on /experience and /projects, so this page and
        those stay in sync automatically instead of duplicating data.
      */}
      <div className="mt-16 rounded-sm border border-dashed border-border p-10 text-center">
        <p className="font-mono text-xs text-muted">
          Summary, skills, and experience sections render here, sourced from
          the same data as the Experience and Projects pages (Phase 3+).
        </p>
      </div>
    </section>
  );
}
