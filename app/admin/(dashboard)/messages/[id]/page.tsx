import { notFound } from "next/navigation";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth/require-admin";
import { getMessageById } from "@/lib/data/admin-messages";
import { setMessageStatus, deleteMessage, markAsRead } from "@/lib/actions/messages";
import { ConfirmSubmitButton } from "@/components/admin/confirm-submit-button";
import { Button } from "@/components/ui/button";

export default async function AdminMessagePage({
  params,
}: {
  params: { id: string };
}) {
  const { supabase } = await requireAdmin();
  const message = await getMessageById(supabase, params.id);
  if (!message) notFound();

  if (message.status === "new") {
    await markAsRead(params.id);
    message.status = "read";
  }

  const replyHref = `mailto:${message.email}${
    message.subject
      ? `?subject=${encodeURIComponent(`Re: ${message.subject}`)}`
      : ""
  }`;

  return (
    <div className="max-w-2xl">
      <Link
        href="/admin/messages"
        className="font-mono text-xs text-muted hover:text-accent"
      >
        ← Back to messages
      </Link>

      <p className="mt-6 font-mono text-xs uppercase tracking-widest text-accent">
        {message.status}
      </p>
      <h1 className="mt-2 font-display text-2xl font-semibold text-ink">
        {message.subject || "(no subject)"}
      </h1>
      <p className="mt-2 font-body text-sm text-ink">
        {message.name} ·{" "}
        <a
          href={`mailto:${message.email}`}
          className="text-accent underline"
        >
          {message.email}
        </a>
      </p>
      <p className="mt-1 font-mono text-xs text-muted">
        {new Date(message.created_at).toLocaleString()}
      </p>

      <div className="mt-6 whitespace-pre-line rounded-sm border border-border bg-surface p-5 font-body text-sm leading-relaxed text-ink">
        {message.message}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <Button href={replyHref} external variant="primary">
          Reply by email
        </Button>

        <form action={setMessageStatus.bind(null, message.id, "replied")}>
          <button
            type="submit"
            className="rounded-sm border border-border px-3 py-1.5 font-mono text-xs text-muted hover:border-accent hover:text-accent"
          >
            Mark replied
          </button>
        </form>
        <form action={setMessageStatus.bind(null, message.id, "archived")}>
          <button
            type="submit"
            className="rounded-sm border border-border px-3 py-1.5 font-mono text-xs text-muted hover:border-accent hover:text-accent"
          >
            Archive
          </button>
        </form>
        <form action={deleteMessage.bind(null, message.id)}>
          <ConfirmSubmitButton
            label="Delete"
            confirmMessage="Delete this message? This can't be undone."
          />
        </form>
      </div>
    </div>
  );
}
