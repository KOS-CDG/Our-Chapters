import { useState } from "react";
import "./styles/animations.css";
import { colors, fonts } from "./lib/tokens";
import { useScrollProgress } from "./hooks/useScrollProgress";
import { ChevronLeftIcon, PawPrintIcon } from "./components/icons";
import { ProgressRibbon } from "./components/ProgressRibbon";
import { MusicToggle } from "./components/MusicToggle";
import { Panel } from "./components/Panel";
import type { Chapter } from "./types";

export interface ChapterReaderPageProps {
  chapter: Chapter;
  /** Shown in the footer subtext / drives the Next Chapter label. Omit to show a generic message. */
  nextChapter?: { number: number; title: string };
  onBack?: () => void;
  onNextChapter?: () => void;
}

function NextChapterButton({ onClick }: { onClick?: () => void }) {
  const [pressed, setPressed] = useState(false);
  const handleClick = () => {
    setPressed(true);
    setTimeout(() => setPressed(false), 500);
    onClick?.();
  };
  return (
    <button
      onClick={handleClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        fontFamily: fonts.display,
        fontWeight: 700,
        fontSize: 19,
        color: colors.cherry500,
        background: colors.white,
        border: `3px solid ${colors.cherry500}`,
        borderRadius: 999,
        padding: "16px 34px",
        cursor: "pointer",
        boxShadow: pressed ? "0 2px 0 #E8536B, 0 4px 10px rgba(232,83,107,.25)" : "0 5px 0 #E8536B, 0 10px 22px rgba(232,83,107,.28)",
        animation: pressed ? "pressPulse .5s ease" : "bounceHint 2.8s ease-in-out infinite",
        transition: "box-shadow .15s, transform .15s",
      }}
    >
      <PawPrintIcon />
      Next Chapter&nbsp;→
    </button>
  );
}

/** Core reading experience: a chapter's panels as a true vertical scroll. */
export function ChapterReaderPage({ chapter, nextChapter, onBack, onNextChapter }: ChapterReaderPageProps) {
  const progress = useScrollProgress();
  const nextLabel = nextChapter ? `Chapter ${nextChapter.number} · ${nextChapter.title}` : "More chapters coming soon";

  return (
    <div style={{ minHeight: "100vh", width: "100%", background: colors.pink50, fontFamily: fonts.body, position: "relative" }}>
      <header style={{ position: "sticky", top: 0, zIndex: 30, background: "rgba(255,211,228,.92)", backdropFilter: "blur(6px)", padding: "14px 18px", display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={onBack} style={{ width: 36, height: 36, borderRadius: 999, background: "#fff", border: `2px solid ${colors.pink300}`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 10px rgba(232,83,107,.18)", flex: "none", cursor: "pointer" }}>
          <ChevronLeftIcon size={16} />
        </button>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontFamily: fonts.body, fontWeight: 800, fontSize: 10, letterSpacing: ".8px", textTransform: "uppercase", color: colors.plumLight }}>Chapter {chapter.number}</div>
          <div style={{ fontFamily: fonts.display, fontWeight: 700, fontSize: 17, color: colors.cherry500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{chapter.title}</div>
        </div>
      </header>

      <ProgressRibbon progress={progress} />
      <MusicToggle />

      <main style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", gap: 44, padding: "56px 0 20px" }}>
        {chapter.panels.map((panel, i) => <Panel key={panel.id} panel={panel} index={i} />)}

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, marginTop: 8 }}>
          <NextChapterButton onClick={onNextChapter} />
          <span style={{ fontFamily: fonts.body, fontSize: 13, color: colors.plumLight }}>{nextLabel}</span>
        </div>
      </main>
    </div>
  );
}
