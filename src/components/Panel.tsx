import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useMotionPrefs } from "../lib/motion";
import { usePlaceholderRefresh } from "../lib/usePlaceholderRefresh";
import { useInViewPlayback } from "../lib/useInViewPlayback";
import { getCloudinaryUrl, getPanelSrcSet } from "../lib/cloudinary";
import { StickerIcon } from "./icons";
import { LikeButton } from "./LikeButton";
import { FrameInspectorModal } from "./FrameInspectorModal";
import type { Panel as PanelData } from "../types/chapter";

/** True when the browser reports a metered/slow connection. Non-standard API,
 *  absent in Safari — absence means "no signal", so we let the video play.
 *  Mirrors BackdropVideo's check so panel video and the cover video agree. */
function prefersLessData(): boolean {
  if (typeof navigator === "undefined") return false;
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
  if (!conn) return false;
  return conn.saveData === true || /(^|-)2g$/.test(conn.effectiveType ?? "");
}

// Dev-only: tap a panel to open the photo-swap tool while building the site.
// Never shown in the production build a partner would open.
const DEV_TOOLS_ENABLED = import.meta.env.DEV;

// Every panel is full-bleed/edge-to-edge — "size" controls pacing
const HEIGHT_BY_SIZE: Record<PanelData["size"], string> = {
  full: "clamp(420px, 72vh, 680px)",
  large: "clamp(340px, 58vh, 560px)",
  medium: "clamp(300px, 48vh, 460px)",
  small: "clamp(240px, 38vh, 360px)",
};

function Stickers({ stickers }: { stickers?: PanelData["stickers"] }) {
  if (!stickers?.length) return null;
  return (
    <div aria-hidden="true">
      {stickers.map((s, i) => (
        <div key={i} style={{ position: "absolute", top: s.top, left: s.left, zIndex: 4 }}>
          <StickerIcon type={s.type} size={22} />
        </div>
      ))}
    </div>
  );
}

export interface PanelProps {
  panel: PanelData;
  /** Position within the chapter — used to alternate narration top/bottom for
   *  rhythm, and to load the first panel eagerly. */
  index: number;
}

