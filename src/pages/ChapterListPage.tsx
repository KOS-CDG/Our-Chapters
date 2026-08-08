import { useMemo, useState } from "react";
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

export function ChapterListPage({ chapters = chapterSummaries, isLoading = false, sortOrder: initialSort = "chronological" }: ChapterListPageProps) {
  const navigate = useNavigate();
  const [currentSort, setCurrentSort] = useState<"chronological" | "recent-first">(initialSort);
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
    <div style={{ minHeight: "100vh", width: "100%", background: colors.pink50, fontFamily: fonts.body, position: "relative" }}>
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          background: "rgba(255,211,228,.94)",
          backdropFilter: "blur(10px)",
          padding: "16px 20px 12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 4px 16px rgba(232,83,107,0.12)",
        }}
      >
        <motion.button
          onClick={() => navigate("/")}
          whileHover={{ x: -2 }}
          whileTap={{ scale: 0.9 }}
          style={{
            width: 40,
            height: 40,
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
        <div style={{ textAlign: "center" }}>
          <h1 style={{ margin: 0, fontFamily: fonts.display, fontWeight: 800, fontSize: 22, color: colors.cherry500 }}>
            Chapter Directory
          </h1>
          <span style={{ fontSize: 11, fontWeight: 700, color: colors.plumLight }}>
            {chapters.length} Chapters Published
          </span>
        </div>
        <BowIcon size={32} color={colors.cherry500} />
      </header>

      <main style={{ position: "relative", zIndex: 2, padding: "16px 18px 60px", maxWidth: 540, margin: "0 auto" }}>
        {/* Search & Sort Controls */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 18 }}>
          <div style={{ position: "relative", width: "100%" }}>
            <input
              type="text"
              placeholder="Search chapters by title or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "12px 18px 12px 42px",
                borderRadius: 999,
                border: `2px solid ${colors.pink300}`,
                background: "#ffffff",
                fontFamily: fonts.body,
                fontSize: 14,
                fontWeight: 700,
                color: colors.inkPlum,
                outline: "none",
                boxShadow: "0 4px 12px rgba(232,83,107,0.08)",
              }}
            />
            <span style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", fontSize: 16, display: "flex", alignItems: "center" }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={colors.cherry500} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 4px" }}>
            <span style={{ fontFamily: fonts.body, fontSize: 12, fontWeight: 800, color: colors.plumLight }}>
              Order:
            </span>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => setCurrentSort("chronological")}
                style={{
                  background: currentSort === "chronological" ? colors.cherry500 : "#fff",
                  color: currentSort === "chronological" ? "#fff" : colors.cherry500,
                  border: `1.5px solid ${colors.cherry500}`,
                  borderRadius: 999,
                  padding: "4px 14px",
                  fontSize: 12,
                  fontWeight: 800,
                  fontFamily: fonts.body,
                  cursor: "pointer",
                }}
              >
                1 → {chapters.length} First
              </button>
              <button
                onClick={() => setCurrentSort("recent-first")}
                style={{
                  background: currentSort === "recent-first" ? colors.cherry500 : "#fff",
                  color: currentSort === "recent-first" ? "#fff" : colors.cherry500,
                  border: `1.5px solid ${colors.cherry500}`,
                  borderRadius: 999,
                  padding: "4px 14px",
                  fontSize: 12,
                  fontWeight: 800,
                  fontFamily: fonts.body,
                  cursor: "pointer",
                }}
              >
                Latest First
              </button>
            </div>
          </div>
        </div>

        {isLoading && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 8 }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <ChapterCardSkeleton key={i} />
            ))}
          </div>
        )}

        {isEmpty && <EmptyState />}

        {!isLoading && !isEmpty && (
          <motion.div
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: { opacity: 1, transition: { staggerChildren: 0.08 } },
            }}
            style={{ display: "flex", flexDirection: "column", gap: 16 }}
          >
            {filteredAndSorted.map((chapter) => (
              <motion.div
                key={chapter.id}
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  show: { opacity: 1, y: 0 },
                }}
              >
                <ChapterCard
                  chapter={chapter}
                  isNewest={chapter.number === newestNumber}
                  onSelect={() => navigate(`/chapters/${chapter.slug}`)}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>
    </div>
  );
}

