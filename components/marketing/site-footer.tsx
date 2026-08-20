import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-content flex-col gap-4 px-6 py-10 md:flex-row md:items-center md:justify-between">
        <p className="font-mono text-xs text-muted">
          © {year} {siteConfig.name}. Built with Next.js &amp; Supabase.
        </p>
        <nav aria-label="Social" className="flex gap-6">
          <Link
            href={siteConfig.links.github}
            className="font-mono text-xs text-muted hover:text-accent"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </Link>
          <Link
            href={siteConfig.links.linkedin}
            className="font-mono text-xs text-muted hover:text-accent"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </Link>
          <Link
            href={siteConfig.links.x}
            className="font-mono text-xs text-muted hover:text-accent"
            target="_blank"
            rel="noopener noreferrer"
          >
            X
          </Link>
        </nav>
      </div>
    </footer>
  );
}
