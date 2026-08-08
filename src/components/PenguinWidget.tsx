import { useState, useRef } from "react";
import { motion } from "framer-motion";

// ---------- Persistent position ----------
function usePersist<T>(key: string, initial: T) {
  const stored = localStorage.getItem(key);
  const [val, setVal] = useState<T>(stored !== null ? JSON.parse(stored) : initial);
  const save = (v: T) => { setVal(v); localStorage.setItem(key, JSON.stringify(v)); };
  return [val, save] as const;
}

// ---------- Constants ----------
const SIZE    = 88;   // image size in px
const PEEK_PX = 48;   // visible px when resting at edge
const HIDDEN  = SIZE - PEEK_PX; // px pushed off-screen at rest

// One shared spring so position, opacity, scale, and the peek↔open crossfade
// all move on the same physical timing — like real iOS AssistiveTouch, where
// the bubble sliding, fading, and resizing reads as one continuous gesture
// instead of a few separately-timed animations landing at different moments.
const SPRING = { type: "spring", stiffness: 420, damping: 34, mass: 0.9 } as const;

// ---------- Main export ----------
export function PenguinWidget() {
  return <HaruAssistiveTouch />;
}

// ---------- Assistive-Touch Haru ----------
function HaruAssistiveTouch() {
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
      animate={{
        x:       translateX,
        opacity: visible ? 1 : 0.62,
        scale:   dragging ? 1.08 : 1,
      }}
      transition={SPRING}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => { if (!open) setHovered(false); }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      aria-label="Haru assistive touch"
    >
      {/* Both artworks stay mounted and cross-fade/scale against each other
          on the SAME spring as the position above — no unmount/remount pop,
          just one continuous peek-to-open motion (and back). */}
      <div style={{ position: "relative", width: SIZE, height: SIZE }}>
        <motion.img
          src="/peekingharu.webp"
          alt="Haru peeking"
          draggable={false}
          animate={{ opacity: open ? 0 : 1, scale: open ? 0.82 : 1 }}
          transition={SPRING}
          style={{
            position: "absolute", inset: 0,
            width: SIZE, height: SIZE,
            objectFit: "contain",
            display: "block",
            pointerEvents: "none",
            filter: "drop-shadow(0 4px 10px rgba(60,20,40,.3))",
            ...flip,
          }}
        />
        <motion.img
          src="/Haru.webp"
          alt="Haru"
          draggable={false}
          animate={{ opacity: open ? 1 : 0, scale: open ? 1 : 1.12 }}
          transition={SPRING}
          style={{
            position: "absolute", inset: 0,
            width: SIZE, height: SIZE,
            objectFit: "contain",
            display: "block",
            pointerEvents: "none",
            filter: "drop-shadow(0 6px 14px rgba(60,20,40,.4))",
            ...flip,
          }}
        />
      </div>
    </motion.div>
  );
}
