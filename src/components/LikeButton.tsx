import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { HeartIcon } from "./icons";
import { STATIC, useMotionPrefs } from "../lib/motion";

const STORE_KEY = "ou_liked_panels";

function readLiked(): Set<string> {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}

function writeLiked(ids: Set<string>) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify([...ids]));
  } catch {
    /* private mode / quota — the heart just won't persist */
  }
}

const BURST = [0, 60, 120, 180, 240, 300].map((deg, i) => ({
  dx: Math.round(Math.cos((deg * Math.PI) / 180) * 30),
  dy: Math.round(Math.sin((deg * Math.PI) / 180) * 30),
  delay: i * 0.03,
}));

export interface LikeButtonProps {
  /** Panel this heart belongs to. Required for the like to persist. */
  panelId: string;
  /** Renders as a compact overlay chip for use directly on top of an image. */
  overlay?: boolean;
  onChange?: (liked: boolean) => void;
}

/**
 * Tap to keep a panel. Persists to localStorage keyed by panel id — the state
 * used to live only in this component instance, so every heart she tapped
 * vanished the moment she navigated away.
 */
export function LikeButton({ panelId, overlay = false, onChange }: LikeButtonProps) {
  const { reduced } = useMotionPrefs();
  const [liked, setLiked] = useState(() => readLiked().has(panelId));
  const [bursting, setBursting] = useState(false);

  const handleClick = () => {
    const next = !liked;
    setLiked(next);

    const ids = readLiked();
    if (next) ids.add(panelId);
    else ids.delete(panelId);
    writeLiked(ids);

    onChange?.(next);
    if (next && !reduced) setBursting(true);
  };

  return (
    /* z-20 keeps the heart above the dev-only photo-swap overlay (z-6) and the
       caption layer (z-10) — otherwise it is unclickable while developing. */
    <div className={overlay ? "absolute bottom-3 right-3 z-20" : "relative"}>
      <motion.button
        type="button"
        onClick={handleClick}
        aria-pressed={liked}
        aria-label={liked ? "Remove this panel from your favourites" : "Keep this panel"}
        whileTap={reduced ? undefined : { scale: 0.9 }}
        animate={bursting ? { scale: [1, 1.25, 1] } : { scale: 1 }}
        transition={reduced ? STATIC : { duration: 0.3 }}
        onAnimationComplete={() => setBursting(false)}
        className={[
          "flex h-10 w-10 items-center justify-center rounded-full border border-line",
          "transition-colors duration-base ease-soft",
          liked ? "bg-raised text-accent" : "bg-raised/85 text-ink-faint hover:text-accent",
        ].join(" ")}
      >
        <HeartIcon size={17} filled={liked} />
      </motion.button>

      <AnimatePresence>
        {bursting &&
          BURST.map((b, i) => (
            <motion.div
              key={i}
              aria-hidden="true"
              initial={{ x: "-50%", y: "-50%", scale: 0.4, opacity: 1 }}
              animate={{ x: `calc(-50% + ${b.dx}px)`, y: `calc(-50% + ${b.dy}px)`, scale: 1, opacity: 0 }}
              transition={{ duration: 0.7, delay: b.delay, ease: "easeOut" }}
              className="pointer-events-none absolute left-1/2 top-1/2 h-2.5 w-2.5 text-accent"
            >
              <HeartIcon size={10} />
            </motion.div>
          ))}
      </AnimatePresence>
    </div>
  );
}
