import { useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import "../styles/animations.css";
import { colors, fonts } from "../lib/tokens";
import { useScrollProgress } from "../hooks/useScrollProgress";
import { getChapterBySlug, getNextChapter } from "../data/chapters";
import { ChevronLeftIcon, PawPrintIcon } from "../components/icons";
import { ProgressRibbon } from "../components/ProgressRibbon";
import { MusicToggle } from "../components/MusicToggle";
import { Panel } from "../components/Panel";

function NextChapterButton({ onClick }: { onClick: () => void }) {
  const [pressed, setPressed] = useState(false);
  const handleClick = () => {
    setPressed(true);
    setTimeout(() => setPressed(false), 500);
    onClick();
  };
  return (
    <motion.button
      onClick={handleClick}
      animate={pressed ? {} : { y: [0, -5, 0], scale: [1, 1.02, 1] }}
      transition={pressed ? { duration: 0.5 } : { duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
      whileTap={{ scale: 0.93 }}
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
      }}
    >
      <PawPrintIcon />
      Next Chapter&nbsp;→
    </motion.button>
  );
}

/** Core reading experience: a chapter's panels as a true vertical scroll — full-width, edge-to-edge, zero gap, like a real manhwa/webtoon strip. */
export function ChapterReaderPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const progress = useScrollProgress();

  const chapter = slug ? getChapterBySlug(slug) : undefined;
  if (!chapter) return <Navigate to="/chapters" replace />;

  const nextChapter = getNextChapter(chapter.number);
  const nextLabel = nextChapter ? `Chapter ${nextChapter.number} · ${nextChapter.title}` : "More chapters coming soon";

  return (
    <div style={{ minHeight: "100vh", width: "100%", background: colors.pink50, fontFamily: fonts.body, position: "relative" }}>
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 30,
          background: "rgba(255,211,228,.92)",
          backdropFilter: "blur(6px)",
          padding: "14px 18px",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <motion.button
          onClick={() => navigate("/chapters")}
          whileHover={{ x: -2 }}
          whileTap={{ scale: 0.9 }}
          style={{
            width: 36,
            height: 36,
            borderRadius: 999,
            background: "#fff",
            border: `2px solid ${colors.pink300}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 10px rgba(232,83,107,.18)",
            flex: "none",
            cursor: "pointer",
          }}
        >
          <ChevronLeftIcon size={16} />
        </motion.button>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontFamily: fonts.body, fontWeight: 800, fontSize: 10, letterSpacing: ".8px", textTransform: "uppercase", color: colors.plumLight }}>
            Chapter {chapter.number}
          </div>
          <div style={{ fontFamily: fonts.display, fontWeight: 700, fontSize: 17, color: colors.cherry500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {chapter.title}
          </div>
        </div>
      </header>

      <ProgressRibbon progress={progress} />
      <MusicToggle />

      {/* The panel strip itself: gap:0 so panels touch edge-to-edge with no
          whitespace between them — the "no gaps whatsoever" manhwa read. The
          only padding here is safe-area clearance under the sticky header,
          not space between panels. */}
      <main style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", gap: 0, paddingTop: 8 }}>
        {chapter.panels.map((panel, i) => (
          <Panel key={panel.id} panel={panel} index={i} />
        ))}

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, padding: "40px 20px" }}>
          <NextChapterButton onClick={() => nextChapter && navigate(`/chapters/${nextChapter.slug}`)} />
          <span style={{ fontFamily: fonts.body, fontSize: 13, color: colors.plumLight }}>{nextLabel}</span>
        </div>
      </main>
    </div>
  );
}
