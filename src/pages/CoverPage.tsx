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
import {
  FloatingLavenderPetals,
  WatercolorBrushes,
  LavenderSprigIcon,
  WatercolorBrushLine,
} from "../components/LavenderGarden";

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
      <div className="aspect-[4/5] overflow-hidden rounded-sm border border-line bg-sunken shadow-soft transition-transform duration-base ease-soft hover:scale-[1.02]">
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
      <div className="relative min-h-screen w-full overflow-hidden">
        {/* Soft watercolor brushes of lavender, purple and blush pink */}
        <WatercolorBrushes />

        {/* Floating animated lavender petals */}
        <FloatingLavenderPetals />

        {/* Masthead Banner: Blending backdrop video with painterly lavender garden artwork */}
        <div className="relative h-[42dvh] min-h-[280px] w-full overflow-hidden">
          <div className="absolute inset-0 z-0">
            <BackdropVideo />
          </div>
          {/* Lavender garden watercolor artwork layer */}
          <div className="absolute inset-0 z-10 opacity-45 mix-blend-multiply">
            <img
              src="/lavender-garden.png"
              alt="Lavender Garden"
              className="h-full w-full object-cover object-bottom"
            />
          </div>
          {/* Vignette gradients fading into the warm paper surface */}
          <div className="absolute inset-0 z-20 bg-gradient-to-b from-transparent via-surface/40 via-65% to-surface" />
          <div className="absolute inset-0 z-20 bg-gradient-to-r from-surface/20 via-transparent to-surface/20" />
        </div>

        <main className="relative z-30 mx-auto -mt-10 flex max-w-list flex-col items-center px-6 pb-[max(3rem,var(--safe-b))] text-center">
          <motion.div {...enter} variants={listContainer} className="flex flex-col items-center">
            {/* Lavender garden badge */}
            <motion.div
              variants={fadeUp}
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-[rgb(var(--purple-soft)/0.25)] bg-[rgb(var(--lavender-tint))] px-3.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[rgb(var(--purple-soft))]"
            >
              <LavenderSprigIcon size={14} />
              <span>Lavender Garden</span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="m-0 font-display text-step4 font-light leading-[0.95] tracking-tight text-ink"
            >
              <span className="italic">Our</span> Chapter
            </motion.h1>

            <motion.div variants={fadeUp} className="mt-2.5">
              <WatercolorBrushLine />
            </motion.div>

            <motion.p
              variants={fadeUp}
              className="mt-4 font-mono text-[11px] uppercase tracking-[0.22em] text-ink-faint"
            >
              Since 12.09.2023
            </motion.p>

            {/* The monthsary reading */}
            <motion.div variants={fadeUp} className="mt-3.5">
              {monthsary.isToday ? (
                <p className="font-display text-step1 font-normal italic text-accent">
                  Happy {ordinal(monthsary.months)} monthsary.
                </p>
              ) : (
                <p className="font-mono text-[11px] uppercase leading-relaxed tracking-[0.16em] text-ink-muted">
                  {monthsary.months} months · {monthsary.daysSince}{" "}
                  {monthsary.daysSince === 1 ? "day" : "days"}
                  <br />
                  <span className="text-[rgb(var(--purple-soft))]">
                    next in {monthsary.daysUntil} {monthsary.daysUntil === 1 ? "day" : "days"}
                  </span>
                </p>
              )}
            </motion.div>

            <motion.div variants={fadeUp} className="mt-8 flex items-start justify-center gap-5">
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

            <motion.div variants={fadeUp} className="mt-9 flex flex-col items-center gap-5">
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
      </div>
    </Shell>
  );
}
