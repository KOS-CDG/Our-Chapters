import { colors, fonts } from "../lib/tokens";
import { getImageUrl } from "../lib/images";
import { BowIcon, ChevronLeftIcon } from "./icons";
import type { ChapterSummary } from "../types";

export interface ChapterCardProps {
  chapter: ChapterSummary;
  isNewest?: boolean;
  onSelect?: () => void;
}

export function ChapterCard({ chapter, isNewest = false, onSelect }: ChapterCardProps) {
  return (
    <div
      onClick={onSelect}
      style={{
        position: "relative",
        display: "flex",
        gap: 14,
        alignItems: "center",
        background: colors.white,
        borderRadius: 24,
        padding: 14,
        boxShadow: "0 8px 20px rgba(232,83,107,.14)",
        border: "1.5px solid rgba(255,159,192,.35)",
        cursor: "pointer",
        transition: "transform .15s, box-shadow .15s",
      }}
    >
      {isNewest && (
        <div
          style={{
            position: "absolute",
            top: -12,
            right: 12,
            zIndex: 3,
            display: "flex",
            alignItems: "center",
            gap: 4,
            background: colors.cherry500,
            color: "#fff",
            padding: "5px 10px 5px 8px",
            borderRadius: 999,
            fontFamily: fonts.body,
            fontWeight: 800,
            fontSize: 11,
            letterSpacing: ".5px",
            transform: "rotate(-6deg)",
            boxShadow: "0 4px 10px rgba(232,83,107,.35)",
          }}
        >
          <BowIcon size={14} color="#fff" />
          NEW
        </div>
      )}
      <img
        src={getImageUrl(chapter.coverImagePublicId, { width: 160, height: 160 })}
        alt={chapter.title}
        style={{ width: 72, height: 72, borderRadius: 18, flex: "none", objectFit: "cover" }}
      />
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 3 }}>
        <span style={{ fontFamily: fonts.body, fontWeight: 800, fontSize: 11, letterSpacing: ".8px", textTransform: "uppercase", color: colors.plumLight }}>
          Chapter {chapter.number}
        </span>
        <span style={{ fontFamily: fonts.display, fontWeight: 700, fontSize: 17, color: colors.cherry500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {chapter.title}
        </span>
        <span style={{ fontFamily: fonts.body, fontSize: 13, color: colors.plumLight, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {chapter.teaser}
        </span>
      </div>
      <span style={{ transform: "rotate(180deg)", flex: "none" }}>
        <ChevronLeftIcon size={16} color={colors.pink300} />
      </span>
    </div>
  );
}