export function Panel({ panel, index }: PanelProps) {
  const { reveal, reduced } = useMotionPrefs();
  const [inspecting, setInspecting] = useState(false);
  usePlaceholderRefresh();

  const height = HEIGHT_BY_SIZE[panel.size];
  const isFullBleed = panel.size === "full";
  const isVideo = panel.mediaType === "video";
  const showStillInstead = isVideo && (reduced || prefersLessData());
  const isPlayingVideo = isVideo && !showStillInstead;
  const imageUrl = getCloudinaryUrl(panel.cloudinaryPublicId, { width: 1080, height: 1200 });
  const srcSet = getPanelSrcSet(panel.cloudinaryPublicId, { height: 1200 });
  const posterUrl = panel.posterPublicId
    ? getCloudinaryUrl(panel.posterPublicId, { width: 1080, height: 1200 })
    : undefined;
  const narrationAtBottom = panel.variant === "narration" ? index % 2 === 0 : false;

  // A chapter is seven clips in one column; only the ones on screen should be
  // downloading and decoding. See lib/useInViewPlayback.ts.
  const { ref: videoRef, active, entered } = useInViewPlayback<HTMLVideoElement>(isPlayingVideo);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isPlayingVideo || !entered) return;

    if (active) {
      // Autoplay is refused outright on some mobile browsers, and interrupted
      // whenever pause() lands mid-play. Neither is worth an unhandled rejection.
      void video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [videoRef, isPlayingVideo, entered, active]);

  return (
    <>
      <motion.figure
        {...reveal(isFullBleed ? 36 : 22)}
        className="relative m-0 block w-full p-0 leading-[0]"
      >
        <div className="relative w-full overflow-hidden">
          {isPlayingVideo ? (
            /* No autoPlay attribute — playback is driven by the effect above so
               off-screen clips neither download nor decode. The <source> is
               withheld until the panel has come near the viewport once, then
               kept forever: pulling it back out would drop decoded frames and
               refetch the clip on the way back up. */
            <video
              ref={videoRef}
              loop
              muted
              playsInline
              preload={active ? "auto" : "none"}
              poster={posterUrl}
              aria-label={panel.alt}
              className="m-0 block w-full border-none object-cover p-0"
              style={{ height }}
            >
              {entered && <source src={imageUrl} type="video/mp4" />}
            </video>
          ) : showStillInstead ? (
            /* Reduced-motion and data-saver users get a still. A paused <video>
               is that still: it paints frame one from the metadata alone, so it
               needs no poster file on disk and pulls barely any bytes. The
               #t=0.1 fragment is for browsers that won't paint until seeked. */
            <video
              preload="metadata"
              poster={posterUrl}
              aria-label={panel.alt}
              className="m-0 block w-full border-none object-cover p-0"
              style={{ height }}
            >
              <source src={`${imageUrl}#t=0.1`} type="video/mp4" />
            </video>
          ) : (
            <img
              src={imageUrl}
              srcSet={srcSet}
              sizes="100vw"
              alt={panel.alt}
              loading={index === 0 ? "eager" : "lazy"}
              decoding="async"
              fetchPriority={index === 0 ? "high" : undefined}
              className="m-0 block w-full border-none object-cover p-0"
              style={{ height }}
            />
          )}

          {/* The story text. pointer-events:none so it never blocks the image,
              but never aria-hidden — this is the writing, not decoration. */}
          <div className="pointer-events-none absolute inset-0 z-10">
            <Stickers stickers={panel.stickers} />

            {panel.variant === "narration" && panel.caption && (
              <figcaption
                className={[
                  "absolute inset-x-0 px-7 font-display text-step1 font-normal italic",
                  "leading-relaxed text-white",
                  narrationAtBottom
                    ? "bottom-0 bg-gradient-to-b from-transparent to-scrim/80 pb-6 pt-9"
                    : "top-0 bg-gradient-to-t from-transparent to-scrim/80 pb-9 pt-6",
                ].join(" ")}
              >
                {panel.caption}
              </figcaption>
            )}

            {panel.variant === "photo-caption" && panel.caption && (
              <figcaption
                className="absolute inset-x-0 bottom-0 bg-gradient-to-b from-transparent
                           via-surface/80 to-surface px-6 pb-5 pt-12 font-display text-step0
                           font-normal italic leading-snug text-ink"
              >
                {panel.caption}
              </figcaption>
            )}

            {panel.variant === "speech-bubble" && panel.caption && (
              <>
                <figcaption
                  className="absolute left-5 top-5 z-[12] max-w-[70%] rounded-lg border border-line
                             bg-raised px-4 py-3 font-body text-meta font-medium leading-snug
                             text-ink shadow-soft"
                >
                  {panel.caption}
                </figcaption>
                <div
                  className="absolute left-[30px] top-[74px] z-[11] h-4 w-4 rotate-45 border-b
                             border-l border-line bg-raised"
                  aria-hidden="true"
                />
              </>
            )}

            {panel.variant === "thought-bubble" && panel.caption && (
              <>
                <figcaption
                  className="absolute right-5 top-5 z-[12] max-w-[72%] rounded-lg border border-line
                             bg-raised px-4 py-3 font-body text-meta font-normal italic leading-snug
                             text-ink shadow-soft"
                >
                  {panel.caption}
                </figcaption>
                <div
                  className="absolute right-[66px] top-[66px] z-[11] h-3 w-3 rounded-full border
                             border-line bg-raised"
                  aria-hidden="true"
                />
                <div
                  className="absolute right-[52px] top-[80px] z-[11] h-2 w-2 rounded-full border
                             border-line bg-raised"
                  aria-hidden="true"
                />
              </>
            )}
          </div>

          <LikeButton panelId={panel.id} overlay />

          {/* Dev-only photo swap — only wired up for photo panels; the swap tool
              works with data-URL uploads, which isn't a fit for video files.
              In production there is no click target at all either way, so the
              panel never reads as interactive. */}
          {DEV_TOOLS_ENABLED && !isVideo && (
            <button
              type="button"
              onClick={() => setInspecting(true)}
              aria-label={`Replace the photo for: ${panel.alt}`}
              className="absolute inset-0 z-[6] cursor-pointer"
            />
          )}
        </div>
      </motion.figure>

      {DEV_TOOLS_ENABLED && inspecting && (
        <FrameInspectorModal panel={panel} onClose={() => setInspecting(false)} />
      )}
    </>
  );
}
