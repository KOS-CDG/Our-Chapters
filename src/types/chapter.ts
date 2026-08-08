export type PanelSize = "full" | "large" | "medium" | "small";

export type PanelVariant =
  | "photo"
  | "photo-caption"
  | "speech-bubble"
  | "thought-bubble"
  | "narration";

export type StickerType = "heart" | "star" | "bow" | "sparkle";

export interface PanelSticker {
  type: StickerType;
  /** CSS position values, e.g. "-14px" or "40%". */
  top: string;
  left: string;
}

export interface Panel {
  id: string;
  /** e.g. "her-and-us/chapter-01/panel-03" — resolved via src/lib/cloudinary.ts.
   *  For video panels, a local path like "/videos/ch1-panel-03.mp4" (Cloudinary
   *  transforms don't apply to video, so this is used as-is). */
  cloudinaryPublicId: string;
  /** "photo" when omitted. Video panels autoplay muted/looped like the cover
   *  video, with the same caption/bubble overlays on top. */
  mediaType?: "photo" | "video";
  /** Optional poster frame shown before a video panel plays / while it loads.
   *  Without one, reduced-motion and data-saver users get the clip's own first
   *  frame from a paused <video> instead — so this is a nicety, not a
   *  requirement, and worth adding only when frame one is a poor still. */
  posterPublicId?: string;
  alt: string;
  caption?: string;
  /**
   * Drives panel height/pacing in the reader (all panels render full-width —
   * "size" no longer varies panel width, only how tall a beat reads).
   */
  size: PanelSize;
  variant: PanelVariant;
  stickers?: PanelSticker[];
}

export interface Chapter {
  id: string;
  number: number;
  slug: string;
  title: string;
  teaser: string;
  coverImagePublicId: string;
  /** "photo" when omitted. When "video", coverImagePublicId points at a clip
   *  and the thumbnail loops it silently — same convention as Panel.mediaType. */
  coverMediaType?: "photo" | "video";
  publishedAt: string;
  panels: Panel[];
}

/** What ChapterListPage renders — chapter metadata without the (heavier) panel array. */
export type ChapterSummary = Omit<Chapter, "panels">;
