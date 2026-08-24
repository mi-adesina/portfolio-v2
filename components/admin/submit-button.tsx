"use client";

import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";

/**
 * Must be rendered as a descendant of the <form> whose pending state
 * it reports — useFormStatus reads from the nearest parent form's
 * Server Action, not from any prop passed down. Disabling the button
 * while pending prevents the double-submission problem (double-click,
 * or a slow connection tempting a second click) without needing any
 * client-side state in the form itself — the form stays a Server
 * Component using native <form action={...}>, exactly as before.
 */
export function SubmitButton({
  label,
  pendingLabel,
  className,
}: {
  label: string;
  pendingLabel: string;
  className?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      aria-disabled={pending}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-sm border border-accent bg-accent px-5 py-2.5 font-mono text-xs font-medium text-white transition-opacity duration-150 hover:opacity-90 disabled:opacity-50 disabled:pointer-events-none",
        className
      )}
    >
      {pending ? pendingLabel : label}
    </button>
  );
}
