import { useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import "../styles/animations.css";
import { colors, fonts } from "../lib/tokens";
import { getChapterBySlug, getNextChapter } from "../data/chapters";
import { ChevronLeftIcon, PawPrintIcon } from "../components/icons";
import { MusicToggle } from "../components/MusicToggle";
import { Panel } from "../components/Panel";
import { RibbonIcon } from "../components/RibbonIcon";

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
      animate={pressed ? {} : { scale: [1, 1.02, 1] }}
      transition={pressed ? { duration: 0.5 } : { duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
      whileTap={{ scale: 0.93 }}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        fontFamily: fonts.display,
        fontWeight: 800,
        fontSize: 19,
        color: colors.cherry500,
        background: colors.white,
        border: `3px solid ${colors.cherry500}`,
        borderRadius: 999,
        padding: "16px 36px",
        cursor: "pointer",
        boxShadow: pressed ? "0 2px 0 #E8536B, 0 4px 10px rgba(232,83,107,.25)" : "0 5px 0 #E8536B, 0 10px 22px rgba(232,83,107,.28)",
      }}
    >
      <PawPrintIcon />
      Next Chapter&nbsp;→
    </motion.button>
  );
}

export function ChapterReaderPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const chapter = slug ? getChapterBySlug(slug) : undefined;
  if (!chapter) return <Navigate to="/chapters" replace />;

  const nextChapter = getNextChapter(chapter.number);
  const nextLabel = nextChapter ? `Chapter ${nextChapter.number} · ${nextChapter.title}` : (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
      More chapters coming soon <RibbonIcon size={14} color={colors.cherry500} />
    </span>
  );

  return (
    <div style={{ minHeight: "100vh", width: "100%", background: colors.pink50, fontFamily: fonts.body, position: "relative" }}>
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 30,
          background: "rgba(255,211,228,.94)",
          backdropFilter: "blur(10px)",
          padding: "14px 18px",
          display: "flex",
          alignItems: "center",
          gap: 12,
          boxShadow: "0 4px 16px rgba(232,83,107,0.12)",
        }}
      >
        <motion.button
          onClick={() => navigate("/chapters")}
          whileHover={{ x: -2 }}
          whileTap={{ scale: 0.9 }}
          style={{
            width: 38,
            height: 38,
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
          <div style={{ fontFamily: fonts.body, fontWeight: 800, fontSize: 10, letterSpacing: "1px", textTransform: "uppercase", color: colors.cherry500 }}>
            Chapter {chapter.number}
          </div>
          <div style={{ fontFamily: fonts.display, fontWeight: 800, fontSize: 18, color: colors.inkPlum, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {chapter.title}
          </div>
        </div>
      </header>

      <MusicToggle />

      <main style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", gap: 0, paddingTop: 0, paddingLeft: 0, paddingRight: 0, maxWidth: 680, margin: "0 auto" }}>
        <div
          style={{
            background: "rgba(255, 255, 255, 0.92)",
            backdropFilter: "blur(6px)",
            padding: "8px 14px",
            textAlign: "center",
            fontFamily: fonts.body,
            fontWeight: 800,
            fontSize: 12,
            color: colors.cherry500,
            borderBottom: `1.5px solid ${colors.pink100}`,
          }}
        >
          Press & hold picture to reveal text • Tap picture to modify/upload photo
        </div>
        {chapter.panels.map((panel, i) => (
          <Panel key={panel.id} panel={panel} index={i} />
        ))}

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, padding: "48px 20px 80px" }}>
          <NextChapterButton onClick={() => nextChapter && navigate(`/chapters/${nextChapter.slug}`)} />
          <span style={{ fontFamily: fonts.body, fontSize: 13, fontWeight: 700, color: colors.plumLight }}>{nextLabel}</span>
        </div>
      </main>
    </div>
  );
}

