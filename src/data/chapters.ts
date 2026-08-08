import type { Chapter, ChapterSummary } from "../types/chapter";

/**
 * The footage, in the order it was shot.
 *
 * Every clip in `public/videos/` is numbered, and the numbers are the story's
 * running order — so the reader walks 1 → 35 straight through, and a chapter is
 * just a slice of that run. Reordering the story, or moving a clip from one
 * chapter to the next, is an edit to this map and nothing else.
 *
 * `34.mp4` is not in the repo yet. When it lands, drop 34 into
 * "meeting-the-friends" after 28 and it flows through everywhere.
 */
const chapterClips: Record<string, number[]> = {
  "how-we-met": [1, 2, 3, 4, 5, 6, 7],
  "the-first-text": [8, 9, 10, 11, 12, 13, 14],
  "our-first-date": [15, 16, 17, 18, 19, 20, 21],
  "meeting-the-friends": [22, 23, 24, 25, 26, 27, 28],
  "right-now": [29, 30, 31, 32, 33, 35],
};

/**
 * The clips are 9:16 phone footage, which is what the reader's panel heights
 * are built around — at phone width a portrait clip fills a "full" panel almost
 * exactly. `35.mp4` is the exception, shot landscape at 1280x720: in a "full"
 * box `object-cover` would throw away about two thirds of the frame, so it gets
 * a shorter panel where it only loses the edges.
 */
const LANDSCAPE_CLIPS = new Set([35]);

/**
 * Panels carry no captions yet — deliberately. The words for this footage
 * haven't been written, and invented ones would read as filler under real
 * memories. "photo" is the one variant that renders no figcaption, so a clip
 * plays clean; switch a panel to "narration", "photo-caption", "speech-bubble"
 * or "thought-bubble" and add `caption` when the writing exists.
 */
function videoPanels(slug: string, title: string): Chapter["panels"] {
  return (chapterClips[slug] ?? []).map((n) => ({
    id: `${slug}-clip-${n}`,
    cloudinaryPublicId: `/videos/${n}.mp4`,
    mediaType: "video",
    alt: `Clip ${n} from "${title}"`,
    size: LANDSCAPE_CLIPS.has(n) ? "small" : "full",
    variant: "photo",
  }));
}

/** A chapter with no footage yet still needs something to open. */
function comingSoonPanel(slug: string): Chapter["panels"] {
  return [
    {
      id: `${slug}-coming-soon`,
      cloudinaryPublicId: `her-and-us/${slug}/coming-soon`,
      alt: "This chapter hasn't been written yet",
      caption: "To be continued... this page turns the same day our story does.",
      size: "full",
      variant: "narration",
    },
  ];
}

/** The chapter's own opening clip is its thumbnail — no separate cover art to
 *  keep in sync, and the list page previews the real footage. */
function coverOf(slug: string): Pick<Chapter, "coverImagePublicId" | "coverMediaType"> {
  const first = chapterClips[slug]?.[0];
  return first === undefined
    ? { coverImagePublicId: `her-and-us/${slug}/cover` }
    : { coverImagePublicId: `/videos/${first}.mp4`, coverMediaType: "video" };
}

const chapterMeta: Omit<Chapter, "panels" | "coverImagePublicId" | "coverMediaType">[] = [
  {
    id: "chapter-1",
    number: 1,
    slug: "how-we-met",
    title: "How We Met",
    teaser: "A rainy afternoon, a wrong coffee order, and no regrets.",
    publishedAt: "2026-06-01",
  },
  {
    id: "chapter-2",
    number: 2,
    slug: "the-first-text",
    title: "The First Text",
    teaser: "37 drafts later, I finally hit send.",
    publishedAt: "2026-06-08",
  },
  {
    id: "chapter-3",
    number: 3,
    slug: "our-first-date",
    title: "Our First Date",
    teaser: "Neither of us admits who was more nervous.",
    publishedAt: "2026-06-15",
  },
  {
    id: "chapter-4",
    number: 4,
    slug: "meeting-the-friends",
    title: "Meeting the Friends",
    teaser: "The unofficial background check begins.",
    publishedAt: "2026-06-22",
  },
  {
    id: "chapter-5",
    number: 5,
    slug: "right-now",
    title: "Right Now",
    teaser: "Still turning the page, one chapter at a time.",
    publishedAt: "2026-06-29",
  },
];

export const chapters: Chapter[] = chapterMeta.map((meta) => {
  const panels = videoPanels(meta.slug, meta.title);
  return {
    ...meta,
    ...coverOf(meta.slug),
    panels: panels.length > 0 ? panels : comingSoonPanel(meta.slug),
  };
});

export const chapterSummaries: ChapterSummary[] = chapters.map(({ panels: _panels, ...summary }) => summary);

export function getChapterBySlug(slug: string): Chapter | undefined {
  return chapters.find((c) => c.slug === slug);
}

export function getNextChapter(currentNumber: number): ChapterSummary | undefined {
  return chapterSummaries.find((c) => c.number === currentNumber + 1);
}
