import type { Chapter, ChapterSummary } from "../types/chapter";

/**
 * "How We Met" — the one fully-scripted example chapter from the design
 * phase (6 panels, mixing narration/speech/thought/photo-caption beats).
 * Chapters 2-5 below carry real metadata but a placeholder single panel —
 * drop in real photos/captions the same way as chapter 1 when ready.
 */
const chapter1Panels: Chapter["panels"] = [
  {
    id: "ch1-p1",
    cloudinaryPublicId: "her-and-us/chapter-01/panel-01",
    alt: "She holding two coffees, one for each of them",
    caption: "She showed up twenty minutes late holding two coffees. Only one was for her.",
    size: "medium",
    variant: "photo-caption",
    stickers: [{ type: "heart", top: "16px", left: "82%" }],
  },
  {
    id: "ch1-p2",
    cloudinaryPublicId: "her-and-us/chapter-01/panel-02",
    alt: "The two of them lingering outside at night, not ready to say goodbye",
    caption: "It was the first time either of us didn't want the night to end.",
    size: "full",
    variant: "narration",
  },
  {
    id: "ch1-p3",
    cloudinaryPublicId: "her-and-us/chapter-01/panel-03",
    alt: "A close, candid moment mid-conversation",
    caption: '"Wait... you actually kept the receipt?"',
    size: "large",
    variant: "speech-bubble",
  },
  {
    id: "ch1-p4",
    cloudinaryPublicId: "her-and-us/chapter-01/panel-04",
    alt: "Movie night on the couch",
    caption: "Movie night rule: he always picks. I always veto.",
    size: "medium",
    variant: "photo-caption",
    stickers: [{ type: "bow", top: "16px", left: "8%" }],
  },
  {
    id: "ch1-p5",
    cloudinaryPublicId: "her-and-us/chapter-01/panel-05",
    alt: "A nervous, hopeful glance",
    caption: "Please don't be weird. Please don't be weird.",
    size: "large",
    variant: "thought-bubble",
  },
  {
    id: "ch1-p6",
    cloudinaryPublicId: "her-and-us/chapter-01/panel-06",
    alt: "The two of them laughing together, golden hour light",
    caption: "And just like that, chapter one was already my favorite.",
    size: "full",
    variant: "narration",
  },
];

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

const chapterMeta: Omit<Chapter, "panels">[] = [
  {
    id: "chapter-1",
    number: 1,
    slug: "how-we-met",
    title: "How We Met",
    teaser: "A rainy afternoon, a wrong coffee order, and no regrets.",
    coverImagePublicId: "her-and-us/chapter-01/cover",
    publishedAt: "2026-06-01",
  },
  {
    id: "chapter-2",
    number: 2,
    slug: "the-first-text",
    title: "The First Text",
    teaser: "37 drafts later, I finally hit send.",
    coverImagePublicId: "her-and-us/chapter-02/cover",
    publishedAt: "2026-06-08",
  },
  {
    id: "chapter-3",
    number: 3,
    slug: "our-first-date",
    title: "Our First Date",
    teaser: "Neither of us admits who was more nervous.",
    coverImagePublicId: "her-and-us/chapter-03/cover",
    publishedAt: "2026-06-15",
  },
  {
    id: "chapter-4",
    number: 4,
    slug: "meeting-the-friends",
    title: "Meeting the Friends",
    teaser: "The unofficial background check begins.",
    coverImagePublicId: "her-and-us/chapter-04/cover",
    publishedAt: "2026-06-22",
  },
  {
    id: "chapter-5",
    number: 5,
    slug: "right-now",
    title: "Right Now",
    teaser: "Still turning the page, one chapter at a time.",
    coverImagePublicId: "her-and-us/chapter-05/cover",
    publishedAt: "2026-06-29",
  },
];

export const chapters: Chapter[] = chapterMeta.map((meta) => ({
  ...meta,
  panels: meta.slug === "how-we-met" ? chapter1Panels : comingSoonPanel(meta.slug),
}));

export const chapterSummaries: ChapterSummary[] = chapters.map(({ panels: _panels, ...summary }) => summary);

export function getChapterBySlug(slug: string): Chapter | undefined {
  return chapters.find((c) => c.slug === slug);
}

export function getNextChapter(currentNumber: number): ChapterSummary | undefined {
  return chapterSummaries.find((c) => c.number === currentNumber + 1);
}
