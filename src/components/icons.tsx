import type { CSSProperties } from "react";

interface IconProps {
  size?: number;
  /** Defaults to `currentColor` so icons inherit the parent's text colour —
   *  pass this only to override. */
  color?: string;
}

export function HeartIcon({ size = 20, color = "currentColor", filled = true }: IconProps & { filled?: boolean }) {
  const path =
    "M12 21s-7.5-4.6-10-9.3C.5 8.5 2 5 5.5 5c2 0 3.4 1.1 4.2 2.4.8-1.3 2.2-2.4 4.2-2.4 3.5 0 5 3.5 3.5 6.7C19.5 16.4 12 21 12 21z";
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill={filled ? color : "none"} stroke={filled ? "none" : color} strokeWidth={filled ? 0 : 2.2}>
      <path d={path} />
    </svg>
  );
}

export function StarIcon({ size = 20, color = "currentColor" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill={color}>
      <path d="M12 2l2.7 6.6 7.1.6-5.4 4.6 1.7 6.9L12 17.3 5.9 20.7l1.7-6.9L2.2 9.2l7.1-.6L12 2z" />
    </svg>
  );
}

export function BowIcon({ size = 24, color = "currentColor" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size * 0.73} fill={color}>
      <path d="M12 12 L2 6 L2 18 Z" />
      <path d="M12 12 L22 6 L22 18 Z" />
      <circle cx="12" cy="12" r="2.8" />
    </svg>
  );
}

export function SparkleIcon({ size = 20, color = "currentColor" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill={color}>
      <path d="M12 2 L14 10 L22 12 L14 14 L12 22 L10 14 L2 12 L10 10 Z" />
    </svg>
  );
}

export function PawPrintIcon({ size = 20, color = "currentColor" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill={color}>
      <ellipse cx="12" cy="16" rx="6" ry="5" />
      <circle cx="5" cy="9" r="2.6" />
      <circle cx="10" cy="6" r="2.6" />
      <circle cx="15" cy="6" r="2.6" />
      <circle cx="19.5" cy="9" r="2.6" />
    </svg>
  );
}

export function ChevronLeftIcon({ size = 16, color = "currentColor" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 19l-7-7 7-7" />
    </svg>
  );
}

export function SpeakerIcon({ size = 20, color = "currentColor", muted = false }: IconProps & { muted?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18V6l10-2v12" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="16" cy="16" r="3" />
      {muted && <line x1="3" y1="3" x2="21" y2="21" />}
    </svg>
  );
}

/** Dispatches to the right icon for a Panel sticker's `type`.
 *  Stickers are the one place each glyph carries its own colour rather than
 *  inheriting, so the tints are named here instead of at the call site. */
export function StickerIcon({ type, size = 28 }: { type: "heart" | "star" | "bow" | "sparkle" } & IconProps) {
  switch (type) {
    case "heart":
      return <HeartIcon size={size} color="#E8536B" />;
    case "star":
      return <StarIcon size={size} color="#E8536B" />;
    case "bow":
      return <BowIcon size={size} color="#FF9FC0" />;
    case "sparkle":
      return <SparkleIcon size={size} color="#BEE7F7" />;
  }
}

export const dropShadowStyle: CSSProperties = { filter: "drop-shadow(0 3px 5px rgba(232,83,107,.3))" };
