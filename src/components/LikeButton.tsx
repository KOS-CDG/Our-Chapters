import { useState } from "react";
import type { CSSProperties } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { HeartIcon, StarIcon } from "./icons";
import { colors } from "../lib/tokens";

const BURST_PARTICLES = [0, 60, 120, 180, 240, 300].map((deg, i) => ({
  isHeart: i % 2 === 0,
  color: [colors.cherry500, colors.pink300, colors.babyBlue200][i % 3],
  dx: Math.round(Math.cos((deg * Math.PI) / 180) * 36),
  dy: Math.round(Math.sin((deg * Math.PI) / 180) * 36),
  delay: i * 0.03,
}));

export interface LikeButtonProps {
  defaultLiked?: boolean;
  onChange?: (liked: boolean) => void;
  /** Renders as a compact overlay chip for use directly on top of an image. */
  overlay?: boolean;
}

/** Like button: tap toggles a filled heart and fires a heart/star burst that settles back. */
export function LikeButton({ defaultLiked = false, onChange, overlay = false }: LikeButtonProps) {
  const [liked, setLiked] = useState(defaultLiked);
  const [bursting, setBursting] = useState(false);

  const handleClick = () => {
    const next = !liked;
    setLiked(next);
    onChange?.(next);
    if (next) setBursting(true);
  };

  const wrapperStyle: CSSProperties = overlay
    ? { position: "absolute", zIndex: 5, bottom: 12, right: 12 }
    : { position: "relative" };

  return (
    <div style={wrapperStyle}>
      <motion.button
        onClick={handleClick}
        aria-pressed={liked}
        whileTap={{ scale: 0.88 }}
        animate={bursting ? { scale: [1, 1.3, 1] } : { scale: 1 }}
        transition={{ duration: 0.3 }}
        onAnimationComplete={() => setBursting(false)}
        style={{
          width: 42,
          height: 42,
          borderRadius: 999,
          background: overlay ? "rgba(255,255,255,.88)" : colors.white,
          border: `2px solid ${colors.pink300}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          boxShadow: "0 4px 10px rgba(232,83,107,.22)",
        }}
      >
        <HeartIcon size={19} filled={liked} />
      </motion.button>
      <AnimatePresence>
        {bursting &&
          BURST_PARTICLES.map((b, i) => (
            <motion.div
              key={i}
              initial={{ x: "-50%", y: "-50%", scale: 0.3, opacity: 1 }}
              animate={{ x: `calc(-50% + ${b.dx}px)`, y: `calc(-50% + ${b.dy}px)`, scale: 1, opacity: 0 }}
              transition={{ duration: 0.7, delay: b.delay, ease: "easeOut" }}
              style={{ position: "absolute", left: "50%", top: "50%", width: 14, height: 14, pointerEvents: "none" }}
            >
              {b.isHeart ? <HeartIcon size={14} color={b.color} /> : <StarIcon size={14} color={b.color} />}
            </motion.div>
          ))}
      </AnimatePresence>
    </div>
  );
}
