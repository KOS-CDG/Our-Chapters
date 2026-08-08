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
      <stop offset="100%" stop-color="#FAFCFF"/>
    </linearGradient>
    <filter id="subtleShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="#E8536B" flood-opacity="0.08"/>
    </filter>
  </defs>

  <!-- Crisp White Background -->
  <rect width="100%" height="100%" fill="url(#bgGrad)"/>

  <!-- Subtle Dashed Inner Frame -->
  <rect x="16" y="16" width="${Math.max(w - 32, 10)}" height="${Math.max(h - 32, 10)}" fill="none" stroke="#FFD3E4" stroke-width="1.5" stroke-dasharray="8,6" rx="12"/>

  <!-- Corner Crop Framing Marks -->
  <path d="M 28 48 V 28 H 48" stroke="#E8536B" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <path d="M ${w - 48} 28 H ${w - 28} V 48" stroke="#E8536B" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <path d="M 28 ${h - 48} V ${h - 28} H 48" stroke="#E8536B" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <path d="M ${w - 48} ${h - 28} H ${w - 28} V ${h - 48}" stroke="#E8536B" stroke-width="2.5" fill="none" stroke-linecap="round"/>

  <!-- Center Artwork / Photo Frame Badge -->
  <g transform="translate(${w / 2}, ${h / 2 - (includeText && h > 240 ? 24 : 0)})" filter="url(#subtleShadow)">
    <rect x="-32" y="-24" width="64" height="48" rx="10" fill="#FFFFFF" stroke="#FF9FC0" stroke-width="2"/>
    <!-- Sun/Moon Circle -->
    <circle cx="-10" cy="-6" r="6" fill="#FFE7F0"/>
    <!-- Mountain/Landscape lines -->
    <path d="M -22 14 L -8 -2 L 4 14 Z" fill="#FFD3E4"/>
    <path d="M -4 14 L 8 4 L 20 14 Z" fill="#FF9FC0"/>
    <!-- Small heart badge -->
    <path d="M 18 -16 C 18 -20 14 -22 11 -19 C 8 -22 4 -20 4 -16 C 4 -12 11 -7 11 -7 C 11 -7 18 -12 18 -16 Z" fill="#E8536B"/>
  </g>

  <!-- Labels (Only if includeText is enabled) -->
  ${
    includeText && h > 140
      ? `<text x="50%" y="${h / 2 + 42}" font-family="system-ui, -apple-system, sans-serif" font-size="${Math.min(Math.max(w / 35, 13), 18)}" font-weight="800" fill="#5C3A46" text-anchor="middle" letter-spacing="0.5">${title}</text>
  <text x="50%" y="${h / 2 + 64}" font-family="system-ui, -apple-system, sans-serif" font-size="${Math.min(Math.max(w / 45, 11), 13)}" font-weight="600" fill="#8A5D6B" text-anchor="middle">${w} × ${h} px • White Photo Frame</text>`
      : ""
  }
</svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function samplePlaceholderUrl(publicId: string, width = 800, height = 800): string {
  const seed = encodeURIComponent(publicId);
  return `https://picsum.photos/seed/${seed}/${width}/${height}`;
}

/** Resolves a Cloudinary public id to a delivery URL, custom photo, or white placeholder SVG. */
export function getCloudinaryUrl(publicId: string, opts: CloudinaryTransformOpts = {}): string {
  const custom = getCustomPhoto(publicId);
  if (custom) return custom;

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

  if (currentMode === "white" || !CLOUD_NAME) {
    // Single crisp SVG scales perfectly at all resolution widths
    const whiteSvg = generateWhitePlaceholderSvg(publicId, opts.height ? Math.round(opts.height * 0.9) : 1080, opts.height ?? 1200);
    return `${whiteSvg} 1080w`;
  }

  return widths
    .map((w) => `${getCloudinaryUrl(publicId, { ...opts, width: w })} ${w}w`)
    .join(", ");
}

