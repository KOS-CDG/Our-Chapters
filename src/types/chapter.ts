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
