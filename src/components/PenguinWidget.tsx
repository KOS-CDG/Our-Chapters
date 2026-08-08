import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { colors, fonts } from "../lib/tokens";

// ---------- Types ----------
type Theme = "sakura" | "midnight" | "mint" | "vintage" | "cotton" | "aurora";
type FontSize = "small" | "medium" | "large";
type PanelDecor = "ribbons" | "petals" | "stars" | "hearts" | "none";

// ---------- Persistent state helpers ----------
function usePersist<T>(key: string, initial: T) {
  const stored = localStorage.getItem(key);
  const [val, setVal] = useState<T>(stored !== null ? JSON.parse(stored) : initial);
  const save = (v: T) => { setVal(v); localStorage.setItem(key, JSON.stringify(v)); };
  return [val, save] as const;
}

// ---------- Snowflake / petal canvas layer ----------
function DecorCanvas({ decor }: { decor: PanelDecor }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (decor === "none") return;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    type P = { x: number; y: number; r: number; speed: number; drift: number; opacity: number; hue: number };
    const count = 40;
    const particles: P[] = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 7 + 3,
      speed: Math.random() * 0.8 + 0.3,
      drift: (Math.random() - 0.5) * 0.6,
      opacity: Math.random() * 0.5 + 0.3,
      hue: Math.random() * 40,
    }));
    let raf = 0;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.translate(p.x, p.y);
        if (decor === "hearts") {
          ctx.fillStyle = `hsl(${350 + p.hue}, 80%, 70%)`;
          ctx.beginPath();
          ctx.moveTo(0, -p.r);
          ctx.bezierCurveTo(p.r * 1.2, -p.r * 2.2, p.r * 2.8, -p.r * 0.5, 0, p.r * 1.6);
          ctx.bezierCurveTo(-p.r * 2.8, -p.r * 0.5, -p.r * 1.2, -p.r * 2.2, 0, -p.r);
          ctx.fill();
        } else if (decor === "stars") {
          ctx.fillStyle = `hsl(${40 + p.hue}, 100%, 65%)`;
          ctx.beginPath();
          for (let i = 0; i < 5; i++) {
            const a = (i * Math.PI * 4) / 5 - Math.PI / 2;
            const ia = a + Math.PI / 5;
            ctx.lineTo(Math.cos(a) * p.r, Math.sin(a) * p.r);
            ctx.lineTo(Math.cos(ia) * p.r * 0.4, Math.sin(ia) * p.r * 0.4);
          }
          ctx.closePath();
          ctx.fill();
        } else if (decor === "petals") {
          ctx.fillStyle = `hsl(${340 + p.hue}, 70%, 80%)`;
          ctx.beginPath();
          ctx.ellipse(0, 0, p.r * 0.6, p.r * 1.4, p.hue * 0.1, 0, Math.PI * 2);
          ctx.fill();
        } else if (decor === "ribbons") {
          ctx.strokeStyle = `hsl(${340 + p.hue}, 65%, 70%)`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(-p.r, -p.r);
          ctx.quadraticCurveTo(0, p.r * 2, p.r, -p.r);
          ctx.stroke();
        }
        ctx.restore();
        p.y += p.speed;
        p.x += p.drift;
        if (p.y > canvas.height + 20) { p.y = -20; p.x = Math.random() * canvas.width; }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, [decor]);
  if (decor === "none") return null;
  return (
    <canvas
      ref={canvasRef}
      style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 1, opacity: 0.55 }}
    />
  );
}

