import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../styles/animations.css";
import { colors, fonts } from "../lib/tokens";
import { FloatingParticles } from "../components/FloatingParticles";
import { BowIcon, SpeakerIcon } from "../components/icons";

/** Cover / title page — also the source of truth for the site's palette, type, and decorative motifs (see src/lib/tokens.ts). */
export function CoverPage() {
  const navigate = useNavigate();
  const [soundOn, setSoundOn] = useState(false);
  const [pressed, setPressed] = useState(false);

  const handleStart = () => {
    setPressed(true);
    setTimeout(() => setPressed(false), 500);
    navigate("/chapters");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        position: "relative",
        overflowX: "hidden",
        background: "linear-gradient(180deg, #FFE7F0 0%, #FFD3E4 55%, #FFC2DA 100%)",
        fontFamily: fonts.body,
      }}
    >
      <section
        style={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 36,
          padding: "76px 24px 40px",
          textAlign: "center",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "radial-gradient(circle, #ffffff 2.5px, transparent 3px)",
            backgroundSize: "30px 30px",
            opacity: 0.4,
            pointerEvents: "none",
          }}
        />

        <FloatingParticles density="lively" />

        <motion.button
          onClick={() => setSoundOn((s) => !s)}
          aria-pressed={soundOn}
          whileTap={{ scale: 0.9 }}
          style={{
            position: "absolute",
            top: 22,
            right: 20,
            zIndex: 5,
            width: 44,
            height: 44,
            borderRadius: 999,
            background: "rgba(255,255,255,.75)",
            border: `2px solid ${colors.pink300}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: colors.cherry500,
            boxShadow: "0 6px 14px rgba(232,83,107,.2)",
            cursor: "pointer",
          }}
        >
          <SpeakerIcon muted={!soundOn} />
        </motion.button>

        <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
          <span
            style={{
              background: colors.babyBlue200,
              color: colors.inkPlum,
              padding: "6px 16px",
              borderRadius: 999,
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "1.2px",
              textTransform: "uppercase",
              fontFamily: fonts.body,
            }}
          >
            A Love Webtoon
          </span>
          <div style={{ animation: "wiggle 4s ease-in-out infinite", marginTop: 4 }}>
            <BowIcon size={48} color={colors.cherry500} />
          </div>
          <h1
            style={{
              margin: "4px 0 0",
              fontFamily: fonts.display,
              fontWeight: 800,
              fontSize: "clamp(34px, 10vw, 58px)",
              lineHeight: 1.15,
              color: colors.cherry500,
              WebkitTextStroke: "5px #fff",
              paintOrder: "stroke fill",
              textShadow: "0 8px 0 rgba(232,83,107,.15)",
              textAlign: "center",
              maxWidth: "92%",
            }}
          >
            Our Chapter
          </h1>
          <p style={{ margin: "6px 0 0", fontFamily: fonts.body, fontWeight: 700, fontSize: 15, color: colors.inkPlum, maxWidth: "90%" }}>
            Started December 9, 2023
          </p>
          <span
            style={{
              display: "inline-block",
              marginTop: 4,
              background: "#fff",
              border: `2px dashed ${colors.babyBlue200}`,
              borderRadius: 12,
              padding: "5px 12px",
              fontFamily: fonts.body,
              fontWeight: 700,
              fontSize: 12,
              letterSpacing: ".5px",
              color: colors.cherry500,
              transform: "rotate(-6deg)",
              boxShadow: "0 4px 10px rgba(232,83,107,.15)",
            }}
          >
            SINCE 12 . 09 . 2023
          </span>
        </div>

        <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
          <motion.button
            onClick={handleStart}
            animate={pressed ? {} : { y: [0, -6, 0], scale: [1, 1.02, 1] }}
            transition={pressed ? { duration: 0.5 } : { duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
            whileTap={{ scale: 0.93 }}
            style={{
              fontFamily: fonts.display,
              fontWeight: 700,
              fontSize: 20,
              color: colors.cherry500,
              background: "#ffffff",
              border: `3px solid ${colors.cherry500}`,
              borderRadius: 999,
              padding: "16px 42px",
              cursor: "pointer",
              boxShadow: pressed ? "0 2px 0 #E8536B, 0 4px 10px rgba(232,83,107,.25)" : "0 5px 0 #E8536B, 0 10px 22px rgba(232,83,107,.28)",
            }}
          >
            Start Reading&nbsp;→
          </motion.button>
          <span style={{ fontFamily: fonts.body, fontSize: 13, color: colors.plumLight }}>no spoilers, we promise</span>
        </div>

        <svg viewBox="0 0 200 20" preserveAspectRatio="none" style={{ position: "relative", display: "block", width: "100%", height: 28, marginTop: 8 }} fill="#ffffff">
          <path d="M0,20 Q10,0 20,20 Q30,0 40,20 Q50,0 60,20 Q70,0 80,20 Q90,0 100,20 Q110,0 120,20 Q130,0 140,20 Q150,0 160,20 Q170,0 180,20 Q190,0 200,20 Z" />
        </svg>
      </section>
    </div>
  );
}
