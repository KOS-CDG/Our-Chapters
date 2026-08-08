import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getPlaceholderMode, setPlaceholderMode, type PlaceholderMode } from "../lib/cloudinary";

export function PlaceholderToggle() {
  const [mode, setModeState] = useState<PlaceholderMode>(getPlaceholderMode());

  useEffect(() => {
    const handleModeChange = () => {
      setModeState(getPlaceholderMode());
    };
    window.addEventListener("placeholder_mode_change", handleModeChange);
    return () => window.removeEventListener("placeholder_mode_change", handleModeChange);
  }, []);

  const toggle = () => {
    const next = mode === "white" ? "sample" : "white";
    setPlaceholderMode(next);
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: 84,
        right: 20,
        zIndex: 99,
        display: "flex",
        alignItems: "center",
        gap: 6,
        background: "rgba(255, 255, 255, 0.94)",
        backdropFilter: "blur(12px)",
        border: `2px solid rgb(var(--line))`,
        borderRadius: 999,
        padding: "6px 14px",
        boxShadow: "0 8px 24px rgba(232, 83, 107, 0.22)",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-body)",
          fontSize: 11,
          fontWeight: 800,
          color: "rgb(var(--ink))",
          letterSpacing: ".4px",
          textTransform: "uppercase",
        }}
      >
        Frame Mode:
      </span>
      <motion.button
        onClick={toggle}
        whileTap={{ scale: 0.94 }}
        whileHover={{ scale: 1.04 }}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          background: mode === "white" ? "rgb(var(--accent))" : "rgb(var(--surface-sunken))",
          color: mode === "white" ? "#fff" : "rgb(var(--accent))",
          border: mode === "white" ? "none" : `1.5px solid rgb(var(--line))`,
          borderRadius: 999,
          padding: "4px 12px",
          fontFamily: "var(--font-body)",
          fontWeight: 800,
          fontSize: 12,
          cursor: "pointer",
          transition: "all 0.2s ease",
        }}
      >
        {mode === "white" ? "⬜ White Image Frames" : "🖼️ Sample Content"}
      </motion.button>
    </div>
  );
}
