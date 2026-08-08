import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { Shell } from "../components/Shell";
import { IconButton } from "../components/ui/IconButton";
import { CtaButton } from "../components/ui/CtaButton";
import { getChapterBySlug, getNextChapter } from "../data/chapters";
import { ChevronLeftIcon } from "../components/icons";
import { Panel } from "../components/Panel";

/** How far through the chapter you are, 0–1. */
function useScrollProgress(): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return progress;
}

export function ChapterReaderPage() {
  const { slug } = useParams<{ slug: string }>();
  const progress = useScrollProgress();

  const chapter = slug ? getChapterBySlug(slug) : undefined;
  if (!chapter) return <Navigate to="/chapters" replace />;

  const nextChapter = getNextChapter(chapter.number);

  return (
    <Shell>
      <header className="sticky top-0 z-30 border-b border-line bg-surface/95 backdrop-blur-sm pt-[max(0.75rem,var(--safe-t))]">
        <div className="mx-auto flex max-w-reader items-center gap-3 px-4 pb-3">
          <IconButton to="/chapters" label="Back to chapter list" size={38}>
            <ChevronLeftIcon size={16} />
          </IconButton>
          <div className="min-w-0">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faint">
              Chapter {String(chapter.number).padStart(2, "0")}
            </p>
            <h1 className="truncate font-display text-step1 font-normal leading-tight text-ink">
              {chapter.title}
            </h1>
          </div>
        </div>

        {/* Reading progress. A hairline, not a bar. */}
        <div
          className="h-px w-full origin-left bg-accent transition-transform duration-fast ease-linear"
          style={{ transform: `scaleX(${progress})` }}
          aria-hidden="true"
        />
      </header>

      <main id="main" className="mx-auto flex max-w-reader flex-col gap-0 p-0">
        {chapter.panels.map((panel, i) => (
          <Panel key={panel.id} panel={panel} index={i} />
        ))}

        <div className="flex flex-col items-center gap-4 px-5 pb-[max(5rem,var(--safe-b))] pt-14">
          {nextChapter ? (
            <>
              <CtaButton to={`/chapters/${nextChapter.slug}`}>Next chapter</CtaButton>
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-faint">
                Chapter {String(nextChapter.number).padStart(2, "0")} · {nextChapter.title}
              </span>
            </>
          ) : (
            /* No button here at all — it used to render on the last chapter
               with a no-op onClick, focusable and doing nothing. */
            <>
              <span className="block h-px w-12 bg-line" aria-hidden="true" />
              <p className="font-display text-step1 font-normal italic text-ink-muted">
                More chapters coming soon
              </p>
              <CtaButton to="/chapters" variant="quiet">
                All chapters →
              </CtaButton>
            </>
          )}
        </div>
      </main>
    </Shell>
  );
}
