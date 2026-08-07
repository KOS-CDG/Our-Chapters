/**
 * Cloudinary delivery URL helpers.
 *
 * Reads VITE_CLOUDINARY_CLOUD_NAME from the environment (see .env.example).
 * Every image in the app resolves through getCloudinaryUrl()/getPanelSrcSet()
 * so wiring up the real cloud name is the only thing that needs to change —
 * no component touches image URLs directly.
 *
 * Without a cloud name set, both helpers fall back to a stable seeded
 * placeholder (picsum.photos) so the app still runs end-to-end in dev.
 */

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string | undefined;

let warned = false;
function warnMissingCloudName() {
  if (warned || import.meta.env.PROD) return;
  warned = true;
  // eslint-disable-next-line no-console
  console.warn(
    "[cloudinary] VITE_CLOUDINARY_CLOUD_NAME is not set — falling back to placeholder images. " +
      "Copy .env.example to .env.local and set your cloud name to see real images."
  );
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

function placeholderUrl(publicId: string, width = 800, height = 800): string {
  const seed = encodeURIComponent(publicId);
  return `https://picsum.photos/seed/${seed}/${width}/${height}`;
}

/** Resolves a Cloudinary public id (e.g. "her-and-us/chapter-01/panel-03") to a delivery URL. */
export function getCloudinaryUrl(publicId: string, opts: CloudinaryTransformOpts = {}): string {
  const { width, height, crop = "fill", gravity = "auto", dpr } = opts;

  if (!CLOUD_NAME) {
    warnMissingCloudName();
    return placeholderUrl(publicId, width ?? 800, height ?? 800);
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

/**
 * Builds a `srcset` string for a Cloudinary public id across common panel
 * widths, so the browser picks the right resolution for the viewport.
 */
export function getPanelSrcSet(
  publicId: string,
  opts: Omit<CloudinaryTransformOpts, "width"> = {},
  widths: number[] = DEFAULT_SRCSET_WIDTHS
): string {
  return widths
    .map((w) => `${getCloudinaryUrl(publicId, { ...opts, width: w })} ${w}w`)
    .join(", ");
}
