import { siteConfig } from "@/lib/site-config";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="dot-grid relative overflow-hidden border-b border-border">
      <div className="mx-auto flex max-w-content flex-col gap-8 px-6 py-24 md:py-32">
        <div className="tick-frame inline-flex w-fit items-center gap-2 px-4 py-1.5">
          <span className="font-mono text-xs uppercase tracking-widest text-accent">
            {siteConfig.role}
          </span>
        </div>

        <h1 className="max-w-3xl animate-fade-up font-display text-4xl font-semibold leading-[1.1] tracking-tight text-ink md:text-6xl">
          {siteConfig.headline}
        </h1>

        <p className="max-w-xl animate-fade-up font-body text-lg text-muted">
          Based in {siteConfig.location}. I design, build, and ship
          full-stack applications end to end — from schema to deployment —
          with a background in pure mathematics that shapes how I approach
          problems.
        </p>

        <div className="flex flex-wrap gap-4">
          <Button href="/projects" size="md" variant="primary">
            View Projects
          </Button>
          <Button href="/contact" size="md" variant="secondary">
            Contact Me
          </Button>
        </div>
      </div>
    </section>
  );
}
