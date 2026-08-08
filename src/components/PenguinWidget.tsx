import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { colors } from "../lib/tokens";
import { useMotionPrefs } from "../lib/motion";

// ---------- Persistent position ----------
function usePersist<T>(key: string, initial: T) {
  const stored = localStorage.getItem(key);
  const [val, setVal] = useState<T>(stored !== null ? JSON.parse(stored) : initial);
  const save = (v: T) => { setVal(v); localStorage.setItem(key, JSON.stringify(v)); };
  return [val, save] as const;
}

// ---------- Constants ----------
const SIZE    = 72;  // bubble diameter in px — real iOS AssistiveTouch is ~60-64pt
const PEEK_PX = 34;  // visible px when resting at the edge
const HIDDEN  = SIZE - PEEK_PX; // px pushed off-screen at rest

// One shared spring so position, opacity, scale, and the peek↔open crossfade
// all move on the same physical timing — like real iOS AssistiveTouch, where
// the bubble sliding, fading, and resizing reads as one continuous gesture
// instead of a few separately-timed animations landing at different moments.
// Lives in lib/motion.ts as SPRING_UI; useMotionPrefs() swaps it for an
// instant transition when the reader has asked for reduced motion.

// ---------- Peeking artwork crop ----------
// peekingharu.webp is a tall 1128x2048 canvas with Haru drawn off to the
// right and a lot of blank space around him — object-fit:contain/cover on a
// small square bubble just squeezes the whole blank canvas in, so almost
// nothing of him shows in the tiny peek reveal. Instead we pick a square
// crop directly around his face/shoulder and zoom the background-image so
// that exact region fills the bubble.
const PEEK_SRC_W = 1128;
const PEEK_SRC_H = 2048;
const PEEK_CROP_X = 480; // px — left edge of the crop, in source pixels
const PEEK_CROP_Y = 300; // px — top edge of the crop, in source pixels
const PEEK_CROP_SIZE = 650; // px — square crop side length, in source pixels
const PEEK_ZOOM = SIZE / PEEK_CROP_SIZE;
const peekArtStyle: React.CSSProperties = {
  backgroundImage: "url(/peekingharu.webp)",
  backgroundRepeat: "no-repeat",
  backgroundSize: `${PEEK_SRC_W * PEEK_ZOOM}px ${PEEK_SRC_H * PEEK_ZOOM}px`,
  backgroundPosition: `${-PEEK_CROP_X * PEEK_ZOOM}px ${-PEEK_CROP_Y * PEEK_ZOOM}px`,
};

// ---------- Main export ----------
export function PenguinWidget() {
  return <HaruAssistiveTouch />;
}

// ---------- Assistive-Touch Haru ----------
function HaruAssistiveTouch() {
  const { spring } = useMotionPrefs();
  const [posY, setPosY] = usePersist<number>(
    "ou_haru_y",
    Math.round((typeof window !== "undefined" ? window.innerHeight : 700) * 0.62),
  );
  const [side, setSide] = usePersist<"left" | "right">("ou_haru_side", "right");
  const [hovered, setHovered]   = useState(false);
  const [open, setOpen]         = useState(false);
  const [dragging, setDragging] = useState(false);

  const dragRef    = useRef<{ startY: number; startX: number; initY: number } | null>(null);
  const hasDragged = useRef(false);

  // Fully visible when hovered, dragging, or open — same "brought forward"
  // trigger AssistiveTouch uses (any touch on/near the bubble reveals it).
  const visible = hovered || open || dragging;

  // X translation that hides most of Haru behind the edge at rest
  const translateX = visible ? 0 : (side === "right" ? HIDDEN : -HIDDEN);

  // Mirror when on left side so Haru always faces inward
  const flip: React.CSSProperties = side === "left" ? { transform: "scaleX(-1)" } : {};

  // ---- Pointer handlers ----
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    dragRef.current = { startY: e.clientY, startX: e.clientX, initY: posY };
    hasDragged.current = false;
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return;
    const dy = e.clientY - dragRef.current.startY;
    const dx = e.clientX - dragRef.current.startX;
    if (Math.abs(dy) > 5 || Math.abs(dx) > 5) {
      hasDragged.current = true;
      if (!dragging) setDragging(true);
    }

    // Vertical slide — keep Haru within screen bounds
    const newY = Math.max(20, Math.min(
      window.innerHeight - SIZE - 20,
      dragRef.current.initY + dy,
    ));
    setPosY(newY);

    // Switch sides when dragged past horizontal midpoint
    if (side === "right" && e.clientX < window.innerWidth * 0.40) setSide("left");
    if (side === "left"  && e.clientX > window.innerWidth * 0.60) setSide("right");
  };

  const onPointerUp = () => {
    if (!hasDragged.current) setOpen((o) => !o);
    dragRef.current = null;
    setDragging(false);
  };

  // Mobile: brief hover-out delay so user sees Haru before it settles back
  const onTouchStart = () => setHovered(true);
  const onTouchEnd   = () => setTimeout(() => { if (!open) setHovered(false); }, 500);

  const scale = dragging ? 1.1 : open ? 1.15 : 1;

  return (
    <motion.div
      style={{
        position:    "fixed",
        top:         posY,
        [side]:      0,
        zIndex:      999,
        width:       SIZE,
        height:      SIZE,
        cursor:      dragging ? "grabbing" : "grab",
        userSelect:  "none",
        touchAction: "none",
      }}
      animate={{ x: translateX, opacity: visible ? 1 : 0.62, scale }}
      transition={spring}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => { if (!open) setHovered(false); }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      aria-label="Haru assistive touch"
    >
      {/* The bubble "chrome" — a translucent circular button in the same
          style as the site's other floating controls (MusicToggle etc.),
          giving Haru real AssistiveTouch-style hardware instead of a bare
          floating image. It clips both artworks to a clean circle so
          neither image's blank canvas/corners ever show. */}
      <div
        style={{
          position: "relative",
          width: SIZE,
          height: SIZE,
          borderRadius: "50%",
          overflow: "hidden",
          background: "rgba(255,255,255,.85)",
          border: `2px solid ${colors.pink300}`,
          boxShadow: "0 6px 16px rgba(232,83,107,.28)",
        }}
      >
        {/* Both artworks stay mounted and cross-fade/scale against each
            other on the SAME spring as the position/scale above, so
            peeking <-> open is one continuous motion, not a discrete cut. */}
        <motion.div
          animate={{ opacity: open ? 0 : 1, scale: open ? 0.8 : 1 }}
          transition={spring}
          style={{
            position: "absolute", inset: 0,
            ...peekArtStyle,
            ...flip,
          }}
        />
        <motion.img
          src="/Haru.webp"
          alt="Haru"
          draggable={false}
          animate={{ opacity: open ? 1 : 0, scale: open ? 1 : 1.12 }}
          transition={spring}
          style={{
            position: "absolute", inset: 0,
            width: SIZE, height: SIZE,
            objectFit: "cover",
            display: "block",
            pointerEvents: "none",
            ...flip,
          }}
        />
      </div>
    </motion.div>
  );
}
