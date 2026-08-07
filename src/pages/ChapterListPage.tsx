import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../styles/animations.css";
import { colors, fonts } from "../lib/tokens";
import { chapterSummaries } from "../data/chapters";
import { ChapterCard } from "../components/ChapterCard";
import { ChapterCardSkeleton, EmptyState } from "../components/ChapterListStates";
import { BowIcon, ChevronLeftIcon } from "../components/icons";
import type { ChapterSummary } from "../types/chapter";

export interface ChapterListPageProps {
  chapters?: ChapterSummary[];
  isLoading?: boolean;
  sortOrder?: "chronological" | "recent-first";
}

/** Vertical chapter list — loading skeleton and empty state included. */
export function ChapterListPage({ chapters = chapterSummaries, isLoading = false, sortOrder = "chronological" }: ChapterListPageProps) {
  const navigate = useNavigate();

  const sorted = useMemo(() => {
    const copy = [...chapters].sort((a, b) => a.number - b.number);
    return sortOrder === "recent-first" ? copy.reverse() : copy;
  }, [chapters, sortOrder]);

  const newestNumber = useMemo(() => chapters.reduce((max, c) => Math.max(max, c.number), 0), [chapters]);
  const isEmpty = !isLoading && chapters.length === 0;

  return (
    <div style={{ minHeight: "100vh", width: "100%", background: colors.pink50, fontFamily: fonts.body, position: "relative" }}>
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          background: "rgba(255,211,228,.92)",
          backdropFilter: "blur(6px)",
          padding: "16px 18px 10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <motion.button
          onClick={() => navigate("/")}
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
          <ChevronLeftIcon />
        </motion.button>
        <h1 style={{ margin: 0, fontFamily: fonts.display, fontWeight: 800, fontSize: 22, color: colors.cherry500 }}>Chapters</h1>
        <BowIcon size={30} />
      </header>

      <main style={{ position: "relative", zIndex: 2, padding: "8px 18px 60px", maxWidth: 520, margin: "0 auto" }}>
        {isLoading && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 8 }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <ChapterCardSkeleton key={i} />
            ))}
          </div>
        )}
        {isEmpty && <EmptyState />}
        {!isLoading && !isEmpty && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 8 }}>
            {sorted.map((chapter) => (
              <ChapterCard
                key={chapter.id}
                chapter={chapter}
                isNewest={chapter.number === newestNumber}
                onSelect={() => navigate(`/chapters/${chapter.slug}`)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
