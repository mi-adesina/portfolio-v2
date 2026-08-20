import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "About",
  description: `About ${siteConfig.name} — background, approach, and how mathematics shapes the way I build software.`,
  alternates: { canonical: "/about" },
};

const sections: { heading: string; body: string }[] = [
  {
    heading: "Mathematics background",
    body:
      "I studied Pure Mathematics at the University of Lagos. That training shaped how I approach problems in general: breaking a system down to its underlying structure before writing a single line of code, and being comfortable holding several abstractions in mind at once.",
    // TODO: add specifics — thesis focus, notable coursework, or a concrete
    // example of how a mathematical idea shaped an engineering decision.
  },
  {
    heading: "Into software development",
    body:
      "I moved from mathematics into full-stack development, building on the same foundation of structured, logical thinking. Today I work primarily across the JavaScript/TypeScript ecosystem — Next.js and React on the front end, Node.js and Express on the back end.",
    // TODO: add the specific turning point — a course, a project, a job —
    // that marked the transition, if you want that detail public.
  },
  {
    heading: "Front-end development",
    body:
      "I build interfaces with React and Next.js, with attention to performance, accessibility, and responsive design across devices — not just how a page looks, but how it holds up under real usage.",
  },
  {
    heading: "Full-stack development",
    body:
      "Beyond the interface, I work across the stack: designing schemas, building APIs, wiring up authentication and authorization, and deploying and maintaining the systems I build. My primary tools here are Node.js, Express, MongoDB, and Supabase (Postgres).",
  },
  {
    heading: "Approach to engineering",
    body:
      "I care about building things that are useful, not just impressive in a demo. That means thinking about maintainability and security from the start, not bolting them on later, and being honest about trade-offs rather than overselling a solution.",
    // TODO: add a concrete example or two once available.
  },
  {
    heading: "Teaching and communication",
    body:
      "I have experience as a mathematics educator and tutor. Teaching mathematics — a subject that punishes vague explanations — trained me to break down complex ideas into something a specific audience can actually follow, which carries directly into writing documentation, code reviews, and technical discussions.",
  },
];

export default function AboutPage() {
  return (
    <section className="mx-auto max-w-content px-6 py-20">
      <p className="font-mono text-xs uppercase tracking-widest text-accent">
        About
      </p>
      <h1 className="mt-3 max-w-2xl font-display text-3xl font-semibold text-ink md:text-4xl">
        From pure mathematics to full-stack engineering
      </h1>

      <div className="mt-14 grid gap-12 md:grid-cols-[200px_1fr]">
        {sections.map((section) => (
          <div key={section.heading} className="contents">
            <h2 className="font-mono text-xs uppercase tracking-widest text-muted">
              {section.heading}
            </h2>
            <p className="max-w-2xl font-body text-base leading-relaxed text-ink md:-mt-1">
              {section.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
