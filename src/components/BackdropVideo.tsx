import { useMotionPrefs } from "../lib/motion";

const POSTER = "/videos/cover-poster.jpg";

/** True when the browser reports a metered/slow connection. Non-standard API,
 *  absent in Safari — absence means "no signal", so we let the video play. */
function prefersLessData(): boolean {
  if (typeof navigator === "undefined") return false;
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
  if (!conn) return false;
  return conn.saveData === true || /(^|-)2g$/.test(conn.effectiveType ?? "");
}

/**
 * The collage video that heads the cover page. Fills its nearest positioned
 * ancestor, so the caller decides how tall the band is.
 *
 * It's 6.4 MB, so it is deliberately mounted on the cover only — the chapter
 * list and reader are long-scroll pages where it was least visible, kept
 * decoding while you scrolled, and delayed first paint over cellular.
 *
 * Falls back to the poster still for reduced-motion and data-saver users, who
 * then download no video bytes at all.
 */
export function BackdropVideo() {
  const { reduced } = useMotionPrefs();
  const still = reduced || prefersLessData();

  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden bg-sunken">
      {still ? (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${POSTER})` }}
        />
      ) : (
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster={POSTER}
          className="absolute left-1/2 top-1/2 h-auto min-h-full w-auto min-w-full -translate-x-1/2 -translate-y-1/2 object-cover"
        >
          <source src="/videos/birthday-vertical.mp4" type="video/mp4" />
        </video>
      )}
    </div>
  );
}
