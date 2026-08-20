import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${siteConfig.name}.`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <section className="mx-auto max-w-content px-6 py-20">
      <p className="font-mono text-xs uppercase tracking-widest text-accent">
        Contact
      </p>
      <h1 className="mt-3 font-display text-3xl font-semibold text-ink md:text-4xl">
        Get in touch
      </h1>
      <p className="mt-4 max-w-xl font-body text-muted">
        The contact form — with validation, spam protection, and storage in
        Supabase — is built in Phase 6. For now, reach me directly at{" "}
        <a href={`mailto:${siteConfig.email}`} className="text-accent underline">
          {siteConfig.email}
        </a>
        .
      </p>
    </section>
  );
}
