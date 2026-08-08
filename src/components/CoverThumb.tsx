import { useEffect } from "react";
import { useMotionPrefs } from "../lib/motion";
import { usePlaceholderRefresh } from "../lib/usePlaceholderRefresh";
import { useInViewPlayback } from "../lib/useInViewPlayback";
import { getCloudinaryUrl } from "../lib/cloudinary";

/** True when the browser reports a metered/slow connection. Non-standard API,
 *  absent in Safari — absence means "no signal", so we let the video play.
 *  Same check as Panel and BackdropVideo, so all three agree. */
function prefersLessData(): boolean {
  if (typeof navigator === "undefined") return false;
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
  if (!conn) return false;
  return conn.saveData === true || /(^|-)2g$/.test(conn.effectiveType ?? "");
}

export interface CoverThumbProps {
  /** A Cloudinary id, or a local path like "/videos/1.mp4" for a clip. */
  publicId: string;
  /** "photo" when omitted. */
  mediaType?: "photo" | "video";
  /** Sizing/cropping stays with the caller — this component owns the box's
   *  contents, never its shape. */
  className?: string;
  width?: number;
  height?: number;
}

/**
 * The chapter thumbnail shared by the list rows and the cover page's preview
 * plates: a still for photo chapters, a silent loop for video ones.
 *
 * Decorative in both places — the chapter title next to it is the real label —
 * so it stays out of the accessibility tree rather than repeating that title.
 *
 * Five looping thumbnails on the chapter list would otherwise all fetch at
 * once, so playback is gated on visibility exactly like the reader's panels.
 */
export function CoverThumb({ publicId, mediaType, className, width = 320, height = 400 }: CoverThumbProps) {
  const { reduced } = useMotionPrefs();
  usePlaceholderRefresh();

  const isVideo = mediaType === "video";
  const showStillInstead = isVideo && (reduced || prefersLessData());
  const isPlayingVideo = isVideo && !showStillInstead;
  const url = getCloudinaryUrl(publicId, { width, height });

  const { ref: videoRef, active, entered } = useInViewPlayback<HTMLVideoElement>(isPlayingVideo);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isPlayingVideo || !entered) return;

    if (active) {
      void video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [videoRef, isPlayingVideo, entered, active]);

  if (isPlayingVideo) {
    return (
      <video
        ref={videoRef}
        loop
        muted
        playsInline
        aria-hidden="true"
        preload={active ? "auto" : "none"}
        className={className}
      >
        {entered && <source src={url} type="video/mp4" />}
      </video>
    );
  }

  if (showStillInstead) {
    // A paused clip is the still — see the same fallback in Panel.tsx.
    return (
      <video preload="metadata" aria-hidden="true" className={className}>
        <source src={`${url}#t=0.1`} type="video/mp4" />
      </video>
    );
  }

  return <img src={url} alt="" loading="lazy" decoding="async" className={className} />;
}
