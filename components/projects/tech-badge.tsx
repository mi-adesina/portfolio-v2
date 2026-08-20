export function TechBadge({ name }: { name: string }) {
  return (
    <span className="rounded-sm border border-border px-2 py-1 font-mono text-xs text-muted">
      {name}
    </span>
  );
}
