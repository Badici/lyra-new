export default function Loading() {
  return (
    <div className="flex flex-1 items-center justify-center py-24" role="status" aria-live="polite">
      <div className="text-center">
        <div className="mx-auto mb-4 h-10 w-10 animate-pulse rounded-full bg-moss/30" />
        <p className="text-sm text-muted">Se încarcă…</p>
      </div>
    </div>
  );
}
