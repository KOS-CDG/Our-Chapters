# Drop real video clips here — zero setup required

Same pattern as `public/photos/`, for panels that are video instead of a
still photo.

1. Copy the clip into this folder, e.g. `public/videos/ch1-panel-01.mp4`.
   Keep clips short (a few seconds) and export at a reasonable bitrate —
   34 clips only stays "fast on her phone" if the total stays small
   (aim for well under ~1MB average per clip, like the birthday video).
2. In `src/data/chapters.ts`, on that panel:

   ```ts
   cloudinaryPublicId: "/videos/ch1-panel-01.mp4",
   mediaType: "video",
   posterPublicId: "/photos/ch1-panel-01-poster.jpg", // optional but recommended
   ```

   `posterPublicId` is a still frame shown while the video loads, and shown
   *instead* of the video entirely for reduced-motion or data-saver users
   (mirrors how the cover video already behaves) — drop that still into
   `public/photos/` the same way as any other photo.
3. Save, and it shows up immediately in `npm run dev` — no rebuild step, no
   account, no Cloudinary setup.

Panels play autoplay/muted/looped, same as the cover video — no tap needed,
no sound. Captions, speech bubbles, and stickers overlay on top exactly like
they do on photo panels.
