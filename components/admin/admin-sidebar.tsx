import Link from "next/link";

const links = [
  { label: "Dashboard", href: "/admin" },
  { label: "Projects", href: "/admin/projects" },
  { label: "Blog", href: "/admin/blog" },
  // Messages link lands here in Phase 6, once that route exists.
];

export function AdminSidebar() {
  return (
    <nav
      aria-label="Admin"
      className="w-40 shrink-0 border-r border-border pr-6"
    >
      <ul className="flex flex-col gap-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="font-mono text-xs uppercase tracking-widest text-muted hover:text-accent"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
