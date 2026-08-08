# Drop real photos here — zero setup required

No Cloudinary account needed. To use a real photo for a panel or chapter cover:

1. Copy the image file into this folder, e.g. `public/photos/ch1-panel-01.jpg`.
2. In `src/data/chapters.ts`, set that panel's (or chapter's) id field to the
   local path starting with `/photos/`:

   ```ts
   cloudinaryPublicId: "/photos/ch1-panel-01.jpg",
   ```

   (The field is still named `cloudinaryPublicId` for now, but any value
   starting with `/`, `http://`, `https://`, or `data:` is used directly as
   the image — Cloudinary is skipped entirely.)
3. Save, and it shows up immediately in `npm run dev` — no rebuild step, no
   account, no env var.

Keep photos reasonably sized (under ~2–3MB each, longest side ~2000px) so the
site stays fast to load on her phone.
