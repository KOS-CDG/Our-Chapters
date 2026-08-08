import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import type { ReactNode } from "react";
import { useMotionPrefs } from "../../lib/motion";

// Motion goes on the Link itself — a motion.div wrapper with whileTap picks up
// a tabindex from Framer and becomes a duplicate tab stop.
const MotionLink = motion(Link);

interface BaseProps {
  /** Required: these buttons are icon-only, so without this they announce as
   *  an unnamed button. Making it non-optional means TypeScript refuses to let
   *  a call site skip it. */
  label: string;
  children: ReactNode;
  size?: number;
  className?: string;
}

type IconButtonProps =
  | (BaseProps & { to: string; onClick?: never })
  | (BaseProps & { to?: never; onClick: () => void });

/**
 * The small circular control used for back navigation and corner toggles.
 * Replaces five hand-rolled copies at sizes 38/40/42/44/46.
 */
export function IconButton({ label, children, size = 40, className = "", to, onClick }: IconButtonProps) {
  const { tap } = useMotionPrefs();

  const shared = {
    "aria-label": label,
    className: [
      "inline-flex items-center justify-center rounded-sm border border-line",
      "bg-surface text-ink transition-colors duration-fast ease-soft",
      "hover:border-ink hover:text-accent",
      className,
    ].join(" "),
    style: { width: size, height: size },
  };

  if (to) {
    return (
      <MotionLink whileTap={tap} to={to} {...shared}>
        {children}
      </MotionLink>
    );
  }

  return (
    <motion.button type="button" onClick={onClick} whileTap={tap} {...shared}>
      {children}
    </motion.button>
  );
}
