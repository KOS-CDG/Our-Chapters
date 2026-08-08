import { motion } from "framer-motion";
import { useMotionPrefs } from "../lib/motion";

/**
 * Animated floating lavender petals drifting gently down the screen.
 */
export function FloatingLavenderPetals() {
  const { reduced } = useMotionPrefs();
  if (reduced) return null;

  const petals = [
    { id: 1, left: "8%", size: 14, delay: 0, duration: 11, rotate: 45, color: "#AF91C3" },
    { id: 2, left: "22%", size: 10, delay: 2, duration: 13, rotate: 120, color: "#F2B8C6" },
    { id: 3, left: "45%", size: 16, delay: 1, duration: 10, rotate: 210, color: "#9371A6" },
    { id: 4, left: "68%", size: 12, delay: 3, duration: 12, rotate: 80, color: "#D8B4E2" },
    { id: 5, left: "88%", size: 15, delay: 0.5, duration: 14, rotate: 160, color: "#F7D6E0" },
  ];

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {petals.map((p) => (
        <motion.div
          key={p.id}
          initial={{ y: "-10%", x: 0, rotate: 0, opacity: 0 }}
          animate={{
            y: ["0%", "110%"],
            x: ["0px", p.id % 2 === 0 ? "25px" : "-25px", "10px"],
            rotate: [0, p.rotate],
            opacity: [0, 0.75, 0.75, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
          style={{
            position: "absolute",
            left: p.left,
            top: 0,
            width: p.size,
            height: p.size * 1.6,
            borderRadius: "60% 40% 70% 30% / 70% 30% 60% 40%",
            backgroundColor: p.color,
            filter: "blur(0.5px)",
          }}
        />
      ))}
    </div>
  );
}

/**
 * Ambient watercolor background brush glows of soft purple and pink.
 */
export function WatercolorBrushes() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* Top-left soft lavender-purple brush stroke glow */}
      <div
        className="absolute -left-20 -top-20 h-[380px] w-[380px] rounded-full opacity-35 blur-[70px]"
        style={{
          background: "radial-gradient(circle, rgb(var(--purple-soft)) 0%, transparent 70%)",
        }}
      />
      {/* Top-right blush pink brush stroke glow */}
      <div
        className="absolute -right-20 top-10 h-[360px] w-[360px] rounded-full opacity-40 blur-[75px]"
        style={{
          background: "radial-gradient(circle, rgb(var(--pink-blush)) 0%, transparent 70%)",
        }}
      />
      {/* Center soft lavender aura */}
      <div
        className="absolute left-1/2 top-[40%] h-[450px] w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-25 blur-[90px]"
        style={{
          background: "radial-gradient(circle, rgb(var(--lavender)) 0%, transparent 70%)",
        }}
      />
    </div>
  );
}

/**
 * Hand-drawn vector SVG stroke for a lavender sprig motif.
 */
export function LavenderSprigIcon({ size = 20, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 22V6" stroke="rgb(var(--ink-muted))" />
      {/* Lavender flower buds */}
      <path d="M12 6C11 4.5 9 4.5 9 6.5C9 8.5 12 9 12 9" fill="rgb(var(--purple-soft) / 0.8)" stroke="rgb(var(--purple-soft))" />
      <path d="M12 6C13 4.5 15 4.5 15 6.5C15 8.5 12 9 12 9" fill="rgb(var(--purple-soft) / 0.8)" stroke="rgb(var(--purple-soft))" />
      <path d="M12 10C10.5 8.5 8.5 8.5 8.5 10.5C8.5 12.5 12 13 12 13" fill="rgb(var(--lavender) / 0.8)" stroke="rgb(var(--purple-soft))" />
      <path d="M12 10C13.5 8.5 15.5 8.5 15.5 10.5C15.5 12.5 12 13 12 13" fill="rgb(var(--lavender) / 0.8)" stroke="rgb(var(--purple-soft))" />
      <path d="M12 14C10.8 12.5 9 12.5 9 14.5C9 16.5 12 17 12 17" fill="rgb(var(--pink-blush) / 0.8)" stroke="rgb(var(--accent))" />
      <path d="M12 14C13.2 12.5 15 12.5 15 14.5C15 16.5 12 17 12 17" fill="rgb(var(--pink-blush) / 0.8)" stroke="rgb(var(--accent))" />
      {/* Top tiny bloom */}
      <circle cx="12" cy="3.5" r="1.5" fill="rgb(var(--purple-soft))" />
    </svg>
  );
}

/**
 * Decorative watercolor brush underline for titles.
 */
export function WatercolorBrushLine({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`h-2.5 w-32 ${className}`}
      preserveAspectRatio="none"
    >
      <path
        d="M3 6C45 3.5 95 8.5 197 5"
        stroke="url(#watercolor-grad)"
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.8"
      />
      <defs>
        <linearGradient id="watercolor-grad" x1="0" y1="0" x2="200" y2="0" gradientUnits="userSpaceOnUse">
          <stop stopColor="rgb(var(--lavender))" stopOpacity="0.4" />
          <stop offset="0.5" stopColor="rgb(var(--purple-soft))" stopOpacity="0.85" />
          <stop offset="1" stopColor="rgb(var(--pink-blush))" stopOpacity="0.5" />
        </linearGradient>
      </defs>
    </svg>
  );
}
