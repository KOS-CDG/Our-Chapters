# Her & Us

A webtoon-style, portrait-only site presenting a relationship as chapters of a love story — cover → chapter list → chapter reader, built React + TypeScript + Vite + Tailwind + Framer Motion.

The reader renders each chapter as a **true manhwa/webtoon strip**: full-width panels stacked with **zero gap** between them (no cards, no rotation, no side margins) — captions, speech/thought bubbles, stickers, and the like button are all overlaid directly on the panel image so nothing ever breaks the continuous vertical read.

## Getting started

```bash
npm install
cp .env.example .env.local   # set VITE_CLOUDINARY_CLOUD_NAME
npm run dev
```

Without a Cloudinary cloud name set, images fall back to stable seeded placeholders so the app still runs end-to-end.

## Project structure

```
src/
  types/chapter.ts      Panel, Chapter, ChapterSummary
  data/chapters.ts       Chapter list + the "How We Met" example chapter's panels
  lib/cloudinary.ts      getCloudinaryUrl() / getPanelSrcSet() — every image goes through here
  lib/tokens.ts           colors, radii, shadows, spacing, fonts
  styles/animations.css
  hooks/useScrollProgress.ts
  components/             icons, LikeButton, MusicToggle, ProgressRibbon,
                           ChapterCard, ChapterListStates, Panel, FloatingParticles
  pages/                  CoverPage, ChapterListPage, ChapterReaderPage
  App.tsx                 react-router-dom routes: / , /chapters , /chapters/:slug
```

## Adding a real chapter

1. Upload photos to Cloudinary under a `her-and-us/chapter-0N/...` prefix.
2. Add/edit an entry in `src/data/chapters.ts` — chapter metadata plus a `panels` array (`size` controls panel height/pacing, `variant` picks the caption/bubble/narration treatment, `stickers` are optional corner decorations).
3. That's it — routing, the reader strip, and the chapter list all derive from that one file.

## Design history

This app was implemented from a Claude Design handoff bundle. The original prototypes, design-token reference, and the chat transcript where the design decisions were made are preserved for reference:

- [`chats/chat1.md`](chats/chat1.md) — the design conversation
- [`project/`](project/) — the exported `.dc.html` prototypes and the first-pass data-driven React refactor

Note: the reader in this app deviates from those prototypes in one deliberate way — the original design used rotated, floating "taped-photo" cards with gaps between panels; this build renders every panel full-bleed edge-to-edge with no gaps, per a later request to match a true manhwa-reading feel.
