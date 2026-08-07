/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        pink50: "#FFE7F0",
        pink100: "#FFD3E4",
        pink300: "#FF9FC0",
        cherry500: "#E8536B",
        babyBlue200: "#BEE7F7",
        inkPlum: "#5C3A46",
        plumLight: "#8A5D6B",
      },
      fontFamily: {
        display: ["'Baloo 2'", "sans-serif"],
        body: ["'Nunito'", "sans-serif"],
      },
    },
  },
  plugins: [],
};
