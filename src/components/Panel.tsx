import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { colors, fonts } from "../lib/tokens";
import { getCloudinaryUrl, getPanelSrcSet } from "../lib/cloudinary";
import { StickerIcon, dropShadowStyle } from "./icons";
import { LikeButton } from "./LikeButton";
import { FrameInspectorModal } from "./FrameInspectorModal";
import type { Panel as PanelData } from "../types/chapter";

// Every panel is full-bleed/edge-to-edge — "size" controls pacing
const HEIGHT_BY_SIZE: Record<PanelData["size"], string> = {
  full: "clamp(420px, 72vh, 680px)",
  large: "clamp(340px, 58vh, 560px)",
  medium: "clamp(300px, 48vh, 460px)",
  small: "clamp(240px, 38vh, 360px)",
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
  /** Position within the chapter — used only to alternate narration top/bottom for rhythm. */
  index: number;
}

export function Panel({ panel, index }: PanelProps) {
  const [inspecting, setInspecting] = useState(false);
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

  const height = HEIGHT_BY_SIZE[panel.size];
  const isFullBleed = panel.size === "full";
  const imageUrl = getCloudinaryUrl(panel.cloudinaryPublicId, { width: 1080, height: 1200 });
  const srcSet = getPanelSrcSet(panel.cloudinaryPublicId, { height: 1200 });
  const narrationAtBottom = panel.variant === "narration" ? index % 2 === 0 : false;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: isFullBleed ? 36 : 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={
          isFullBleed
            ? { duration: 0.9, ease: [0.22, 0.61, 0.36, 1] }
            : { duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }
        }
        onClick={() => setInspecting(true)}
        style={{
          position: "relative",
          width: "100%",
          display: "block",
          lineHeight: 0,
          cursor: "pointer",
          margin: "6px 0",
        }}
      >
        <div
          style={{
            position: "relative",
            width: "100%",
            borderRadius: 16,
            overflow: "hidden",
            boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
            border: "1.5px solid rgba(255, 211, 228, 0.6)",
          }}
        >
          <img
            src={imageUrl}
            srcSet={srcSet}
            sizes="100vw"
            alt={panel.alt}
            style={{ width: "100%", height, display: "block", objectFit: "cover" }}
          />

          <Stickers stickers={panel.stickers} />

          {/* Inspect Frame Badge */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setInspecting(true);
            }}
            title="Inspect Panel Frame & Test Upload"
            style={{
              position: "absolute",
              top: 14,
              right: 14,
              zIndex: 5,
              background: "rgba(255, 255, 255, 0.88)",
              backdropFilter: "blur(6px)",
              border: `1.5px solid ${colors.pink300}`,
              borderRadius: 999,
              padding: "4px 10px",
              fontFamily: fonts.body,
              fontWeight: 800,
              fontSize: 11,
              color: colors.cherry500,
              display: "flex",
              alignItems: "center",
              gap: 4,
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(232,83,107,0.15)",
            }}
          >
            🔍 Frame Info
          </button>

          {panel.variant === "narration" && panel.caption && (
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                [narrationAtBottom ? "bottom" : "top"]: 0,
                padding: narrationAtBottom ? "34px 26px 22px" : "22px 26px 34px",
                background: narrationAtBottom
                  ? "linear-gradient(180deg, transparent, rgba(70,20,35,.78))"
                  : "linear-gradient(0deg, transparent, rgba(70,20,35,.78))",
              }}
            >
              <div style={{ fontFamily: fonts.body, fontWeight: 800, fontStyle: "italic", fontSize: 16, lineHeight: 1.5, color: "#fff", textShadow: "0 2px 6px rgba(0,0,0,.35)" }}>
                {panel.caption}
              </div>
            </div>
          )}

          {panel.variant === "photo-caption" && panel.caption && (
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: 0,
                padding: "18px 22px 18px",
                background: "linear-gradient(180deg, transparent, rgba(255,231,240,.96) 55%)",
              }}
            >
              <div style={{ fontFamily: fonts.body, fontStyle: "italic", fontWeight: 800, fontSize: 15, color: colors.inkPlum, textShadow: "0 1px 2px rgba(255,255,255,.6)" }}>
                {panel.caption}
              </div>
            </div>
          )}

          {panel.variant === "speech-bubble" && panel.caption && (
            <>
              <div style={{ position: "absolute", top: 22, left: 20, maxWidth: "70%", background: "#fff", borderRadius: 20, padding: "12px 16px", boxShadow: "0 6px 16px rgba(0,0,0,.18)", zIndex: 2 }}>
                <span style={{ fontFamily: fonts.body, fontWeight: 800, fontSize: 14.5, color: colors.inkPlum }}>{panel.caption}</span>
              </div>
              <div style={{ position: "absolute", top: 76, left: 30, width: 16, height: 16, background: "#fff", transform: "rotate(45deg)", zIndex: 1, boxShadow: "2px 2px 4px rgba(0,0,0,.1)" }} />
            </>
          )}

          {panel.variant === "thought-bubble" && panel.caption && (
            <>
              <div style={{ position: "absolute", top: 20, right: 20, maxWidth: "72%", background: "#fff", borderRadius: 26, padding: "14px 18px", boxShadow: "0 6px 16px rgba(0,0,0,.18)", zIndex: 2 }}>
                <span style={{ fontFamily: fonts.body, fontWeight: 800, fontStyle: "italic", fontSize: 14, color: colors.inkPlum }}>{panel.caption}</span>
              </div>
              <div style={{ position: "absolute", top: 66, right: 66, width: 12, height: 12, borderRadius: 999, background: "#fff", boxShadow: "0 3px 6px rgba(0,0,0,.12)", zIndex: 1 }} />
              <div style={{ position: "absolute", top: 78, right: 52, width: 8, height: 8, borderRadius: 999, background: "#fff", boxShadow: "0 2px 4px rgba(0,0,0,.12)", zIndex: 1 }} />
            </>
          )}

          <LikeButton overlay />
        </div>
      </motion.div>

      {inspecting && (
        <FrameInspectorModal panel={panel} onClose={() => setInspecting(false)} />
      )}
    </>
  );
}

