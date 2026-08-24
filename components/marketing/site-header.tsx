"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();

  React.useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/85 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex max-w-content items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="font-display text-base font-semibold tracking-tight text-ink"
        >
          Michael Adesina
        </Link>

        <nav
          aria-label="Primary"
          className="hidden items-center gap-8 md:flex"
        >
          {siteConfig.nav.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-full px-3 py-1.5 font-body text-sm transition-colors hover:text-accent",
                  active ? "bg-accent/10 text-accent" : "text-muted"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:block">
          <Button href={siteConfig.links.resume} size="sm" variant="secondary">
            Resume
          </Button>
        </div>

        <button
          type="button"
          className="rounded-md p-1 text-ink transition-colors hover:text-accent md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          aria-label="Mobile"
          className="border-t border-border px-6 py-4 md:hidden"
        >
          <ul className="flex flex-col gap-4">
            {siteConfig.nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="font-body text-base text-ink"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Button
                href={siteConfig.links.resume}
                size="sm"
                variant="secondary"
                className="w-full"
              >
                Resume
              </Button>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
