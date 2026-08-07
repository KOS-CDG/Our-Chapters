import { colors } from "../lib/tokens";

const shimmerStyle = {
  background: `linear-gradient(90deg, ${colors.pink50} 25%, ${colors.pink100} 37%, ${colors.pink50} 63%)`,
  backgroundSize: "400px 100%",
  animation: "shimmer 1.4s ease-in-out infinite",
  borderRadius: 6,
};

/** Loading placeholder for a ChapterCard row. */
export function ChapterCardSkeleton() {
  return (
    <div style={{ display: "flex", gap: 14, alignItems: "center", background: "#fff", borderRadius: 24, padding: 14, boxShadow: "0 8px 20px rgba(232,83,107,.1)", border: "1.5px solid rgba(255,159,192,.25)" }}>
      <div style={{ ...shimmerStyle, width: 72, height: 72, borderRadius: 18, flex: "none" }} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8, minWidth: 0 }}>
        <div style={{ ...shimmerStyle, width: "60%", height: 12 }} />
        <div style={{ ...shimmerStyle, width: "85%", height: 16 }} />
        <div style={{ ...shimmerStyle, width: "70%", height: 12 }} />
      </div>
    </div>
  );
}

/** Shown when the chapters list resolves empty. */
export function EmptyState() {
  return (
    <div style={{ marginTop: 48, textAlign: "center", background: "#fff", border: `2px dashed ${colors.pink300}`, borderRadius: 28, padding: "44px 28px", boxShadow: "0 8px 20px rgba(232,83,107,.1)" }}>
      <svg viewBox="0 0 64 40" width={88} height={55} style={{ margin: "0 auto 14px", display: "block" }}>
        <path d="M16 30c-8 0-14-5.5-14-12S8 6 16 6c1.6-4 6-6 12-6s10.4 2 12 6c8 0 14 5.5 14 12s-6 12-14 12H16z" fill={colors.babyBlue200} />
      </svg>
      <div style={{ fontFamily: "'Baloo 2',sans-serif", fontWeight: 700, fontSize: 20, color: colors.cherry500, marginBottom: 6 }}>No chapters yet</div>
      <div style={{ fontFamily: "'Nunito',sans-serif", fontSize: 14, color: colors.plumLight }}>check back soon!</div>
    </div>
  );
}
