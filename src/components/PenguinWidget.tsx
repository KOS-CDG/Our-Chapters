import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ---------- Persistent helpers ----------
function usePersist<T>(key: string, initial: T) {
  const stored = localStorage.getItem(key);
  const [val, setVal] = useState<T>(stored !== null ? JSON.parse(stored) : initial);
  const save = (v: T) => { setVal(v); localStorage.setItem(key, JSON.stringify(v)); };
  return [val, save] as const;
}

// ---------- Image analysis results ----------
// peekingharu.webp: portrait image (~810×1440 px), penguin occupies the RIGHT ~50%
// of the canvas. Left half is empty white. Penguin faces left (toward screen).
// We render only the right half using object-position so the penguin fills the slot.
//
// Haru.webp: square-ish image, centered penguin facing forward.

const PEEK_IMG_W  = 110;  // rendered width of the full peekingharu image
const PEEK_CROP_W = 58;   // width of the right-half crop we show (just the penguin)
const PEEK_IMG_H  = 130;  // rendered height

// How many px of the CROP stay visible when resting at edge
// (penguin pokes just enough to be recognisable — head + eye + wing tip)
const VISIBLE_AT_REST = 46;

// Normal Haru size when open
const HARU_SIZE = 88;

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
  const [hovered, setHovered] = useState(false);
  const [open, setOpen]       = useState(false);

  const dragRef    = useRef<{ startY: number; startX: number; initY: number } | null>(null);
  const hasDragged = useRef(false);

  const visible = hovered || open;

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
    if (Math.abs(dy) > 5 || Math.abs(dx) > 5) hasDragged.current = true;

    const newY = Math.max(20, Math.min(
      window.innerHeight - PEEK_IMG_H - 20,
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
  };

  const onTouchStart = () => setHovered(true);
  const onTouchEnd   = () => setTimeout(() => { if (!open) setHovered(false); }, 500);

  // ---- PEEKING state ----
  // The peekingharu image has the penguin in the right half.
  // We clip to PEEK_CROP_W wide and use object-position to show only the right portion.
  // When resting: translate so only VISIBLE_AT_REST px stick out from the edge.
  // When hovered: translate to show the full crop width.

  // translateX for the PEEKING container
  const peekHiddenOffset = PEEK_CROP_W - VISIBLE_AT_REST; // how many px to hide
  const peekTranslateX   = visible
    ? 0
    : side === "right"
      ?  peekHiddenOffset   // push rightward off screen
      : -peekHiddenOffset;  // push leftward off screen

  // Mirror the whole widget when on left side
  const mirrorStyle: React.CSSProperties =
    side === "left" ? { transform: "scaleX(-1)" } : {};

  return (
    <div
      style={{
        position:    "fixed",
        top:         posY,
        [side]:      0,
        zIndex:      999,
        cursor:      "grab",
        userSelect:  "none",
        touchAction: "none",
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { if (!open) setHovered(false); }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      aria-label="Haru assistive touch"
    >
      <AnimatePresence mode="wait">

        {/* ---- PEEKING state ---- */}
        {!open && (
          <motion.div
            key="peek"
            initial={false}
            animate={{
              x:       peekTranslateX,
              opacity: visible ? 1 : 0.75,
            }}
            exit={{ opacity: 0, scale: 0.88 }}
            transition={{ type: "spring", stiffness: 380, damping: 34 }}
            style={{
              // Clip container to show ONLY the right (penguin) portion of the image
              width:    PEEK_CROP_W,
              height:   PEEK_IMG_H,
              overflow: "hidden",
              ...mirrorStyle,
            }}
          >
            <img
              src="/peekingharu.webp"
              alt="Haru peeking"
              draggable={false}
              style={{
                // Render the full image at PEEK_IMG_W wide so right crop is visible
                width:       PEEK_IMG_W,
                height:      PEEK_IMG_H,
                objectFit:   "cover",
                // Shift left so the penguin (right half) is centred in our crop window
                marginLeft:  -(PEEK_IMG_W - PEEK_CROP_W),
                display:     "block",
                pointerEvents: "none",
                filter:      "drop-shadow(-4px 4px 10px rgba(60,20,40,.35))",
              }}
            />
          </motion.div>
        )}

        {/* ---- OPEN state: normal Haru ---- */}
        {open && (
          <motion.div
            key="normal"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 380, damping: 26 }}
            style={mirrorStyle}
          >
            <img
              src="/Haru.webp"
              alt="Haru"
              draggable={false}
              style={{
                width:  HARU_SIZE,
                height: HARU_SIZE,
                objectFit: "contain",
                display: "block",
                pointerEvents: "none",
                filter: "drop-shadow(0 6px 14px rgba(60,20,40,.4))",
              }}
            />
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
