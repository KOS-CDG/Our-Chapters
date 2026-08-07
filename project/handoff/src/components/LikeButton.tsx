import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { HeartIcon, StarIcon } from "./icons";
import { colors } from "../lib/tokens";

const BURST_PARTICLES = [0, 60, 120, 180, 240, 300].map((deg, i) => ({
  isHeart: i % 2 === 0,
  color: [colors.cherry500, colors.pink300, colors.babyBlue200][i % 3],
  dx: Math.round(Math.cos((deg * Math.PI) / 180) * 36),
  dy: Math.round(Math.sin((deg * Math.PI) / 180) * 36),
  delay: (i * 0.03).toFixed(2),
}));

export interface LikeButtonProps {
  defaultLiked?: boolean;
  onChange?: (liked: boolean) => void;
}

/** Like button under a panel: tap toggles a filled heart and fires a heart/star burst that settles back. */
export function LikeButton({ defaultLiked = false, onChange }: LikeButtonProps) {
  const [liked, setLiked] = useState(defaultLiked);
  const [bursting, setBursting] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const handleClick = () => {
    const next = !liked;
    setLiked(next);
    onChange?.(next);
    if (next) {
      setBursting(true);
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setBursting(false), 700);
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={handleClick}
        aria-pressed={liked}
        style={{
          width: 42,
          height: 42,
          borderRadius: 999,
          background: colors.white,
          border: `2px solid ${colors.pink300}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          boxShadow: "0 4px 10px rgba(232,83,107,.16)",
          animation: bursting ? "heartPop .3s ease" : undefined,
        }}
      >
        <HeartIcon size={19} filled={liked} />
      </button>
      {bursting &&
        BURST_PARTICLES.map((b, i) => {
          const style = {
            position: "absolute",
            left: "50%",
            top: "50%",
            width: 14,
            height: 14,
            pointerEvents: "none",
            ["--dx" as string]: `${b.dx}px`,
            ["--dy" as string]: `${b.dy}px`,
            animation: `burstOut .7s ease-out ${b.delay}s forwards`,
          } as CSSProperties;
          return <div key={i} style={style}>{b.isHeart ? <HeartIcon size={14} color={b.color} /> : <StarIcon size={14} color={b.color} />}</div>;
        })}
    </div>
  );
}
