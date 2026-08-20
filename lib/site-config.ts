export const siteConfig = {
  name: "Michael Adesina",

  title: "Michael Adesina — Full-Stack Developer",

  role: "Full-Stack Developer (MERN) · Front-End Specialist",

  headline:
    "I build modern, scalable web applications with React, Next.js, TypeScript and Node.js.",

  description:
    "Michael Adesina is a Lagos-based full-stack developer and mathematics educator specializing in React, Next.js, TypeScript, Node.js and modern web technologies. He builds responsive, scalable and user-focused web applications.",

  location: "Lagos, Nigeria",

  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    "http://localhost:3000",

  email: "mi.adesina.codes@gmail.com",

  links: {
    github: "https://github.com/mi-adesina",

    linkedin: "https://www.linkedin.com/in/mi-adesina/",

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
} as const;