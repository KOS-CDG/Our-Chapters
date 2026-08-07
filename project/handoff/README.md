# Her & Us — Chapter List / Reader (data-driven refactor)

Drop the `src/` contents into an existing React + TypeScript + Vite project (merge folders, no conflicts expected with a fresh app).

## What changed
Everything now renders from typed props — no hardcoded chapters/panels. See `src/types.ts` for `Panel` and `Chapter`.

- `ChapterListPage` — `{ chapters: ChapterSummary[], isLoading?, sortOrder?, onSelectChapter? }`. Empty state renders automatically when `chapters` is `[]` and `isLoading` is false.
- `ChapterReaderPage` — `{ chapter: Chapter, nextChapter?, onNextChapter? }`. Renders `chapter.panels` in order; each `Panel`'s `size` + `variant` picks its visual treatment (full-bleed narration, taped photo-caption, speech bubble, thought bubble, plain photo).

## Images
`src/lib/images.ts` resolves every `cloudinaryPublicId` through `getImageUrl()` — currently a placeholder (picsum, seeded by the id so it's stable). Swap the one line noted in that file for a real Cloudinary delivery URL when the account is ready; nothing else needs to change.

## Setup needed in your app
1. **Fonts**: add Baloo 2 + Nunito, e.g. in `index.html`:
   `<link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;700;800&family=Nunito:wght@400;600;700;800&display=swap" rel="stylesheet">`
2. **Animations CSS**: `src/styles/animations.css` holds the keyframes (`burstOut`, `heartPop`, `bounceHint`, `pressPulse`, `wiggle`, `shimmer`). Both page components already `import "./styles/animations.css"`.

## Notes on the refactor
- The like-button "already liked" / "frozen mid-burst" demo states from the prototype were presentation-only, not part of the data model — `LikeButton` is now uniformly interactive (tap → like + burst → settle) starting from `defaultLiked={false}`.
- Full-bleed narration position (top/bottom) alternates by panel index for rhythm, since `Panel` has no such field — trivial to make explicit later by adding e.g. `narrationPosition?: "top" | "bottom"` to the type if you want authors to control it directly.
- All visuals/animations are unchanged from the built prototype (`Her & Us Reader.dc.html` / `Her & Us Chapters.dc.html` in the design project).

## File map
```
src/
  types.ts                        Panel, Chapter, ChapterSummary
  lib/tokens.ts                   colors, radii, shadows, spacing, fonts
  lib/images.ts                   getImageUrl(cloudinaryPublicId)
  styles/animations.css
  hooks/useInViewOnce.ts          scroll-reveal (IntersectionObserver)
  hooks/useScrollProgress.ts      reader progress ribbon
  components/icons.tsx
  components/LikeButton.tsx
  components/ProgressRibbon.tsx
  components/MusicToggle.tsx
  components/ChapterCard.tsx
  components/ChapterListStates.tsx  ChapterCardSkeleton, EmptyState
  components/Panel.tsx
  ChapterListPage.tsx
  ChapterReaderPage.tsx
```
