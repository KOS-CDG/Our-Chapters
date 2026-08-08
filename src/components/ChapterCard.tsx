import { motion } from "framer-motion";
import { Link } from "react-router-dom";

// The Link itself is the motion element. Wrapping it in a motion.div with
// whileTap makes Framer add tabindex to that div, producing a second, useless
// tab stop in front of every row.
const MotionLink = motion(Link);
import { useMotionPrefs } from "../lib/motion";
import { CoverThumb } from "./CoverThumb";
import { ChevronLeftIcon } from "./icons";
import type { ChapterSummary } from "../types/chapter";

export interface ChapterCardProps {
  chapter: ChapterSummary;
  isNewest?: boolean;
  to: string;
}

/**
 * One line in the chapter index.
 *
 * Deliberately not a card: no panel, no radius, no shadow. Rows separated by a
 * single hairline read as a printed contents page, which is the whole point of
 * the redesign — and it lets the photographs be the only colour on screen.
 *
 * A real Link rather than a clickable div, so it is focusable, announced as a
 * link, and openable in a new tab without any role/onKeyDown scaffolding.
 */
export function ChapterCard({ chapter, isNewest = false, to }: ChapterCardProps) {
  const { tap } = useMotionPrefs();

  const number = String(chapter.number).padStart(2, "0");

  return (
    <MotionLink whileTap={tap} to={to} className="group flex items-center gap-4 py-4 sm:gap-5">
      <span className="w-6 flex-none font-mono text-meta text-ink-faint tabular-nums">
        {number}
      </span>

      <div className="h-[72px] w-[58px] flex-none overflow-hidden rounded-sm bg-sunken">
        <CoverThumb
          publicId={chapter.coverImagePublicId}
          mediaType={chapter.coverMediaType}
          width={200}
          height={250}
          className="h-full w-full object-cover transition-transform duration-slow ease-soft group-hover:scale-[1.03]"
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em] text-ink-faint">
          <span>Chapter {number}</span>
          {isNewest && (
            <span className="flex items-center gap-1.5 text-accent">
              <span className="h-1 w-1 rounded-full bg-accent" aria-hidden="true" />
              New
            </span>
          )}
        </div>

        <span className="truncate font-display text-step1 font-normal text-ink transition-colors duration-base ease-soft group-hover:text-accent">
          {chapter.title}
        </span>
      </div>

      <span
        className="flex-none rotate-180 text-ink-faint transition-all duration-base ease-soft group-hover:translate-x-0.5 group-hover:text-accent"
        aria-hidden="true"
      >
        <ChevronLeftIcon size={16} />
      </span>
    </MotionLink>
  );
}
