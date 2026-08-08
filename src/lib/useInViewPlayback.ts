import { useEffect, useRef, useState } from "react";

/**
 * Drives lazy loading and play/pause for media that should only run while it is
 * on screen.
 *
 * A chapter is seven autoplaying clips stacked in one column. Left to the
 * browser, all seven download and decode on first paint — chapter five alone is
 * ~9.6 MB — which is exactly the phone-over-cellular case this site exists for.
 *
 * Two flags, because loading and playing want different lifetimes:
 *   - `entered` latches the first time the element comes near the viewport. Gate
 *     the <source> on it, and never ungate: tearing a source back out mid-scroll
 *     makes the element drop its decoded frames and refetch on the way back up.
 *   - `active` tracks intersection in both directions. Gate play()/pause() on it
 *     so off-screen clips stop costing decode time.
 *
 * Returns both as `true` when disabled or when IntersectionObserver is missing,
 * so the caller degrades to plain eager autoplay rather than to a dead frame.
 */
export function useInViewPlayback<T extends Element>(enabled = true) {
  const ref = useRef<T | null>(null);
  const [active, setActive] = useState(!enabled);
  const [entered, setEntered] = useState(!enabled);

  useEffect(() => {
    if (!enabled) {
      setActive(true);
      setEntered(true);
      return;
    }

    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setActive(true);
      setEntered(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setActive(entry.isIntersecting);
        if (entry.isIntersecting) setEntered(true);
      },
      // Start fetching a screenful early so a clip is ready by the time it
      // arrives, rather than showing a blank box and buffering in view.
      { rootMargin: "200px 0px", threshold: 0 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [enabled]);

  return { ref, active, entered };
}
