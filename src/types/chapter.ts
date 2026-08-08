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
  /** Poster frame shown before a video panel plays / while it loads, and used
   *  in place of the video entirely for reduced-motion or data-saver users.
   *  Required for mediaType "video". */
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
  publishedAt: string;
  panels: Panel[];
}

/** What ChapterListPage renders — chapter metadata without the (heavier) panel array. */
export type ChapterSummary = Omit<Chapter, "panels">;
