/**
 * Cloudinary delivery URL helpers & White Photo Frame Placeholder generator.
 *
 * Reads VITE_CLOUDINARY_CLOUD_NAME from the environment (see .env.example).
 * Every image in the app resolves through getCloudinaryUrl()/getPanelSrcSet()
 * so wiring up the real cloud name is the only thing that needs to change.
 *
 * When no Cloudinary cloud name is set or when White Frame Mode is enabled,
 * it renders crisp SVG white image placeholders complete with frame dimensions,
 * corner crop marks, photo icons, and panel names for visual layout testing.
 */

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string | undefined;

// In-memory & LocalStorage custom photo state (allows live uploading/testing in browser session)
const customPhotos: Record<string, string> = {};

export type PlaceholderMode = "white" | "sample";

let currentMode: PlaceholderMode = (localStorage.getItem("our_chapter_placeholder_mode") as PlaceholderMode) || "white";

export function getPlaceholderMode(): PlaceholderMode {
  return currentMode;
}

export function setPlaceholderMode(mode: PlaceholderMode): void {
  currentMode = mode;
  localStorage.setItem("our_chapter_placeholder_mode", mode);
  window.dispatchEvent(new Event("placeholder_mode_change"));
}

export function getCustomPhoto(publicId: string): string | undefined {
  return customPhotos[publicId] || localStorage.getItem(`our_chapter_photo_${publicId}`) || undefined;
}

export function setCustomPhoto(publicId: string, dataUrl: string): void {
  customPhotos[publicId] = dataUrl;
  localStorage.setItem(`our_chapter_photo_${publicId}`, dataUrl);
  window.dispatchEvent(new Event("custom_photo_change"));
}

export function clearCustomPhoto(publicId: string): void {
  delete customPhotos[publicId];
  localStorage.removeItem(`our_chapter_photo_${publicId}`);
  window.dispatchEvent(new Event("custom_photo_change"));
}

export interface CloudinaryTransformOpts {
  width?: number;
  height?: number;
  /** Cloudinary crop mode. Defaults to "fill". */
  crop?: "fill" | "fit" | "scale" | "crop" | "thumb";
  /** Cloudinary gravity. Defaults to "auto" (content-aware). */
  gravity?: "auto" | "face" | "center" | "north" | "south";
  /** DPR multiplier, e.g. 2 for @2x. */
  dpr?: number;
}

