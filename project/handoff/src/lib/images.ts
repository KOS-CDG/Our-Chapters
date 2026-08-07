interface ImageOpts {
  width?: number;
  height?: number;
}

/**
 * Resolves a Cloudinary public id to a URL.
 * TODO: swap this placeholder for a real Cloudinary delivery URL once the account is wired up, e.g.:
 *   return `https://res.cloudinary.com/<cloud-name>/image/upload/w_${width},h_${height},c_fill,g_auto/${publicId}`;
 * Every caller already passes `cloudinaryPublicId` through this single function, so that's the only line that needs to change.
 */
export function getImageUrl(publicId: string, { width = 800, height = 800 }: ImageOpts = {}): string {
  const seed = encodeURIComponent(publicId);
  return `https://picsum.photos/seed/${seed}/${width}/${height}`;
}
