import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";
import { submitContactMessage } from "@/lib/actions/contact";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/seo/json-ld";
import { webPageLd } from "@/lib/structured-data";

const description = `Get in touch with ${siteConfig.name}.`;

export const metadata: Metadata = {
  title: "Contact",
  description,
  alternates: { canonical: "/contact" },
};

export default function ContactPage({
  searchParams,
}: {
  searchParams: { sent?: string; error?: string };
}) {
  return (
    <section className="mx-auto max-w-content px-6 py-20">
      <JsonLd data={webPageLd({ name: "Contact", description, path: "/contact" })} />
      <p className="font-mono text-xs uppercase tracking-widest text-accent">
        Contact
      </p>
      <h1 className="mt-3 font-display text-3xl font-semibold text-ink md:text-4xl">
        Get in touch
      </h1>
      <p className="mt-4 max-w-xl font-body text-muted">
        Have a project in mind, or just want to say hello? Send a message
        below, or reach me directly at{" "}
        <a
          href={`mailto:${siteConfig.email}`}
          className="text-accent underline"
        >
          {siteConfig.email}
        </a>
        .
      </p>

      {searchParams.sent && (
        <p
          role="status"
          className="mt-8 max-w-xl rounded-sm border border-border bg-surface px-4 py-3 font-mono text-xs text-ink"
        >
          Thanks — your message has been sent. I&apos;ll get back to you soon.
        </p>
      )}
      {searchParams.error && (
        <p
          role="alert"
          className="mt-8 max-w-xl rounded-sm border border-red-300 bg-red-50 px-4 py-3 font-mono text-xs text-red-700"
        >
          {searchParams.error}
        </p>
      )}

      <form
        action={submitContactMessage}
        className="mt-8 flex max-w-xl flex-col gap-4"
      >
        {/* Honeypot field — visually and semantically hidden from real
            visitors, left in the tab order deliberately excluded. */}
        <div
          aria-hidden="true"
          className="absolute -left-[9999px] top-auto h-0 w-0 overflow-hidden"
        >
          <label htmlFor="company">Company</label>
          <input
            id="company"
            name="company"
            type="text"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <div>
          <label
            htmlFor="name"
            className="font-mono text-xs uppercase tracking-widest text-muted"
          >
            Name
          </label>
          <input
            id="name"
            name="name"
            required
            maxLength={200}
            autoComplete="name"
            className={inputClass}
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="font-mono text-xs uppercase tracking-widest text-muted"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className={inputClass}
          />
        </div>

        <div>
          <label
            htmlFor="subject"
            className="font-mono text-xs uppercase tracking-widest text-muted"
          >
            Subject
          </label>
          <input id="subject" name="subject" maxLength={200} className={inputClass} />
        </div>

        <div>
          <label
            htmlFor="message"
            className="font-mono text-xs uppercase tracking-widest text-muted"
          >
            Message
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={6}
            maxLength={5000}
            className={inputClass}
          />
        </div>

        <div>
          <Button type="submit" variant="primary">
            Send message
          </Button>
        </div>
      </form>
    </section>
  );
}

const inputClass =
  "mt-2 w-full rounded-sm border border-border bg-transparent px-3 py-2 font-body text-sm text-ink";
