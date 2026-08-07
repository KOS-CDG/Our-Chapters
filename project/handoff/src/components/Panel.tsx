import type { CSSProperties } from "react";
import { useInViewOnce } from "../hooks/useInViewOnce";
import { colors, fonts, shadows } from "../lib/tokens";
import { getImageUrl } from "../lib/images";
import { StickerIcon, dropShadowStyle } from "./icons";
import { LikeButton } from "./LikeButton";
import type { Panel as PanelData } from "../types";

const SIZE_MAP: Record<PanelData["size"], { width: string; height: number }> = {
  full: { width: "100%", height: 460 },
  large: { width: "92%", height: 340 },
  medium: { width: "82%", height: 250 },
  small: { width: "64%", height: 180 },
};

function Stickers({ stickers }: { stickers?: PanelData["stickers"] }) {
  if (!stickers?.length) return null;
  return (
    <>
      {stickers.map((s, i) => (
        <div key={i} style={{ position: "absolute", top: s.top, left: s.left, zIndex: 4, ...dropShadowStyle }}>
          <StickerIcon type={s.type} size={30} />
        </div>
      ))}
    </>
  );
}

export interface PanelProps {
  panel: PanelData;
  /** Position within the chapter — used only to alternate full-bleed narration top/bottom for rhythm. */
  index: number;
}

/** Renders one chapter panel, picking its visual treatment from `panel.size` + `panel.variant`. */
export function Panel({ panel, index }: PanelProps) {
  const { ref, revealed } = useInViewOnce<HTMLDivElement>();
  const isFullBleed = panel.size === "full";
  const rotation = !isFullBleed ? panel.rotation ?? 0 : 0;
  const { width, height } = SIZE_MAP[panel.size];
  const imageUrl = getImageUrl(panel.cloudinaryPublicId, { width: 900, height: height * 2 });

  const wrapperStyle: CSSProperties = {
    position: "relative",
    width: "100%",
    opacity: revealed ? 1 : 0,
    transform: `translateY(${revealed ? 0 : isFullBleed ? 36 : 22}px) rotate(${rotation}deg)`,
    transition: isFullBleed
      ? "opacity .9s cubic-bezier(.22,.61,.36,1), transform .9s cubic-bezier(.22,.61,.36,1)"
      : "opacity .55s ease-out, transform .6s cubic-bezier(.34,1.56,.64,1)",
  };

  const narrationAtBottom = index % 2 === 0;

  return (
    <div ref={ref} style={wrapperStyle}>
      {isFullBleed ? (
        <div style={{ position: "relative", width: "100%" }}>
          <img src={imageUrl} alt={panel.alt} style={{ width: "100%", height, display: "block", objectFit: "cover" }} />
          {panel.variant === "narration" && panel.caption && (
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                [narrationAtBottom ? "bottom" : "top"]: 0,
                padding: narrationAtBottom ? "34px 26px 20px" : "20px 26px 34px",
                background: narrationAtBottom
                  ? "linear-gradient(180deg, transparent, rgba(70,20,35,.72))"
                  : "linear-gradient(0deg, transparent, rgba(70,20,35,.72))",
              }}
            >
              <div style={{ fontFamily: fonts.body, fontWeight: 800, fontStyle: "italic", fontSize: 16, lineHeight: 1.5, color: "#fff", textShadow: "0 2px 6px rgba(0,0,0,.35)" }}>
                {panel.caption}
              </div>
            </div>
          )}
          <Stickers stickers={panel.stickers} />
        </div>
      ) : (
        <div style={{ position: "relative", width, margin: "0 auto" }}>
          <Stickers stickers={panel.stickers} />
          {panel.variant === "photo-caption" && (
            <div
              style={{
                position: "absolute",
                top: -10,
                left: "50%",
                transform: "translateX(-50%) rotate(-8deg)",
                width: 52,
                height: 18,
                background: "rgba(190,231,247,.85)",
                borderRadius: 2,
                zIndex: 3,
                boxShadow: "0 2px 4px rgba(0,0,0,.08)",
              }}
            />
          )}
          <div style={{ background: colors.white, borderRadius: 20, padding: 10, boxShadow: shadows.soft }}>
            <img src={imageUrl} alt={panel.alt} style={{ width: "100%", height, borderRadius: 14, objectFit: "cover", display: "block" }} />
          </div>
          {panel.variant === "photo-caption" && panel.caption && (
            <div style={{ textAlign: "center", fontFamily: fonts.body, fontStyle: "italic", fontWeight: 700, fontSize: 13.5, color: colors.inkPlum, margin: "10px auto 0", maxWidth: "92%" }}>
              {panel.caption}
            </div>
          )}
          {panel.variant === "speech-bubble" && panel.caption && (
            <>
              <div style={{ position: "absolute", top: 18, left: 18, maxWidth: "68%", background: "#fff", borderRadius: 20, padding: "12px 16px", boxShadow: "0 6px 16px rgba(0,0,0,.15)", zIndex: 2 }}>
                <span style={{ fontFamily: fonts.body, fontWeight: 800, fontSize: 14.5, color: colors.inkPlum }}>{panel.caption}</span>
              </div>
              <div style={{ position: "absolute", top: 70, left: 26, width: 16, height: 16, background: "#fff", transform: "rotate(45deg)", zIndex: 1, boxShadow: "2px 2px 4px rgba(0,0,0,.08)" }} />
            </>
          )}
          {panel.variant === "thought-bubble" && panel.caption && (
            <>
              <div style={{ position: "absolute", top: -26, right: 14, maxWidth: "72%", background: "#fff", borderRadius: 26, padding: "14px 18px", boxShadow: "0 6px 16px rgba(0,0,0,.15)", zIndex: 2 }}>
                <span style={{ fontFamily: fonts.body, fontWeight: 800, fontStyle: "italic", fontSize: 14, color: colors.inkPlum }}>{panel.caption}</span>
              </div>
              <div style={{ position: "absolute", top: 8, right: 60, width: 12, height: 12, borderRadius: 999, background: "#fff", boxShadow: "0 3px 6px rgba(0,0,0,.1)", zIndex: 1 }} />
              <div style={{ position: "absolute", top: 18, right: 48, width: 8, height: 8, borderRadius: 999, background: "#fff", boxShadow: "0 2px 4px rgba(0,0,0,.1)", zIndex: 1 }} />
            </>
          )}
        </div>
      )}
      <div style={{ display: "flex", justifyContent: "center", marginTop: 12 }}>
        <LikeButton />
      </div>
    </div>
  );
}
