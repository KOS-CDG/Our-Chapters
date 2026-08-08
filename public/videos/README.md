# The clips

The numbered clips in this folder (`1.mp4` … `35.mp4`) are the story's footage,
and **the numbers are the running order** — the reader walks them 1 → 35 and a
chapter is just a slice of that run.

`34.mp4` is missing. The folder holds 34 clips: 1–33, then 35.

`birthday-vertical.mp4` and `cover-poster.jpg` are separate — they're the cover
page masthead, not part of the numbered run.

## Adding or moving a clip

Everything is driven by one map at the top of `src/data/chapters.ts`:

```ts
const chapterClips: Record<string, number[]> = {
  "how-we-met":          [1, 2, 3, 4, 5, 6, 7],
  "the-first-text":      [8, 9, 10, 11, 12, 13, 14],
  "our-first-date":      [15, 16, 17, 18, 19, 20, 21],
  "meeting-the-friends": [22, 23, 24, 25, 26, 27, 28],
  "right-now":           [29, 30, 31, 32, 33, 35],
};
```

Copy the file in here, add its number to a chapter, save. That's the whole
step — panels, the chapter list thumbnail (each chapter previews its own first
clip) and the cover plates all derive from that map. No rebuild, no account, no
Cloudinary setup.

Clips play muted, looped, and without controls, and are **not fetched until
they scroll near the viewport** — see `src/lib/useInViewPlayback.ts`. They pause
again once they leave. This is what keeps a seven-clip chapter from starting
seven downloads at once on a phone.

## Format

- **Portrait 9:16** is the shape the reader is built around — at phone width a
  portrait clip fills a `size: "full"` panel almost exactly. `35.mp4` is the one
  landscape clip and is given a shorter panel in `chapters.ts` so `object-cover`
  doesn't throw away most of the frame; any new landscape clip needs the same.
- **H.264/`avc1` in an `.mp4`**, which is what every phone records and every
  browser plays.
- **Keep them small.** The current 34 clips total ~21 MB, but that average hides
  `35.mp4`, which is **6.8 MB for 15 seconds** — roughly ten times the rest and a
  third of the whole folder. It's worth re-encoding down to the ~250 KB the other
  clips manage.

## Optional: a poster still

Panels don't need one. Reduced-motion and data-saver visitors get the clip's own
first frame from a paused `<video>`, so nothing has to be generated up front.

If frame one of some clip is a poor still (a black fade-in, a blurred pan), drop
a JPEG into `public/photos/` and point that panel at it:

```ts
posterPublicId: "/photos/ch1-panel-01-poster.jpg",
```

## Adding captions

Panels currently render clean, with no text over the footage — `variant: "photo"`
is the one treatment with no `figcaption`. When the writing exists, change a
panel's `variant` to `narration`, `photo-caption`, `speech-bubble` or
`thought-bubble` and give it a `caption`. Captions, bubbles, stickers and the
like button all overlay a clip exactly as they do a photo.
