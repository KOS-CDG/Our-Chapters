import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useMotionPrefs } from "../../lib/motion";

export interface CtaButtonProps {
  children: React.ReactNode;
  to: string;
  /** Quieter treatment for a secondary action — rule underneath, no box. */
  variant?: "solid" | "quiet";
}

/**
 * The primary call to action. Existed twice, near-identically, on the cover
 * and at the foot of the reader — including a duplicated pressed-state
 * setTimeout dance that the CSS :active state now handles.
 *
 * Text-forward by design: a hairline rectangle that fills on hover, not a
 * pill with a hard offset shadow. Always a Link, so it is keyboard-operable
 * and openable in a new tab for free.
 */
export function CtaButton({ children, to, variant = "solid" }: CtaButtonProps) {
  const { tap } = useMotionPrefs();

  const styles =
    variant === "solid"
      ? [
          "border border-ink px-9 py-4 text-ink",
          "hover:bg-ink hover:text-ink-on-accent",
        ].join(" ")
      : ["border-b border-line px-1 py-1 text-ink-muted", "hover:border-ink hover:text-ink"].join(" ");

  return (
    <motion.div whileTap={tap} className="inline-flex">
      <Link
        to={to}
        className={[
          "inline-flex items-center gap-3 rounded-sm font-mono text-meta uppercase",
          "tracking-[0.14em] transition-colors duration-base ease-soft",
          styles,
        ].join(" ")}
      >
        {children}
      </Link>
    </motion.div>
  );
}
