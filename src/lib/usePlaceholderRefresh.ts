import { useEffect, useState } from "react";

/**
 * Re-renders the caller when the dev photo tooling swaps an image.
 *
 * `lib/cloudinary.ts` resolves image URLs at render time and announces changes
 * on the window rather than through React state, so components that call
 * getCloudinaryUrl() have to opt into the refresh. This was three identical
 * copies of the same effect in ChapterCard, Panel and CoverPage.
 */
export function usePlaceholderRefresh() {
  const [, setTick] = useState(0);

  useEffect(() => {
    const handleUpdate = () => setTick((t) => t + 1);
    window.addEventListener("placeholder_mode_change", handleUpdate);
    window.addEventListener("custom_photo_change", handleUpdate);
    return () => {
      window.removeEventListener("placeholder_mode_change", handleUpdate);
      window.removeEventListener("custom_photo_change", handleUpdate);
    };
  }, []);
}
