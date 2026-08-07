import { colors } from "../lib/tokens";
import { BowIcon } from "./icons";

export interface ProgressRibbonProps {
  /** 0-100 */
  progress: number;
}

/** Slim ribbon fixed to the right edge, filling as the reader scrolls down the chapter. */
export function ProgressRibbon({ progress }: ProgressRibbonProps) {
  return (
    <div
      style={{
        position: "fixed",
        top: 96,
        bottom: 96,
        right: 12,
        width: 10,
        zIndex: 25,
        background: "rgba(255,255,255,.55)",
        border: `1.5px solid ${colors.pink300}99`,
        borderRadius: 999,
        boxShadow: "0 4px 10px rgba(232,83,107,.12)",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          borderRadius: 999,
          background: `linear-gradient(180deg, ${colors.pink300}, ${colors.cherry500})`,
          height: `${progress}%`,
          transition: "height .1s linear",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: `${progress}%`,
          transform: "translate(-50%,-50%)",
          filter: "drop-shadow(0 2px 4px rgba(232,83,107,.4))",
        }}
      >
        <BowIcon size={22} color={colors.cherry500} />
      </div>
    </div>
  );
}
