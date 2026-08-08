import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { colors, fonts } from "../lib/tokens";
import { useMotionPrefs } from "../lib/motion";
import { getCloudinaryUrl, getPanelSrcSet } from "../lib/cloudinary";
import { StickerIcon, dropShadowStyle } from "./icons";
import { LikeButton } from "./LikeButton";
import { FrameInspectorModal } from "./FrameInspectorModal";
import type { Panel as PanelData } from "../types/chapter";

// Dev-only: tap a panel to open the photo-swap tool while building the site.
// Never shown in the production build a partner would open.
const DEV_TOOLS_ENABLED = import.meta.env.DEV;

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
  const { reveal } = useMotionPrefs();
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

  const handleClick = () => {
    if (DEV_TOOLS_ENABLED) setInspecting(true);
  };

  const height = HEIGHT_BY_SIZE[panel.size];
  const isFullBleed = panel.size === "full";
  const imageUrl = getCloudinaryUrl(panel.cloudinaryPublicId, { width: 1080, height: 1200 });
  const srcSet = getPanelSrcSet(panel.cloudinaryPublicId, { height: 1200 });
  const narrationAtBottom = panel.variant === "narration" ? index % 2 === 0 : false;

  return (
    <>
      <motion.div
        {...reveal(isFullBleed ? 36 : 22)}
        onClick={handleClick}
        whileTap={DEV_TOOLS_ENABLED ? { scale: 0.99 } : undefined}
        style={{
          position: "relative",
          width: "100%",
          display: "block",
          lineHeight: 0,
          cursor: DEV_TOOLS_ENABLED ? "pointer" : "default",
          margin: 0,
          padding: 0,
        }}
      >
        <div
          style={{
            position: "relative",
            width: "100%",
            borderRadius: 0,
            overflow: "hidden",
            border: "none",
            boxShadow: "none",
          }}
        >
          <img
            src={imageUrl}
            srcSet={srcSet}
            sizes="100vw"
            alt={panel.alt}
            style={{ width: "100%", height, display: "block", objectFit: "cover", margin: 0, padding: 0, border: "none" }}
          />

          {/* Text overlays — always visible, this is the story */}
          <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 10 }}>
            <Stickers stickers={panel.stickers} />

            {panel.variant === "narration" && panel.caption && (
                  <div
                    style={{
                      position: "absolute",
                      left: 0,
                      right: 0,
                      [narrationAtBottom ? "bottom" : "top"]: 0,
                      padding: narrationAtBottom ? "34px 26px 22px" : "22px 26px 34px",
                      background: narrationAtBottom
                        ? "linear-gradient(180deg, transparent, rgba(70,20,35,.85))"
                        : "linear-gradient(0deg, transparent, rgba(70,20,35,.85))",
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
                    <div style={{ position: "absolute", top: 22, left: 20, maxWidth: "70%", background: "#fff", borderRadius: 20, padding: "12px 16px", boxShadow: "0 6px 16px rgba(0,0,0,.18)", zIndex: 12 }}>
                      <span style={{ fontFamily: fonts.body, fontWeight: 800, fontSize: 14.5, color: colors.inkPlum }}>{panel.caption}</span>
                    </div>
                    <div style={{ position: "absolute", top: 76, left: 30, width: 16, height: 16, background: "#fff", transform: "rotate(45deg)", zIndex: 11, boxShadow: "2px 2px 4px rgba(0,0,0,.1)" }} />
                  </>
                )}

                {panel.variant === "thought-bubble" && panel.caption && (
                  <>
                    <div style={{ position: "absolute", top: 20, right: 20, maxWidth: "72%", background: "#fff", borderRadius: 26, padding: "14px 18px", boxShadow: "0 6px 16px rgba(0,0,0,.18)", zIndex: 12 }}>
                      <span style={{ fontFamily: fonts.body, fontWeight: 800, fontStyle: "italic", fontSize: 14, color: colors.inkPlum }}>{panel.caption}</span>
                    </div>
                    <div style={{ position: "absolute", top: 66, right: 66, width: 12, height: 12, borderRadius: 999, background: "#fff", boxShadow: "0 3px 6px rgba(0,0,0,.12)", zIndex: 11 }} />
                    <div style={{ position: "absolute", top: 78, right: 52, width: 8, height: 8, borderRadius: 999, background: "#fff", boxShadow: "0 2px 4px rgba(0,0,0,.12)", zIndex: 11 }} />
                  </>
                )}
          </div>

          <LikeButton overlay />
        </div>
      </motion.div>

      {DEV_TOOLS_ENABLED && inspecting && (
        <FrameInspectorModal panel={panel} onClose={() => setInspecting(false)} />
      )}
    </>
  );
}


