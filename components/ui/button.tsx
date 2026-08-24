import * as React from "react";
import Link from "next/link";
import type { Route } from "next";
import { cn } from "@/lib/utils";

type BaseProps = {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md";
  className?: string;
  children: React.ReactNode;
};

const variantStyles: Record<NonNullable<BaseProps["variant"]>, string> = {
  primary:
    "bg-accent text-white border border-accent shadow-sm hover:shadow-lg hover:-translate-y-0.5",
  secondary:
    "bg-transparent text-ink border border-border hover:border-accent hover:text-accent hover:-translate-y-0.5",
  ghost: "bg-transparent text-ink hover:text-accent border border-transparent",
};

const sizeStyles: Record<NonNullable<BaseProps["size"]>, string> = {
  sm: "px-3.5 py-1.5 text-sm",
  md: "px-5 py-2.5 text-sm",
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-lg font-medium font-body transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none disabled:translate-y-0 disabled:shadow-none";

/** Keys that belong to our own props, not native <button> attributes. */
const OWN_PROP_KEYS = ["variant", "size", "className", "children"] as const;

/**
 * Returns a shallow copy of `obj` without the given keys. Used instead
 * of destructuring-to-omit (`const { a: _a, ...rest } = obj`) so there
 * are no intentionally-unused bindings for a lint rule to flag —
 * there's simply nothing named that's never read.
 */
function omit<T extends object, K extends keyof T>(
  obj: T,
  keys: readonly K[]
): Omit<T, K> {
  const keySet = new Set<keyof T>(keys);
  const entries = (Object.entries(obj) as [keyof T, T[keyof T]][]).filter(
    ([key]) => !keySet.has(key)
  );
  return Object.fromEntries(entries) as Omit<T, K>;
}

type ButtonAsButton = BaseProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">;

type ButtonAsLink = BaseProps & {
  href: string;
  external?: boolean;
};

function isLinkProps(
  props: ButtonAsButton | ButtonAsLink
): props is ButtonAsLink {
  return "href" in props && typeof props.href === "string";
}

export function Button(props: ButtonAsButton | ButtonAsLink) {
  const { variant = "primary", size = "md", className, children } = props;
  const classes = cn(base, variantStyles[variant], sizeStyles[size], className);

  if (isLinkProps(props)) {
    const { href, external } = props;
    if (external) {
      return (
        <a
          href={href}
          className={classes}
          target="_blank"
          rel="noopener noreferrer"
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={href as Route} className={classes}>
        {children}
      </Link>
    );
  }

  const rest = omit(props, OWN_PROP_KEYS);
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
