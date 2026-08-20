export default function Loading() {
  return (
    <div
      role="status"
      aria-label="Loading"
      className="mx-auto max-w-content px-6 py-20"
    >
      <div className="h-4 w-24 animate-pulse rounded-sm bg-border" />
      <div className="mt-4 h-10 w-2/3 animate-pulse rounded-sm bg-border" />
      <div className="mt-6 h-4 w-full max-w-xl animate-pulse rounded-sm bg-border" />
    </div>
  );
}
