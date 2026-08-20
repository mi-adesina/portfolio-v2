export const inputClass =
  "w-full rounded-sm border border-border bg-transparent px-3 py-2 font-body text-sm text-ink";

export function Field({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="font-mono text-xs uppercase tracking-widest text-muted"
      >
        {label}
      </label>
      <div className="mt-2">{children}</div>
      {hint && <p className="mt-1 font-mono text-xs text-muted">{hint}</p>}
    </div>
  );
}