// ---------- Theme definitions ----------
const themes: Record<Theme, { name: string; bg: string; accent: string; card: string; text: string }> = {
  sakura:   { name: "Sakura",   bg: "linear-gradient(180deg,#FFE7F0 0%,#FFD3E4 55%,#FFC2DA 100%)", accent: "#E8536B", card: "rgba(255,255,255,.9)", text: "#5C3A46" },
  midnight: { name: "Midnight", bg: "linear-gradient(180deg,#1a0a1e 0%,#2d1040 50%,#1a0a1e 100%)", accent: "#e87fa0", card: "rgba(40,15,60,.85)", text: "#f8d8ea" },
  mint:     { name: "Mint",     bg: "linear-gradient(180deg,#e0f8f0 0%,#b8f0dc 55%,#d4f5e8 100%)", accent: "#2ca87a", card: "rgba(255,255,255,.9)", text: "#1a4a38" },
  vintage:  { name: "Vintage",  bg: "linear-gradient(180deg,#fdf6ec 0%,#f5e6d0 55%,#eddfc6 100%)", accent: "#c07040", card: "rgba(255,250,240,.9)", text: "#4a2c10" },
  cotton:   { name: "Cotton",   bg: "linear-gradient(180deg,#f0f8ff 0%,#e0edff 55%,#d0e4ff 100%)", accent: "#6090e8", card: "rgba(255,255,255,.9)", text: "#1a3060" },
  aurora:   { name: "Aurora",   bg: "linear-gradient(135deg,#1a0a2e 0%,#0d2a4a 30%,#0a3a3a 65%,#1a1a0a 100%)", accent: "#70ffcc", card: "rgba(10,20,40,.85)", text: "#c0ffd8" },
};

const decorLabels: Record<PanelDecor, string> = {
  none: "None", ribbons: "Ribbons", petals: "Petals", stars: "Stars", hearts: "Hearts",
};

// ---------- Bookmark feature ----------
function BookmarkToast({ msg, onDone }: { msg: string; onDone: () => void }) {
  useEffect(() => { const t = setTimeout(onDone, 2200); return () => clearTimeout(t); }, [onDone]);
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      style={{
        position: "fixed", bottom: 90, left: "50%", transform: "translateX(-50%)",
        background: "rgba(255,255,255,.96)", border: `2px solid ${colors.pink300}`,
        borderRadius: 999, padding: "10px 22px", fontFamily: fonts.body, fontWeight: 800,
        fontSize: 13, color: colors.cherry500, boxShadow: "0 8px 24px rgba(232,83,107,.2)",
        zIndex: 100, whiteSpace: "nowrap",
      }}
    >
      {msg}
    </motion.div>
  );
}

