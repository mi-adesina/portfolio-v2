"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error(error);
  }, [error]);

  return (
    <section className="mx-auto flex max-w-content flex-col items-start px-6 py-32">
      <p className="font-mono text-xs uppercase tracking-widest text-accent">
        Error
      </p>
      <h1 className="mt-3 font-display text-3xl font-semibold text-ink md:text-4xl">
        Something went wrong
      </h1>
      <p className="mt-4 max-w-md font-body text-muted">
        That request didn&apos;t complete. Try again, or head back to the
        homepage.
      </p>
      <div className="mt-8 flex gap-4">
        <Button onClick={reset} variant="primary">
          Try again
        </Button>
        <Button href="/" variant="secondary">
          Back to home
        </Button>
      </div>
    </section>
  );
}
