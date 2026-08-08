/** Binds the LAYER 2 semantic roles in src/styles/tokens.css to utility names.
 *  No hue literals live here — a palette change edits tokens.css only.
 *  @type {import('tailwindcss').Config} */

/** rgb(var(--x) / <alpha-value>) so `bg-surface/80` and `text-accent/70` work. */
const c = (v) => `rgb(var(${v}) / <alpha-value>)`;

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        surface: c("--surface"),
        raised: c("--surface-raised"),
        sunken: c("--surface-sunken"),
        scrim: c("--scrim"),
        ink: c("--ink"),
        "ink-muted": c("--ink-muted"),
        "ink-faint": c("--ink-faint"),
        "ink-on-accent": c("--ink-on-accent"),
        accent: c("--accent"),
        "accent-strong": c("--accent-strong"),
        "accent-tint": c("--accent-tint"),
        line: c("--line"),
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
        mono: ["var(--font-mono)"],
      },
      fontSize: {
        step0: "var(--step-0)",
        step1: "var(--step-1)",
        step2: "var(--step-2)",
        step3: "var(--step-3)",
        step4: "var(--step-4)",
        meta: "var(--step--1)",
      },
      borderRadius: {
        sm: "var(--r-sm)",
        md: "var(--r-md)",
        lg: "var(--r-lg)",
        full: "var(--r-full)",
      },
      boxShadow: {
        soft: "var(--shadow-soft)",
        lift: "var(--shadow-lift)",
      },
      maxWidth: {
        list: "var(--measure-list)",
        reader: "var(--measure-reader)",
      },
      transitionTimingFunction: {
        soft: "var(--ease-out-soft)",
      },
      transitionDuration: {
        fast: "var(--dur-fast)",
        base: "var(--dur-base)",
        slow: "var(--dur-slow)",
      },
    },
  },
  plugins: [],
};
