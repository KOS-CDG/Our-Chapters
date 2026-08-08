import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Shell } from "../components/Shell";
import { IconButton } from "../components/ui/IconButton";
import { listContainer, listItem, useMotionPrefs } from "../lib/motion";
import { chapterSummaries } from "../data/chapters";
import { ChapterCard } from "../components/ChapterCard";
import { ChapterListSkeleton, EmptyState } from "../components/ChapterListStates";
import { ChevronLeftIcon } from "../components/icons";
import type { ChapterSummary } from "../types/chapter";

type SortOrder = "chronological" | "recent-first";

export interface ChapterListPageProps {
  chapters?: ChapterSummary[];
  isLoading?: boolean;
  sortOrder?: SortOrder;
}

function SortToggle({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={[
        "border-b pb-0.5 font-mono text-[11px] uppercase tracking-[0.12em]",
        "transition-colors duration-fast ease-soft",
        active ? "border-ink text-ink" : "border-transparent text-ink-faint hover:text-ink-muted",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

export function ChapterListPage({
  chapters = chapterSummaries,
  isLoading = false,
  sortOrder: initialSort = "chronological",
}: ChapterListPageProps) {
  const { enter } = useMotionPrefs();
  const [currentSort, setCurrentSort] = useState<SortOrder>(initialSort);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAndSorted = useMemo(() => {
    let list = [...chapters];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((c) => c.title.toLowerCase().includes(q) || c.teaser.toLowerCase().includes(q));
    }
    list.sort((a, b) => a.number - b.number);
    return currentSort === "recent-first" ? list.reverse() : list;
  }, [chapters, currentSort, searchQuery]);

  const newestNumber = useMemo(() => chapters.reduce((max, c) => Math.max(max, c.number), 0), [chapters]);
  const isEmpty = !isLoading && filteredAndSorted.length === 0;

  return (
    <Shell>
      <header className="sticky top-0 z-10 border-b border-line bg-surface/95 backdrop-blur-sm pt-[max(1rem,var(--safe-t))]">
        <div className="mx-auto flex max-w-list items-center gap-4 px-5 pb-4">
          <IconButton to="/" label="Back to cover" size={38}>
            <ChevronLeftIcon size={16} />
          </IconButton>
          <div className="min-w-0">
            <h1 className="font-display text-step1 font-normal leading-tight text-ink">Chapters</h1>
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-faint">
              {String(chapters.length).padStart(2, "0")} chapters
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-list px-5 pb-24 pt-6">
        <div className="flex flex-col gap-5">
          <div>
            <label htmlFor="chapter-search" className="sr-only">
              Search chapters
            </label>
            <input
              id="chapter-search"
              type="search"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border-b border-line bg-transparent pb-2 font-mono text-meta
                         text-ink placeholder:text-ink-faint focus:border-ink focus:outline-none
                         transition-colors duration-fast ease-soft"
            />
          </div>

          <div role="group" aria-label="Sort order" className="flex items-center gap-4">
            <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-faint">Order</span>
            <SortToggle
              active={currentSort === "chronological"}
              onClick={() => setCurrentSort("chronological")}
            >
              First → Last
            </SortToggle>
            <span className="h-3 w-px bg-line" aria-hidden="true" />
            <SortToggle
              active={currentSort === "recent-first"}
              onClick={() => setCurrentSort("recent-first")}
            >
              Latest
            </SortToggle>
          </div>
        </div>

        <div className="mt-4 border-t border-line">
          {isLoading && <ChapterListSkeleton />}

          {isEmpty && <EmptyState />}

          {!isLoading && !isEmpty && (
            <motion.ul {...enter} variants={listContainer} className="divide-y divide-line">
              {filteredAndSorted.map((chapter) => (
                <motion.li key={chapter.id} variants={listItem}>
                  <ChapterCard
                    chapter={chapter}
                    isNewest={chapter.number === newestNumber}
                    to={`/chapters/${chapter.slug}`}
                  />
                </motion.li>
              ))}
            </motion.ul>
          )}
        </div>
      </main>
    </Shell>
  );
}
