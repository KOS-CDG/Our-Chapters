import { motion } from "framer-motion";
import { Shell } from "../components/Shell";
import { BackdropVideo } from "../components/BackdropVideo";
import { CtaButton } from "../components/ui/CtaButton";
import { fadeUp, listContainer, useMotionPrefs } from "../lib/motion";
import { useMonthsary, ordinal } from "../lib/monthsary";
import { usePlaceholderRefresh } from "../lib/usePlaceholderRefresh";
import { CoverThumb } from "../components/CoverThumb";
import { chapterSummaries } from "../data/chapters";
import type { ChapterSummary } from "../types/chapter";
import { PixelLavenderGarden } from "../components/PixelLavenderGarden";

/** One of the two chapter previews under the masthead. */
function Plate({
  publicId,
  mediaType,
  label,
}: {
  publicId: string;
  mediaType?: ChapterSummary["coverMediaType"];
  label: string;
}) {
  return (
    <figure className="m-0 flex w-[118px] flex-col gap-2 sm:w-[132px]">
      <div className="aspect-[4/5] overflow-hidden rounded-sm border border-line bg-sunken">
        <CoverThumb
          publicId={publicId}
          mediaType={mediaType}
          className="h-full w-full object-cover"
        />
      </div>
      <figcaption className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-faint">
        {label}
      </figcaption>
    </figure>
  );
}

export function CoverPage() {
  const { enter } = useMotionPrefs();
  const monthsary = useMonthsary();
  usePlaceholderRefresh();

  const [first, , third] = chapterSummaries;

  return (
    <Shell>
      {/* The collage video is the masthead image */}
      <div className="relative h-[38dvh] min-h-[240px] w-full overflow-hidden">
        <BackdropVideo />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent from-30% via-surface/50 via-75% to-surface" />
      </div>

      <main className="relative mx-auto -mt-6 flex max-w-list flex-col items-center px-6 pb-6 text-center">
        <motion.div {...enter} variants={listContainer} className="flex flex-col items-center w-full">
          <motion.span variants={fadeUp} className="mb-7 block h-px w-12 bg-line" aria-hidden="true" />

          <motion.h1
            variants={fadeUp}
            className="m-0 font-display text-step4 font-light leading-[0.95] tracking-tight text-ink"
          >
            <span className="italic">Our</span> Chapter
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-5 font-mono text-[11px] uppercase tracking-[0.22em] text-ink-faint"
          >
            Since 12.09.2023
          </motion.p>

          {/* The monthsary reading */}
          <motion.div variants={fadeUp} className="mt-3">
            {monthsary.isToday ? (
              <p className="font-display text-step1 font-normal italic text-accent">
                Happy {ordinal(monthsary.months)} monthsary.
              </p>
            ) : (
              <p className="font-mono text-[11px] uppercase leading-relaxed tracking-[0.16em] text-ink-muted">
                {monthsary.months} months · {monthsary.daysSince}{" "}
                {monthsary.daysSince === 1 ? "day" : "days"}
                <br />
                <span className="text-ink-faint">
                  next in {monthsary.daysUntil} {monthsary.daysUntil === 1 ? "day" : "days"}
                </span>
              </p>
            )}
          </motion.div>

          <motion.div variants={fadeUp} className="mt-9 flex items-start justify-center gap-4">
            <Plate
              publicId={first.coverImagePublicId}
              mediaType={first.coverMediaType}
              label={`Chapter 0${first.number}`}
            />
            <Plate
              publicId={third.coverImagePublicId}
              mediaType={third.coverMediaType}
              label={`Chapter 0${third.number}`}
            />
          </motion.div>

          <motion.div variants={fadeUp} className="mt-10 flex flex-col items-center gap-5">
            <CtaButton to={`/chapters/${first.slug}`}>Start reading</CtaButton>

            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-faint">
              {chapterSummaries.length} chapters · our story so far
            </span>

            <CtaButton to="/chapters" variant="quiet">
              All chapters →
            </CtaButton>
          </motion.div>
        </motion.div>
      </main>

      {/* FULL BLEED EDGE-TO-EDGE PIXEL LAVENDER GARDEN AT THE VERY BOTTOM */}
      <div className="relative w-full overflow-hidden mt-4 pb-0 mb-0">
        <PixelLavenderGarden />
      </div>
    </Shell>
  );
}
