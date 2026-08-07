import { useState } from "react";
import { motion } from "framer-motion";
import { colors } from "../lib/tokens";
import { SpeakerIcon } from "./icons";

export interface MusicToggleProps {
  defaultOn?: boolean;
  onChange?: (on: boolean) => void;
}

/** Corner-floating icon-only control. Visual on/off state only — no audio wired up yet. */
export function MusicToggle({ defaultOn = false, onChange }: MusicToggleProps) {
  const [on, setOn] = useState(defaultOn);
  return (
    <motion.button
      onClick={() => {
        const next = !on;
        setOn(next);
        onChange?.(next);
      }}
      aria-pressed={on}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.9 }}
      style={{
        position: "fixed",
        bottom: 26,
        right: 16,
        zIndex: 40,
        width: 46,
        height: 46,
        borderRadius: 999,
        background: "rgba(255,255,255,.85)",
        border: `2px solid ${colors.pink300}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        boxShadow: "0 6px 14px rgba(232,83,107,.22)",
      }}
    >
      <SpeakerIcon muted={!on} />
    </motion.button>
  );
}
