import Link from "next/link";
import type { Route } from "next";
import { requireAdmin } from "@/lib/auth/require-admin";
import { getAllMessagesAdmin } from "@/lib/data/admin-messages";
import { deleteMessage } from "@/lib/actions/messages";
import { ConfirmSubmitButton } from "@/components/admin/confirm-submit-button";
import { cn } from "@/lib/utils";
import type { Database } from "@/types/database";

type ContactStatus =
  Database["public"]["Tables"]["contact_messages"]["Row"]["status"];

export const dynamic = "force-dynamic";

const STATUSES: ContactStatus[] = ["new", "read", "replied", "archived"];

function isContactStatus(value: string | undefined): value is ContactStatus {
  return !!value && (STATUSES as string[]).includes(value);
}

export default async function AdminMessagesPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const { supabase } = await requireAdmin();
  const activeStatus = isContactStatus(searchParams.status)
    ? searchParams.status
    : undefined;
  const messages = await getAllMessagesAdmin(supabase, activeStatus);

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink">
        Messages
      </h1>

      <nav aria-label="Filter by status" className="mt-6 flex flex-wrap gap-2">
        <Link href="/admin/messages" className={chip(!activeStatus)}>
          All
        </Link>
        {STATUSES.map((status) => (
          <Link
            key={status}
            href={`/admin/messages?status=${status}` as Route}
            className={chip(activeStatus === status)}
          >
            {status}
          </Link>
        ))}
      </nav>

      {messages.length === 0 ? (
        <p className="mt-10 font-mono text-xs text-muted">
          No messages{activeStatus ? ` with status "${activeStatus}"` : ""}.
        </p>
      ) : (
        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left">
            <thead>
              <tr className="border-b border-border font-mono text-xs uppercase tracking-widest text-muted">
                <th className="py-2 pr-4 font-medium">From</th>
                <th className="py-2 pr-4 font-medium">Subject</th>
                <th className="py-2 pr-4 font-medium">Status</th>
                <th className="py-2 pr-4 font-medium">Received</th>
                <th className="py-2 pr-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((message) => (
                <tr key={message.id} className="border-b border-border">
                  <td className="py-3 pr-4">
                    <Link
                      href={`/admin/messages/${message.id}` as Route}
                      className="font-body text-sm text-ink hover:text-accent"
                    >
                      {message.name}
                    </Link>
                    <p className="font-mono text-xs text-muted">
                      {message.email}
                    </p>
                  </td>
                  <td className="py-3 pr-4 font-body text-sm text-ink">
                    {message.subject || "—"}
                  </td>
                  <td className="py-3 pr-4 font-mono text-xs capitalize text-muted">
                    {message.status}
                  </td>
                  <td className="py-3 pr-4 font-mono text-xs text-muted">
                    {new Date(message.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-4">
                      <Link
                        href={`/admin/messages/${message.id}` as Route}
                        className="font-mono text-xs text-accent hover:underline"
                      >
                        View
                      </Link>
                      <form action={deleteMessage.bind(null, message.id)}>
                        <ConfirmSubmitButton
                          label="Delete"
                          confirmMessage={`Delete this message from ${message.name}? This can't be undone.`}
                        />
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function chip(active: boolean) {
  return cn(
    "rounded-sm border px-3 py-1.5 font-mono text-xs capitalize transition-colors",
    active
      ? "border-accent bg-accent text-white"
      : "border-border text-muted hover:border-accent hover:text-accent"
  );
}
