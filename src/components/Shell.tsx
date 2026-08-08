import type { ReactNode } from "react";

export interface ShellProps {
  children: ReactNode;
  /** Cover only: let the backdrop video show through instead of paper. */
  transparent?: boolean;
}

/**
 * The page wrapper. Was copy-pasted verbatim across all three pages as a
 * translucent glass sheet over the video.
 *
 * The chapter list and reader now sit on solid paper: text contrast over an
 * arbitrary video frame was unpredictable, and dropping backdrop-filter
 * removes a per-frame GPU cost on phones.
 *
 * Uses 100dvh, not 100vh — the old value left a gap when mobile browser
 * chrome collapsed.
 */
export function Shell({ children, transparent = false }: ShellProps) {
  return (
    <div
      className={[
        "relative min-h-[100dvh] w-full font-body text-ink",
        transparent ? "" : "bg-surface",
      ].join(" ")}
    >
      {children}
    </div>
  );
}
