import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";
import { JsonLd } from "@/components/seo/json-ld";
import { webPageLd } from "@/lib/structured-data";

const description = `Learn about ${siteConfig.name}, a Full-Stack Engineer based in Lagos, Nigeria, with a background in Pure Mathematics and expertise in Next.js, React, TypeScript, serverless backends, and AI workflows.`;

export const metadata: Metadata = {
  title: "About",
  description,
  alternates: { canonical: "/about" },
  openGraph: {
    title: `About | ${siteConfig.name}`,
    description,
    url: `${siteConfig.url}/about`,
    type: "profile",
  },
  twitter: {
    card: "summary_large_image",
    title: `About | ${siteConfig.name}`,
    description,
  },
};

const sections: { heading: string; body: string }[] = [
  {
    heading: "Mathematics background",
    body:
      "I earned a B.Sc. in Pure Mathematics from the University of Lagos. Mathematics trained me to think in terms of structure, logic, and abstract systems—skills that translate directly into software engineering. Whether I'm designing database schemas, architecting state flows, or debugging complex async logic, I approach problems by breaking them into fundamental, verifiable parts.",
  },
  {
    heading: "Into software development",
    body:
      "My transition into software engineering grew naturally from my passion for computational logic and problem-solving. What began as curiosity evolved into building production applications with modern TypeScript ecosystems. I focus on creating fast, reliable, and maintainable applications that scale seamlessly.",
  },
  {
    heading: "Front-end engineering",
    body:
      "I build modern, performant user interfaces using Next.js (App Router), React 19, and TypeScript. Styled with Tailwind CSS and animated using Framer Motion, my focus is on delivering responsive, accessible, and fluid user experiences with 95+ Lighthouse performance scores.",
  },
  {
    heading: "Full-stack & AI systems",
    body:
      "Beyond the UI, I design and maintain end-to-end web applications. I build serverless architectures and real-time backend systems with Convex, Node.js, and Supabase. Additionally, I integrate Claude LLM APIs to build automated AI workflows, dynamic content engines, and context-aware application features.",
  },
  {
    heading: "Approach to engineering",
    body:
      "I believe great software balances functionality, maintainability, and execution speed. I leverage modern development tools—including AI coding assistants like Cursor and Claude Code—to accelerate boilerplate creation and test writing, while strictly verifying code logic through automated testing, type checks, and manual reviews.",
  },
  {
    heading: "Teaching and communication",
    body:
      "Alongside engineering, I have years of experience teaching and tutoring mathematics. Teaching honed my technical communication skills and taught me how to break down complex concepts clearly. These skills translate directly into software development through technical documentation, cross-functional collaboration, and effective code reviews.",
  },
];

export default function AboutPage() {
  return (
    <section className="mx-auto max-w-content px-6 py-20">
      <JsonLd data={webPageLd({ name: "About", description, path: "/about" })} />
      
      <p className="font-mono text-xs uppercase tracking-widest text-accent">
        About
      </p>
      
      <h1 className="mt-3 max-w-2xl font-display text-3xl font-semibold text-ink md:text-4xl">
        From pure mathematics to full-stack & AI engineering
      </h1>

      <div className="mt-14 space-y-12 md:space-y-10">
        {sections.map((section) => (
          <div 
            key={section.heading} 
            className="grid gap-2 md:grid-cols-[200px_1fr] md:gap-12"
          >
            <h2 className="font-mono text-xs uppercase tracking-widest text-muted md:pt-1">
              {section.heading}
            </h2>
            <p className="max-w-2xl font-body text-base leading-relaxed text-ink">
              {section.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}