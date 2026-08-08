/** Loading placeholder for one chapter index row. */
export function ChapterCardSkeleton() {
  return (
    <div className="flex animate-pulse items-center gap-4 py-5 sm:gap-5" aria-hidden="true">
      <span className="w-6 flex-none self-start pt-1">
        <span className="block h-3 w-5 rounded-sm bg-sunken" />
      </span>
      <div className="h-[90px] w-[72px] flex-none rounded-sm bg-sunken" />
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="h-2.5 w-2/5 rounded-sm bg-sunken" />
        <div className="h-4 w-4/5 rounded-sm bg-sunken" />
        <div className="h-2.5 w-3/5 rounded-sm bg-sunken" />
      </div>
    </div>
  );
}

/** Wrapper that gives the skeleton rows an accessible loading announcement. */
export function ChapterListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div role="status" aria-label="Loading chapters" className="divide-y divide-line">
      {Array.from({ length: count }).map((_, i) => (
        <ChapterCardSkeleton key={i} />
      ))}
    </div>
  );
}

/** Shown when the chapters list resolves empty. */
export function EmptyState() {
  return (
    <div className="mt-16 border-y border-line py-16 text-center">
      <p className="font-display text-step2 font-normal text-ink">No chapters yet</p>
      <p className="mt-2 font-mono text-meta uppercase tracking-[0.14em] text-ink-faint">
        Check back soon
      </p>
    </div>
  );
}