// ---------- Reading timer ----------
function useReadingTimer() {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

// ---------- Panel border style toggle ----------
type BorderStyle = "none" | "dashed" | "ribbon-tag" | "filmstrip";

// ---------- Main Widget ----------
export function PenguinWidget() {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = usePersist<Theme>("ou_theme", "sakura");
  const [fontSize, setFontSize] = usePersist<FontSize>("ou_fontsize", "medium");
  const [decor, setDecor] = usePersist<PanelDecor>("ou_decor", "none");
  const [darkBg, setDarkBg] = usePersist<boolean>("ou_darkbg", false);
  const [showTimer, setShowTimer] = usePersist<boolean>("ou_timer", true);
  const [borderStyle, setBorderStyle] = usePersist<BorderStyle>("ou_border", "none");
  const [confettiMode, setConfettiMode] = usePersist<boolean>("ou_confetti", false);
  const [stickerGlow, setStickerGlow] = usePersist<boolean>("ou_glow", false);
  const [sepia, setSepia] = usePersist<boolean>("ou_sepia", false);
  const [dreamyBlur, setDreamyBlur] = usePersist<boolean>("ou_dreamy", false);
  const [panelShadow, setPanelShadow] = usePersist<boolean>("ou_shadow", true);
  const [hideTip, setHideTip] = usePersist<boolean>("ou_hidetip", false);
  const [cozyMode, setCozyMode] = usePersist<boolean>("ou_cozy", false);
  const [, setBookmarkPage] = usePersist<number>("ou_bookmark", 0);
  const [toast, setToast] = useState<string | null>(null);
  const timer = useReadingTimer();
  const t = themes[theme];

  // Apply theme to body
  useEffect(() => {
    document.body.style.background = t.bg;
    document.body.style.color = t.text;
  }, [theme]);

  // Apply font-size
  useEffect(() => {
    const sizes: Record<FontSize, string> = { small: "13px", medium: "15px", large: "17px" };
    document.body.style.fontSize = sizes[fontSize];
  }, [fontSize]);

  // Apply filters
  useEffect(() => {
    const root = document.documentElement;
    const filters: string[] = [];
    if (sepia) filters.push("sepia(0.4)");
    if (dreamyBlur) filters.push("contrast(0.95) brightness(1.04)");
    root.style.setProperty("--panel-filter", filters.join(" ") || "none");
  }, [sepia, dreamyBlur]);

  // Apply cozy mode (warm screen tint overlay)
  useEffect(() => {
    let el = document.getElementById("cozy-overlay");
    if (!el && cozyMode) {
      el = document.createElement("div");
      el.id = "cozy-overlay";
      el.style.cssText = "position:fixed;inset:0;background:rgba(255,180,60,.06);pointer-events:none;z-index:9999;mix-blend-mode:multiply;";
      document.body.appendChild(el);
    } else if (el && !cozyMode) {
      el.remove();
    }
    return () => { document.getElementById("cozy-overlay")?.remove(); };
  }, [cozyMode]);

  // Bookmark
  const handleBookmark = () => {
    const scroll = Math.round((window.scrollY / document.documentElement.scrollHeight) * 100);
    setBookmarkPage(scroll);
    setToast("Bookmarked this spot!");
  };

  // Scroll back to top
  const scrollTop = () => { window.scrollTo({ top: 0, behavior: "smooth" }); setToast("Back to top!"); };

  // ---------- Option button helpers ----------
  const Chip = ({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) => (
    <button
      onClick={onClick}
      style={{
        background: active ? t.accent : "transparent",
        color: active ? "#fff" : t.accent,
        border: `1.5px solid ${t.accent}`,
        borderRadius: 999,
        padding: "4px 12px",
        fontFamily: fonts.body,
        fontSize: 11,
        fontWeight: 800,
        cursor: "pointer",
        transition: "all .2s",
      }}
    >
      {label}
    </button>
  );

  const Toggle = ({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) => (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 0", borderBottom: `1px solid ${t.accent}22` }}>
      <span style={{ fontFamily: fonts.body, fontSize: 12, fontWeight: 700, color: t.text }}>{label}</span>
      <button
        onClick={() => onChange(!value)}
        style={{
          width: 38, height: 20, borderRadius: 999,
          background: value ? t.accent : "#ccc",
          border: "none", cursor: "pointer", position: "relative", transition: "background .2s",
        }}
      >
        <div style={{
          position: "absolute", top: 2, left: value ? 20 : 2, width: 16, height: 16,
          borderRadius: 999, background: "#fff", transition: "left .2s",
          boxShadow: "0 1px 4px rgba(0,0,0,.2)",
        }} />
      </button>
    </div>
  );

  const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <div style={{
      fontFamily: fonts.display, fontSize: 11, fontWeight: 800, letterSpacing: "1.2px",
      textTransform: "uppercase", color: t.accent, margin: "12px 0 6px",
      display: "flex", alignItems: "center", gap: 6,
    }}>
      <svg width="10" height="10" viewBox="0 0 10 10" fill={t.accent}>
        <path d="M5 0l1.2 3.7H10L6.9 5.9 8.1 10 5 7.8 1.9 10l1.2-4.1L0 3.7h3.8z" />
      </svg>
      {children}
    </div>
  );

  return (
    <>
      <DecorCanvas decor={decor} />

      {/* Toast */}
      <AnimatePresence>
        {toast && <BookmarkToast msg={toast} onDone={() => setToast(null)} />}
      </AnimatePresence>

      {/* Reading timer */}
      <AnimatePresence>
        {showTimer && (
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            style={{
              position: "fixed", top: "50%", left: 0, transform: "translateY(-50%) rotate(-90deg)",
              transformOrigin: "left center",
              background: "rgba(255,255,255,.88)",
              border: `1.5px solid ${colors.pink300}`,
              borderRadius: "0 0 8px 8px",
              padding: "4px 12px",
              fontFamily: fonts.body,
              fontWeight: 800,
              fontSize: 11,
              color: colors.cherry500,
              zIndex: 30,
              letterSpacing: "1px",
              pointerEvents: "none",
            }}
          >
            Reading {timer}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Penguin toggle button */}
      <motion.button
        onClick={() => setOpen((o) => !o)}
        whileTap={{ scale: 0.9 }}
        animate={{ x: open ? -8 : 0 }}
        style={{
          position: "fixed",
          bottom: 80,
          right: 0,
          zIndex: 50,
          background: "transparent",
          border: "none",
          cursor: "pointer",
          padding: 0,
          display: "flex",
          alignItems: "center",
          gap: 0,
          filter: "drop-shadow(0 4px 8px rgba(232,83,107,.3))",
        }}
        aria-label="Open design options"
      >
        {/* Peek tab */}
        <motion.div
          animate={{ x: open ? 4 : 0 }}
          style={{
            background: t.accent,
            borderRadius: "12px 0 0 12px",
            padding: "6px 6px 6px 8px",
            display: "flex",
            alignItems: "center",
            fontSize: 10,
            fontFamily: fonts.body,
            fontWeight: 800,
            color: "#fff",
            writingMode: "vertical-rl",
            textOrientation: "mixed",
            letterSpacing: "1px",
          }}
        >
          {open ? "CLOSE" : "OPTIONS"}
        </motion.div>

        {/* Penguin image */}
        <div style={{
          width: 64,
          height: 64,
          borderRadius: "50% 0 0 50%",
          background: "rgba(255,255,255,.92)",
          border: `2px solid ${colors.pink300}`,
          borderRight: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          boxShadow: "-4px 4px 14px rgba(232,83,107,.2)",
        }}>
          <img
            src="/Haru.webp"
            alt="Haru the penguin"
            style={{ width: 52, height: 52, objectFit: "contain" }}
          />
        </div>
      </motion.button>

      {/* Slide-out panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              bottom: 0,
              width: 290,
              zIndex: 45,
              background: darkBg ? "rgba(18,8,28,.97)" : "rgba(255,243,249,.97)",
              backdropFilter: "blur(16px)",
              borderLeft: `2px solid ${t.accent}44`,
              overflowY: "auto",
              overflowX: "hidden",
              boxShadow: "-10px 0 40px rgba(232,83,107,.15)",
              padding: "16px 18px 100px",
            }}
          >
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
              <img
                src="/Haru.webp"
                alt="Haru the penguin"
                style={{ width: 40, height: 40, objectFit: "contain" }}
              />
              <div>
                <div style={{ fontFamily: fonts.display, fontWeight: 800, fontSize: 17, color: t.accent }}>
                  Penguin Options
                </div>
                <div style={{ fontFamily: fonts.body, fontSize: 11, fontWeight: 700, color: colors.plumLight }}>
                  Customize your reading experience
                </div>
              </div>
            </div>

            <div style={{ height: 1, background: `${t.accent}22`, margin: "10px 0" }} />

            {/* --- 1. THEMES --- */}
            <SectionTitle>Color Themes</SectionTitle>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {(Object.keys(themes) as Theme[]).map((k) => (
                <Chip key={k} label={themes[k].name} active={theme === k} onClick={() => setTheme(k)} />
              ))}
            </div>

            {/* --- 2. DARK PANEL BG --- */}
            <SectionTitle>Panel Background</SectionTitle>
            <Toggle label="Dark sidebar panel" value={darkBg} onChange={setDarkBg} />

            {/* --- 3. FONT SIZE --- */}
            <SectionTitle>Reading Font Size</SectionTitle>
            <div style={{ display: "flex", gap: 6 }}>
              {(["small", "medium", "large"] as FontSize[]).map((f) => (
                <Chip key={f} label={f.charAt(0).toUpperCase() + f.slice(1)} active={fontSize === f} onClick={() => setFontSize(f)} />
              ))}
            </div>

            {/* --- 4. FALLING DECOR --- */}
            <SectionTitle>Falling Decorations</SectionTitle>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {(Object.keys(decorLabels) as PanelDecor[]).map((d) => (
                <Chip key={d} label={decorLabels[d]} active={decor === d} onClick={() => setDecor(d)} />
              ))}
            </div>

            {/* --- 5. PANEL BORDER STYLE --- */}
            <SectionTitle>Panel Frame Style</SectionTitle>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {(["none", "dashed", "ribbon-tag", "filmstrip"] as BorderStyle[]).map((b) => (
                <Chip key={b} label={b === "none" ? "Clean" : b === "dashed" ? "Dashed" : b === "ribbon-tag" ? "Ribbon Tag" : "Filmstrip"}
                  active={borderStyle === b} onClick={() => setBorderStyle(b)} />
              ))}
            </div>

            {/* --- 6-15. TOGGLES --- */}
            <SectionTitle>Visual Effects</SectionTitle>
            <Toggle label="Reading timer" value={showTimer} onChange={setShowTimer} />
            <Toggle label="Sticker glow" value={stickerGlow} onChange={setStickerGlow} />
            <Toggle label="Vintage sepia tones" value={sepia} onChange={setSepia} />
            <Toggle label="Dreamy soft filter" value={dreamyBlur} onChange={setDreamyBlur} />
            <Toggle label="Panel drop shadows" value={panelShadow} onChange={setPanelShadow} />
            <Toggle label="Cozy warm tint" value={cozyMode} onChange={setCozyMode} />
            <Toggle label="Confetti on panel tap" value={confettiMode} onChange={setConfettiMode} />
            <Toggle label="Hide hint banner" value={hideTip} onChange={setHideTip} />

            {/* --- 16-20. ACTION BUTTONS --- */}
            <SectionTitle>Quick Actions</SectionTitle>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 4 }}>

              {/* Bookmark */}
              <ActionBtn color={t.accent} onClick={handleBookmark} icon={
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                </svg>
              }>Bookmark this spot</ActionBtn>

              {/* Scroll to top */}
              <ActionBtn color={t.accent} onClick={scrollTop} icon={
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 19V5M5 12l7-7 7 7" />
                </svg>
              }>Back to top</ActionBtn>

              {/* Reset all settings */}
              <ActionBtn color="#c0607a" onClick={() => {
                setTheme("sakura"); setFontSize("medium"); setDecor("none");
                setDarkBg(false); setShowTimer(true); setStickerGlow(false);
                setSepia(false); setDreamyBlur(false); setPanelShadow(true);
                setCozyMode(false); setConfettiMode(false); setHideTip(false);
                setBorderStyle("none");
                setToast("Settings reset!");
              }} icon={
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" />
                </svg>
              }>Reset all settings</ActionBtn>

            </div>

            {/* Footer */}
            <div style={{
              marginTop: 24,
              padding: "12px 0 0",
              borderTop: `1px solid ${t.accent}22`,
              textAlign: "center",
              fontFamily: fonts.body,
              fontSize: 10,
              fontWeight: 700,
              color: colors.plumLight,
              letterSpacing: ".5px",
            }}>
              Our Chapter — made with love
              <div style={{ marginTop: 6, display: "flex", justifyContent: "center" }}>
                <RibbonRow color={t.accent} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop close */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            style={{
              position: "fixed", inset: 0, zIndex: 44,
              background: "rgba(92,58,70,.18)",
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}

// ---------- Subcomponents ----------
function ActionBtn({ children, onClick, color, icon }: {
  children: React.ReactNode; onClick: () => void; color: string; icon: React.ReactNode;
}) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex", alignItems: "center", gap: 8,
        background: hov ? color : "transparent",
        color: hov ? "#fff" : color,
        border: `1.5px solid ${color}`,
        borderRadius: 12,
        padding: "9px 14px",
        fontFamily: fonts.body,
        fontSize: 12,
        fontWeight: 800,
        cursor: "pointer",
        transition: "all .2s",
        width: "100%",
        textAlign: "left",
      }}
    >
      {icon}
      {children}
    </button>
  );
}

function RibbonRow({ color }: { color: string }) {
  return (
    <svg width="80" height="14" viewBox="0 0 80 14">
      {[0, 16, 32, 48, 64].map((x) => (
        <g key={x} transform={`translate(${x}, 7)`}>
          <path d="M0 -4 L6 0 L0 4 Z" fill={color} opacity=".7" />
          <path d="M8 -4 L2 0 L8 4 Z" fill={color} opacity=".5" />
          <circle cx="4" cy="0" r="2" fill={color} opacity=".9" />
        </g>
      ))}
    </svg>
  );
}

