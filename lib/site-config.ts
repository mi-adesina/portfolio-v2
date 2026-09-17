export const siteConfig = {
  name: "Michael Adesina",

  title: "Michael Adesina — Full-Stack TypeScript & AI Engineer",

  role: "Full-Stack Developer · Next.js, React, TypeScript & AI",

  headline:
    "Full-stack developer building performant web applications and AI-driven experiences with Next.js, React, TypeScript, and serverless architectures.",

  description:
    "Michael Adesina is a Full-Stack Developer based in Lagos, Nigeria. He specializes in Next.js (App Router), React, TypeScript, Tailwind CSS, Framer Motion, Node.js, Convex, Supabase, and Claude LLM API integrations. He holds a B.Sc. in Pure Mathematics from the University of Lagos and enjoys building scalable, high-performance applications.",

  location: "Lagos, Nigeria",

  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    "https://portfolio-v2-lovat-one.vercel.app",

  email: "mi.adesina.codes@gmail.com",

  links: {
    github: "https://github.com/mi-adesina",

    linkedin: "https://linkedin.com/in/mi-adesina",

    x: "https://x.com/adesina_mi",

    resume: "/resume.pdf",
  },

  nav: [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Projects", href: "/projects" },
    { label: "Experience", href: "/experience" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ],

  skills: {
    frontend: [
      "Next.js (App Router)",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Framer Motion",
      "JavaScript (ES6+)",
      "HTML5 / CSS3",
      "Sass",
    ],

    backend: [
      "Node.js",
      "Express.js",
      "Convex",
      "Serverless Functions",
      "REST APIs",
      "Claude LLM APIs",
    ],

    database: [
      "PostgreSQL",
      "Supabase",
      "MongoDB",
      "Convex DB",
    ],

    tools: [
      "Git",
      "GitHub",
      "GitHub Actions (CI/CD)",
      "Jest",
      "Vercel",
      "VS Code",
      "Postman",
    ],
  },
} as const;