/** Formats a public ID like "her-and-us/chapter-01/panel-03" to "Panel 03" */
function formatPublicIdTitle(publicId: string): string {
  const parts = publicId.split("/");
  const last = parts[parts.length - 1] || publicId;
  return last
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Generates a clean SVG white placeholder data URL.
 * Features crisp white background, framing crop marks, photo icon,
 * dimension badge, and panel title label.
 */
export function generateWhitePlaceholderSvg(publicId: string, width = 800, height = 800, includeText = false): string {
  const title = formatPublicIdTitle(publicId);
  const w = width;
  const h = height;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="100%" stop-color="#F4EEE7"/>
    </linearGradient>
    <filter id="subtleShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="#B4636F" flood-opacity="0.08"/>
    </filter>
  </defs>

  <!-- Crisp White Background -->
  <rect width="100%" height="100%" fill="url(#bgGrad)"/>

  <!-- Subtle Dashed Inner Frame -->
  <rect x="16" y="16" width="${Math.max(w - 32, 10)}" height="${Math.max(h - 32, 10)}" fill="none" stroke="#E4DACF" stroke-width="1.5" stroke-dasharray="8,6" rx="12"/>

  <!-- Corner Crop Framing Marks -->
  <path d="M 28 48 V 28 H 48" stroke="#B4636F" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <path d="M ${w - 48} 28 H ${w - 28} V 48" stroke="#B4636F" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <path d="M 28 ${h - 48} V ${h - 28} H 48" stroke="#B4636F" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <path d="M ${w - 48} ${h - 28} H ${w - 28} V ${h - 48}" stroke="#B4636F" stroke-width="2.5" fill="none" stroke-linecap="round"/>

  <!-- Center Artwork / Photo Frame Badge -->
  <g transform="translate(${w / 2}, ${h / 2 - (includeText && h > 240 ? 24 : 0)})" filter="url(#subtleShadow)">
    <rect x="-32" y="-24" width="64" height="48" rx="10" fill="#FFFFFF" stroke="#E4DACF" stroke-width="2"/>
    <!-- Sun/Moon Circle -->
    <circle cx="-10" cy="-6" r="6" fill="#EFE0E1"/>
    <!-- Mountain/Landscape lines -->
    <path d="M -22 14 L -8 -2 L 4 14 Z" fill="#E4DACF"/>
    <path d="M -4 14 L 8 4 L 20 14 Z" fill="#C9BAA9"/>
    <!-- Small heart badge -->
    <path d="M 18 -16 C 18 -20 14 -22 11 -19 C 8 -22 4 -20 4 -16 C 4 -12 11 -7 11 -7 C 11 -7 18 -12 18 -16 Z" fill="#B4636F"/>
  </g>

  <!-- Labels (Only if includeText is enabled) -->
  ${
    includeText && h > 140
      ? `<text x="50%" y="${h / 2 + 42}" font-family="system-ui, -apple-system, sans-serif" font-size="${Math.min(Math.max(w / 35, 13), 18)}" font-weight="800" fill="#2A2320" text-anchor="middle" letter-spacing="0.5">${title}</text>
  <text x="50%" y="${h / 2 + 64}" font-family="system-ui, -apple-system, sans-serif" font-size="${Math.min(Math.max(w / 45, 11), 13)}" font-weight="600" fill="#9C8F87" text-anchor="middle">✦ a memory waiting to be added ✦</text>`
      : ""
  }
</svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function samplePlaceholderUrl(publicId: string, width = 800, height = 800): string {
  const seed = encodeURIComponent(publicId);
  return `https://picsum.photos/seed/${seed}/${width}/${height}`;
}

/**
 * True for a "public id" that's actually already a usable image reference —
 * a local file dropped in /public (e.g. "/photos/panel-01.jpg") or a full
 * URL. Lets you add real photos with zero Cloudinary account/setup: just
 * copy the file into public/photos and point a panel at it.
 */
function isDirectImageRef(publicId: string): boolean {
  return publicId.startsWith("/") || publicId.startsWith("http://") || publicId.startsWith("https://") || publicId.startsWith("data:");
}

/** Resolves a Cloudinary public id to a delivery URL, custom photo, or white placeholder SVG. */
export function getCloudinaryUrl(publicId: string, opts: CloudinaryTransformOpts = {}): string {
  const custom = getCustomPhoto(publicId);
  if (custom) return custom;

  if (isDirectImageRef(publicId)) return publicId;

  const { width = 800, height = 800, crop = "fill", gravity = "auto", dpr } = opts;

  if (currentMode === "sample" && !CLOUD_NAME) {
    return samplePlaceholderUrl(publicId, width, height);
  }

  if (currentMode === "white" || !CLOUD_NAME) {
    return generateWhitePlaceholderSvg(publicId, width, height);
  }

  const transforms = [
    "f_auto",
    "q_auto",
    crop && `c_${crop}`,
    gravity && `g_${gravity}`,
    width && `w_${width}`,
    height && `h_${height}`,
    dpr && `dpr_${dpr}`,
  ]
    .filter(Boolean)
    .join(",");

  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transforms}/${publicId}`;
}

const DEFAULT_SRCSET_WIDTHS = [480, 768, 1080, 1440, 1920];

/** Builds a `srcset` string for a Cloudinary public id across common panel widths. */
export function getPanelSrcSet(
  publicId: string,
  opts: Omit<CloudinaryTransformOpts, "width"> = {},
  widths: number[] = DEFAULT_SRCSET_WIDTHS
): string {
  const custom = getCustomPhoto(publicId);
  if (custom) return `${custom} 1080w`;

  if (isDirectImageRef(publicId)) return `${publicId} 1080w`;

  if (currentMode === "white" || !CLOUD_NAME) {
    // Single crisp SVG scales perfectly at all resolution widths
    const whiteSvg = generateWhitePlaceholderSvg(publicId, opts.height ? Math.round(opts.height * 0.9) : 1080, opts.height ?? 1200);
    return `${whiteSvg} 1080w`;
  }

  return widths
    .map((w) => `${getCloudinaryUrl(publicId, { ...opts, width: w })} ${w}w`)
    .join(", ");
}

