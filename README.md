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
  types/chapter.ts            Panel, Chapter, ChapterSummary
  data/chapters.ts            Chapter list + the "How We Met" example chapter's panels
  lib/cloudinary.ts           getCloudinaryUrl() / getPanelSrcSet() — every image goes through here
  lib/monthsary.ts            date maths for the cover counter + useMonthsary()
  lib/motion.ts               shared variants, easings, and the reduced-motion gate
  lib/usePlaceholderRefresh.ts
  styles/tokens.css           the design tokens — see below
  components/                 Shell, BackdropVideo, ChapterCard, ChapterListStates,
                              Panel, LikeButton, PenguinWidget, icons
  components/ui/              CtaButton, IconButton
  pages/                      CoverPage, ChapterListPage, ChapterReaderPage
  App.tsx                     react-router-dom routes: / , /chapters , /chapters/:slug
```

## Design tokens

`src/styles/tokens.css` is the single source of truth, in three layers:

1. **Palette** — the only place a hue literal lives. Channels are space-separated
   so Tailwind's `<alpha-value>` works (`bg-surface/80`).
2. **Semantic roles** — `--surface`, `--ink`, `--accent`, `--line`, plus the
   radius / shadow / type / duration / measure / safe-area scales. This is what
   components reference.
3. `tailwind.config.js` binds those roles to utility names.

**To change the palette, edit layer 1 and nothing else.** A dark mode would
override layer 2 with no component edits. The one place this doesn't reach is
the placeholder artwork in `lib/cloudinary.ts`, whose colours are literals
inside an SVG data URL — CSS variables can't cross into a data URL.

Motion lives in `src/lib/motion.ts`. Use `useMotionPrefs()` rather than raw
Framer transitions; it is what makes `prefers-reduced-motion` work, alongside
the CSS guard in `index.css`.

## Adding a real chapter

**Fastest path (no account needed):** drop the image file into `public/photos/`
(see [`public/photos/README.md`](public/photos/README.md)) and reference it
as `cloudinaryPublicId: "/photos/your-file.jpg"` in a panel — any value
starting with `/`, `http://`, `https://`, or `data:` is used directly, no
Cloudinary setup required. This is the recommended way to get real photos in
quickly.

1. Get the photo into the app — either drop it in `public/photos/` (above) or upload to Cloudinary under a `her-and-us/chapter-0N/...` prefix and set up `VITE_CLOUDINARY_CLOUD_NAME`.
2. Add/edit an entry in `src/data/chapters.ts` — chapter metadata plus a `panels` array (`size` controls panel height/pacing, `variant` picks the caption/bubble/narration treatment, `stickers` are optional corner decorations).
3. That's it — routing, the reader strip, and the chapter list all derive from that one file.

## Dev-only tools

The Frame Inspector (tap-a-panel-to-upload-a-test-photo modal) and the Frame
Mode toggle (white-placeholder vs. sample-photo switch) only render when
running `npm run dev` (`import.meta.env.DEV`). A production build
(`npm run build` / `npm run preview`, and whatever you deploy) never shows
them — the person opening the real link only ever sees the story.

## Design history

This app was implemented from a Claude Design handoff bundle. The original prototypes, design-token reference, and the chat transcript where the design decisions were made are preserved for reference:

- [`chats/chat1.md`](chats/chat1.md) — the design conversation
- [`project/`](project/) — the exported `.dc.html` prototypes and the first-pass data-driven React refactor

Note: the reader in this app deviates from those prototypes in one deliberate way — the original design used rotated, floating "taped-photo" cards with gaps between panels; this build renders every panel full-bleed edge-to-edge with no gaps, per a later request to match a true manhwa-reading feel.

### The editorial redesign

The site was later redesigned away from its original bubbly-cute idiom (hot
pink `#E8536B`, Baloo 2 at weight 800, sticker drop-shadows, dashed badges,
rotated pills, infinitely breathing buttons) into a quiet editorial one: warm
paper, a single restrained rose accent, Fraunces for display, Inter for body,
IBM Plex Mono for metadata, and hairlines instead of glow.

The bone structure was kept exactly — cover → chapter directory → zero-gap
panel reader, plus Haru. What changed alongside the styling:

- **A live monthsary counter on the cover**, computed from 9 December 2023.
- **The collage video is cover-only.** It was mounted globally, so the
  directory and the reader each pulled 6.4 MB before they could paint. It now
  heads the cover as a masthead band with a poster frame, and reduced-motion
  and data-saver visitors get the still instead.
- **The chapter list became an index**, not a stack of cards.
- Fixes found along the way: the cover had no link to the directory; likes
  didn't survive navigation; the last chapter rendered a "Next Chapter" button
  that did nothing; and both audio toggles were decorative, so they were
  removed (there are no audio assets — wiring real music would mean adding an
  `.mp3` and one shared `<audio>` element).
