import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";
import { JsonLd } from "@/components/seo/json-ld";
import { webPageLd } from "@/lib/structured-data";

const description = `Learn about ${siteConfig.name}, a Full-Stack Developer based in Lagos, Nigeria, with a background in Pure Mathematics and experience building modern web applications with React, Next.js, TypeScript, Node.js, and Supabase.`;

export const metadata: Metadata = {
  title: "About",
  description,
  alternates: { canonical: "/about" },
};

const sections: { heading: string; body: string }[] = [
  {
    heading: "Mathematics background",
    body:
      "I earned a B.Sc. in Pure Mathematics from the University of Lagos. Mathematics trained me to think in terms of structure, logic, and abstraction—skills that translate directly into software engineering. Whether I'm designing a database schema, debugging an application, or building a new feature, I approach problems by breaking them into smaller, understandable parts before implementing a solution.",
  },
  {
    heading: "Into software development",
    body:
      "My transition into software development grew naturally from my interest in problem-solving and technology. What began as curiosity evolved into building real applications with JavaScript and TypeScript. Over time, I developed expertise in React, Next.js, Node.js, and modern web development practices, focusing on creating applications that are both functional and maintainable.",
  },
  {
    heading: "Front-end development",
    body:
      "I build modern user interfaces using React, Next.js, and TypeScript. My focus is on creating responsive, accessible, and performant experiences that work well across devices. I enjoy transforming complex requirements into intuitive interfaces while maintaining clean, scalable code.",
  },
  {
    heading: "Full-stack development",
    body:
      "Beyond the front end, I work across the entire application stack. I build APIs with Node.js and Express, design and manage databases with PostgreSQL, Supabase, and MongoDB, implement authentication and authorization systems, and deploy applications to production environments. This end-to-end perspective helps me build solutions that are cohesive and reliable.",
  },
  {
    heading: "Approach to engineering",
    body:
      "I believe good software balances functionality, maintainability, and user experience. I value clean architecture, thoughtful design decisions, and continuous learning. Rather than chasing trends, I focus on selecting technologies that best solve the problem at hand and can be maintained effectively over time.",
  },
  {
    heading: "Teaching and communication",
    body:
      "Alongside software development, I have several years of experience teaching and tutoring mathematics. Teaching strengthened my communication skills and taught me how to explain complex concepts clearly to different audiences. Those skills carry directly into software engineering through documentation, collaboration, mentoring, and technical discussions.",
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
