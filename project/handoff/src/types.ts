export interface Panel {
  id: string;
  cloudinaryPublicId: string; // e.g. "her-and-us/chapter-01/panel-03"
  alt: string;
  caption?: string;
  size: "full" | "large" | "medium" | "small";
  variant: "photo" | "photo-caption" | "speech-bubble" | "thought-bubble" | "narration";
  rotation?: number;
  stickers?: { type: "heart" | "star" | "bow" | "sparkle"; top: string; left: string }[];
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

// What ChapterListPage renders — chapter metadata without the (heavier) panel array.
export type ChapterSummary = Omit<Chapter, "panels">;
