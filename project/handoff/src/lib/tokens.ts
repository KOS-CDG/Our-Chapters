// Design tokens established on the cover page — reused by every component below.
export const colors = {
  pink50: "#FFE7F0",
  pink100: "#FFD3E4",
  pink300: "#FF9FC0",
  cherry500: "#E8536B",
  babyBlue200: "#BEE7F7",
  white: "#FFFFFF",
  inkPlum: "#5C3A46",
  plumLight: "#8A5D6B",
} as const;

export const radii = { xs: 10, sm: 16, md: 24, lg: 28, pill: 999 } as const;

export const shadows = {
  soft: "0 10px 26px rgba(232,83,107,0.2)",
  sticker: "0 5px 0 #E8536B, 0 10px 22px rgba(232,83,107,0.28)",
  pressed: "0 2px 0 #E8536B, 0 4px 10px rgba(232,83,107,0.25)",
} as const;

export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48, xxxl: 64 } as const;

export const fonts = {
  display: "'Baloo 2', sans-serif", // titles / headings — weights 700-800
  body: "'Nunito', sans-serif", // body / captions — weights 400-800
} as const;
