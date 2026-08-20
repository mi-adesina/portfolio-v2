import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="mx-auto flex max-w-content flex-col items-start px-6 py-32">
      <p className="font-mono text-xs uppercase tracking-widest text-accent">
        404
      </p>
      <h1 className="mt-3 font-display text-3xl font-semibold text-ink md:text-4xl">
        This page doesn&apos;t exist
      </h1>
      <p className="mt-4 max-w-md font-body text-muted">
        The page you&apos;re looking for may have moved or been removed.
        Check the URL, or head back to the homepage.
      </p>
      <div className="mt-8">
        <Button href="/" variant="primary">
          Back to home
        </Button>
      </div>
    </section>
  );
}
