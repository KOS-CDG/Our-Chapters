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
  /** e.g. "her-and-us/chapter-01/panel-03" — resolved via src/lib/cloudinary.ts */
  cloudinaryPublicId: string;
  alt: string;
  caption?: string;
  /**
   * Drives panel height/pacing in the reader (all panels render full-width —
   * "size" no longer varies panel width, only how tall a beat reads).
   */
  size: PanelSize;
  variant: PanelVariant;
  /**
   * Legacy field from the original taped-photo prototype. The reader now
   * renders every panel full-bleed/edge-to-edge for a true manhwa strip, so
   * rotation is no longer applied visually — kept only for data compatibility.
   */
  rotation?: number;
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
