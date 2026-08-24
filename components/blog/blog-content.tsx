import ReactMarkdown, { type Components } from "react-markdown";

/**
 * Renders post.content — still a plain TEXT column, still edited via
 * a plain textarea in the admin (see components/admin/post-form.tsx)
 * — as a properly formatted article. Deliberately NOT a rich-text
 * editor or a new storage format: the input contract doesn't change,
 * only how the existing text gets displayed.
 *
 * Safety: react-markdown renders Markdown directly to React elements
 * — it never uses dangerouslySetInnerHTML, and by default (no
 * rehype-raw plugin, which is intentionally not used here) any raw
 * HTML tags typed into the content are escaped as literal text rather
 * than parsed into real DOM nodes. That default IS the sanitization;
 * adding rehype-raw would undo it, so don't.
 */
const components: Components = {
  h1: ({ children }) => (
    <h1 className="mb-4 mt-10 font-display text-3xl font-semibold text-ink first:mt-0">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="mb-4 mt-10 font-display text-2xl font-semibold text-ink first:mt-0">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mb-3 mt-8 font-display text-xl font-semibold text-ink first:mt-0">
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className="mb-5 font-body text-base leading-relaxed text-ink">
      {children}
    </p>
  ),
  ul: ({ children }) => (
    <ul className="mb-5 list-disc space-y-2 pl-6 font-body text-base leading-relaxed text-ink">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-5 list-decimal space-y-2 pl-6 font-body text-base leading-relaxed text-ink">
      {children}
    </ol>
  ),
  li: ({ children }) => <li>{children}</li>,
  strong: ({ children }) => (
    <strong className="font-semibold text-ink">{children}</strong>
  ),
  em: ({ children }) => <em className="italic">{children}</em>,
  a: ({ href, children }) => {
    const isExternal = /^https?:\/\//.test(href ?? "");
    return (
      <a
        href={href}
        className="text-accent underline underline-offset-2 hover:opacity-80"
        {...(isExternal
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
      >
        {children}
      </a>
    );
  },
  // Inline code and fenced code blocks both render through this same
  // `code` component (react-markdown nests it inside `pre` for
  // blocks); the two are told apart purely with CSS — see the
  // `.blog-content pre code` override in app/globals.css — rather
  // than fragile inline/block prop-sniffing.
  code: ({ children }) => (
    <code className="rounded-sm border border-border bg-surface px-1.5 py-0.5 font-mono text-sm text-ink">
      {children}
    </code>
  ),
  pre: ({ children }) => (
    <pre className="mb-6 overflow-x-auto rounded-sm border border-border bg-surface p-4 font-mono text-sm leading-relaxed text-ink">
      {children}
    </pre>
  ),
};

export function BlogContent({ content }: { content: string }) {
  return (
    <div className="blog-content">
      <ReactMarkdown components={components}>{content}</ReactMarkdown>
    </div>
  );
}
