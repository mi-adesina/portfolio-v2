import type { Metadata } from "next";
import { signIn } from "@/lib/actions/auth";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  return (
    <section className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-6 py-20">
      <p className="font-mono text-xs uppercase tracking-widest text-accent">
        Admin
      </p>
      <h1 className="mt-3 font-display text-2xl font-semibold text-ink">
        Sign in
      </h1>

      {searchParams.error && (
        <p
          role="alert"
          className="mt-6 rounded-sm border border-red-300 bg-red-50 px-4 py-2 font-mono text-xs text-red-700"
        >
          {searchParams.error}
        </p>
      )}

      <form action={signIn} className="mt-8 flex flex-col gap-4">
        <div>
          <label
            htmlFor="email"
            className="font-mono text-xs uppercase tracking-widest text-muted"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="mt-2 w-full rounded-sm border border-border bg-transparent px-3 py-2 font-body text-sm text-ink"
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="font-mono text-xs uppercase tracking-widest text-muted"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="mt-2 w-full rounded-sm border border-border bg-transparent px-3 py-2 font-body text-sm text-ink"
          />
        </div>
        <button
          type="submit"
          className="mt-2 rounded-sm border border-accent bg-accent px-4 py-2 font-mono text-xs text-white transition-opacity hover:opacity-90"
        >
          Sign in
        </button>
      </form>
    </section>
  );
}
