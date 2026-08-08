import { useReducedMotion } from "framer-motion";
import type { Transition, Variants } from "framer-motion";

/* ── primitives ─────────────────────────────────────────────────────────── */

/** The one easing curve. Editorial motion settles; it doesn't overshoot. */
export const EASE_OUT_SOFT = [0.22, 0.61, 0.36, 1] as const;

export const DUR = { fast: 0.18, base: 0.3, slow: 0.6, hero: 0.9 } as const;

export const SPRING_UI: Transition = { type: "spring", stiffness: 420, damping: 34, mass: 0.9 };

export const STATIC: Transition = { duration: 0 };

/* ── gesture targets ────────────────────────────────────────────────────── */

export const tapPress = { scale: 0.98 } as const;
export const hoverLift = { y: -2 } as const;
export const hoverNudge = { x: -2 } as const;

/* ── variants ───────────────────────────────────────────────────────────── */

export const listContainer: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

export const listItem: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: DUR.slow, ease: EASE_OUT_SOFT } },
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: DUR.slow, ease: EASE_OUT_SOFT } },
};

/* ── the reduced-motion gate ────────────────────────────────────────────── */

/**
 * Single source of truth for "should this move?".
 *
 * Pairs with the `prefers-reduced-motion` block in index.css: that one catches
 * CSS keyframes and transitions, this one catches Framer, which drives its
 * animations off the main thread where the media query can't reach.
 */
export function useMotionPrefs() {
  const reduced = useReducedMotion() ?? false;

  return {
    reduced,

    /** Scroll reveal. Reduced users get the element already in place —
     *  never mid-animation, which is how panels end up stuck invisible. */
    reveal: (distance = 20) =>
      reduced
        ? { initial: { opacity: 1, y: 0 } }
        : {
            initial: { opacity: 0, y: distance },
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true, amount: 0.2 },
            transition: { duration: DUR.hero, ease: EASE_OUT_SOFT },
          },

    /** Entrance for a whole page or list. */
    enter: reduced
      ? { initial: false as const }
      : { initial: "hidden" as const, animate: "show" as const },

    hover: reduced ? undefined : hoverLift,
    tap: reduced ? undefined : tapPress,
    spring: reduced ? STATIC : SPRING_UI,
  };
}
