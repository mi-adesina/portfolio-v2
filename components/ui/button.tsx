import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type BaseProps = {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md";
  className?: string;
  children: React.ReactNode;
};

const variantStyles: Record<NonNullable<BaseProps["variant"]>, string> = {
  primary:
    "bg-accent text-white hover:opacity-90 border border-accent",
  secondary:
    "bg-transparent text-ink border border-border hover:border-accent hover:text-accent",
  ghost: "bg-transparent text-ink hover:text-accent border border-transparent",
};

const sizeStyles: Record<NonNullable<BaseProps["size"]>, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-5 py-2.5 text-sm",
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-sm font-medium font-body transition-colors duration-150 disabled:opacity-50 disabled:pointer-events-none";

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
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  const { variant: _variant, size: _size, className: _className, children: _children, ...rest } =
    props;
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
