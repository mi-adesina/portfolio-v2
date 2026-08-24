export const siteConfig = {
  name: "Michael Adesina",

  title: "Michael Adesina — Full-Stack Developer",

  role: "Full-Stack Developer · React, Next.js & Node.js",

  headline:
    "Full-stack developer building modern web applications with Next.js, React, TypeScript, Node.js and Supabase.",

  description:
    "Michael Adesina is a Full-Stack Developer based in Lagos, Nigeria. He specializes in Next.js, React, TypeScript, Node.js, PostgreSQL, Supabase and modern web technologies. He holds a B.Sc. in Pure Mathematics from the University of Lagos and enjoys building scalable applications that solve real-world problems.",

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
      "React",
      "Next.js",
      "TypeScript",
      "JavaScript",
      "HTML",
      "CSS",
      "Sass",
    ],

    backend: [
      "Node.js",
      "Express.js",
      "REST APIs",
    ],

    database: [
      "PostgreSQL",
      "Supabase",
      "MongoDB",
    ],

    tools: [
      "Git",
      "GitHub",
      "Vercel",
      "VS Code",
      "Postman",
    ],
  },
} as const;