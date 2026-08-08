import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { colors, fonts } from "../lib/tokens";
import { getCloudinaryUrl } from "../lib/cloudinary";
import { BowIcon, ChevronLeftIcon } from "./icons";
import type { ChapterSummary } from "../types/chapter";

export interface ChapterCardProps {
  chapter: ChapterSummary;
  isNewest?: boolean;
  onSelect?: () => void;
}

export function ChapterCard({ chapter, isNewest = false, onSelect }: ChapterCardProps) {
  const [, setRerender] = useState(0);

  useEffect(() => {
    const handleUpdate = () => setRerender((r) => r + 1);
    window.addEventListener("placeholder_mode_change", handleUpdate);
    window.addEventListener("custom_photo_change", handleUpdate);
    return () => {
      window.removeEventListener("placeholder_mode_change", handleUpdate);
      window.removeEventListener("custom_photo_change", handleUpdate);
    };
  }, []);

  const thumbnailUrl = getCloudinaryUrl(chapter.coverImagePublicId, { width: 160, height: 160 });

  return (
    <motion.div
      onClick={onSelect}
      whileHover={{ y: -4, boxShadow: "0 12px 28px rgba(232,83,107,.24)" }}
      whileTap={{ scale: 0.97 }}
      style={{
        position: "relative",
        display: "flex",
        gap: 16,
        alignItems: "center",
        background: colors.white,
        borderRadius: 24,
        padding: 16,
        boxShadow: "0 8px 22px rgba(232,83,107,.14)",
        border: `2px solid ${colors.pink100}`,
        cursor: "pointer",
        transition: "border-color 0.2s ease",
      }}
    >
      {isNewest && (
        <div
          style={{
            position: "absolute",
            top: -12,
            right: 14,
            zIndex: 3,
            display: "flex",
            alignItems: "center",
            gap: 4,
            background: colors.cherry500,
            color: "#fff",
            padding: "5px 12px 5px 10px",
            borderRadius: 999,
            fontFamily: fonts.body,
            fontWeight: 800,
            fontSize: 11,
            letterSpacing: ".6px",
            transform: "rotate(-5deg)",
            boxShadow: "0 4px 12px rgba(232,83,107,.35)",
          }}
        >
          <BowIcon size={14} color="#fff" />
          LATEST
        </div>
      )}

      {/* Frame Thumbnail Container */}
      <div
        style={{
          width: 80,
          height: 80,
          borderRadius: 20,
          flex: "none",
          overflow: "hidden",
          border: `2px solid ${colors.pink300}`,
          background: "#FAFAFC",
          boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
        }}
      >
        <img
          src={thumbnailUrl}
          alt={chapter.title}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      {/* Details */}
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 4 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontFamily: fonts.body, fontWeight: 800, fontSize: 11, letterSpacing: "1px", textTransform: "uppercase", color: colors.cherry500 }}>
            Chapter {chapter.number}
          </span>
          <span style={{ fontSize: 11, color: colors.pink300 }}>•</span>
          <span style={{ fontFamily: fonts.body, fontWeight: 700, fontSize: 11, color: colors.plumLight }}>
            {chapter.publishedAt}
          </span>
        </div>
        <span style={{ fontFamily: fonts.display, fontWeight: 800, fontSize: 18, color: colors.inkPlum, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {chapter.title}
        </span>
        <span style={{ fontFamily: fonts.body, fontSize: 13, fontWeight: 600, color: colors.plumLight, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {chapter.teaser}
        </span>
      </div>

      <span style={{ transform: "rotate(180deg)", flex: "none" }}>
        <ChevronLeftIcon size={18} color={colors.cherry500} />
      </span>
    </motion.div>
  );
}

