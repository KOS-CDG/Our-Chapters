import { useEffect, useRef, useState } from "react";

/** Reveals once when the element first scrolls into view, then stops observing. */
export function useInViewOnce<T extends Element>(options?: IntersectionObserverInit) {
  const ref = useRef<T | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || revealed) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setRevealed(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -60px 0px", ...options }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [revealed, options]);

  return { ref, revealed };
}
