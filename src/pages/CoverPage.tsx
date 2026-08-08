import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../styles/animations.css";
import { colors, fonts } from "../lib/tokens";
import { BowIcon, SpeakerIcon } from "../components/icons";
import { getCloudinaryUrl } from "../lib/cloudinary";
import { RibbonIcon } from "../components/RibbonIcon";

export function CoverPage() {
  const navigate = useNavigate();
  const [soundOn, setSoundOn] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [, setRerender] = useState(0);

  useEffect(() => {
    const handleUpdate = () => setRerender((r) => r + 1);
    window.addEventListener("placeholder_mode_change", handleUpdate);
    window.addEventListener("custom_photo_change", handleUpdate);
    return () => {
      window.removeEventListener("placeholder_mode_change", handleUpdate);
      window.removeEventListener("custom_photo_change", handleUpdate);
    };
  }, []);

  const handleStart = () => {
    setPressed(true);
    setTimeout(() => setPressed(false), 500);
    navigate("/chapters/how-we-met");
  };

  const sampleCover1 = getCloudinaryUrl("her-and-us/chapter-01/cover", { width: 300, height: 360 });
  const sampleCover2 = getCloudinaryUrl("her-and-us/chapter-03/cover", { width: 300, height: 360 });

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        position: "relative",
        overflowX: "hidden",
        background: "transparent",
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
          gap: 28,
          padding: "60px 24px 40px",
          textAlign: "center",
          boxSizing: "border-box",
        }}
      >
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

        {/* Hero Branding */}
        <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <span
            style={{
              background: colors.babyBlue200,
              color: colors.inkPlum,
              padding: "6px 18px",
              borderRadius: 999,
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: "1.4px",
              textTransform: "uppercase",
              fontFamily: fonts.body,
              boxShadow: "0 4px 12px rgba(190,231,247,0.5)",
            }}
          >
            ✦ A Love Webtoon ✦
          </span>
          <div style={{ animation: "wiggle 4s ease-in-out infinite", marginTop: 4 }}>
            <BowIcon size={52} color={colors.cherry500} />
          </div>
          <h1
            style={{
              margin: "4px 0 0",
              fontFamily: fonts.display,
              fontWeight: 800,
              fontSize: "clamp(38px, 11vw, 64px)",
              lineHeight: 1.1,
              color: colors.cherry500,
              WebkitTextStroke: "6px #fff",
              paintOrder: "stroke fill",
              textShadow: "0 8px 0 rgba(232,83,107,.18)",
              textAlign: "center",
              maxWidth: "92%",
            }}
          >
            Our Chapter
          </h1>
          <p style={{ margin: "6px 0 0", fontFamily: fonts.body, fontWeight: 800, fontSize: 16, color: colors.inkPlum, maxWidth: "90%" }}>
            Started December 9, 2023
          </p>

          <span
            style={{
              display: "inline-block",
              marginTop: 4,
              background: "#fff",
              border: `2px dashed ${colors.babyBlue200}`,
              borderRadius: 12,
              padding: "6px 14px",
              fontFamily: fonts.body,
              fontWeight: 800,
              fontSize: 12,
              letterSpacing: ".8px",
              color: colors.cherry500,
              transform: "rotate(-5deg)",
              boxShadow: "0 4px 12px rgba(232,83,107,.15)",
            }}
          >
            SINCE 12 . 09 . 2023
          </span>
        </div>

        {/* Floating Polaroid Image Frame Showcase */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
            margin: "8px 0",
          }}
        >
          <motion.div
            animate={{ rotate: [-6, -4, -6] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            style={{
              width: 130,
              height: 155,
              background: "#fff",
              borderRadius: 16,
              padding: "10px 10px 24px",
              boxShadow: "0 10px 25px rgba(232,83,107,0.22)",
              border: `2px solid ${colors.pink300}`,
            }}
          >
            <img
              src={sampleCover1}
              alt="Chapter 1 Preview"
              style={{ width: "100%", height: 110, borderRadius: 10, objectFit: "cover" }}
            />
            <div style={{ fontFamily: fonts.body, fontSize: 10, fontWeight: 800, color: colors.cherry500, marginTop: 4 }}>
              Chapter 1
            </div>
          </motion.div>

          <motion.div
            animate={{ rotate: [5, 7, 5] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
            style={{
              width: 130,
              height: 155,
              background: "#fff",
              borderRadius: 16,
              padding: "10px 10px 24px",
              boxShadow: "0 10px 25px rgba(232,83,107,0.22)",
              border: `2px solid ${colors.pink300}`,
            }}
          >
            <img
              src={sampleCover2}
              alt="Chapter 3 Preview"
              style={{ width: "100%", height: 110, borderRadius: 10, objectFit: "cover" }}
            />
            <div style={{ fontFamily: fonts.body, fontSize: 10, fontWeight: 800, color: colors.cherry500, marginTop: 4 }}>
              Chapter 3
            </div>
          </motion.div>
        </div>

        {/* Start Button */}
        <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
          <motion.button
            onClick={handleStart}
            animate={pressed ? {} : { scale: [1, 1.02, 1] }}
            transition={pressed ? { duration: 0.5 } : { duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
            whileTap={{ scale: 0.93 }}
            style={{
              fontFamily: fonts.display,
              fontWeight: 800,
              fontSize: 21,
              color: colors.cherry500,
              background: "#ffffff",
              border: `3px solid ${colors.cherry500}`,
              borderRadius: 999,
              padding: "16px 44px",
              cursor: "pointer",
              boxShadow: pressed ? "0 2px 0 #E8536B, 0 4px 10px rgba(232,83,107,.25)" : "0 5px 0 #E8536B, 0 10px 22px rgba(232,83,107,.28)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <RibbonIcon size={20} color={colors.cherry500} />
              <span>Start Reading&nbsp;→</span>
              <RibbonIcon size={20} color={colors.cherry500} />
            </div>
          </motion.button>
          <span style={{ fontFamily: fonts.body, fontSize: 13, fontWeight: 700, color: colors.plumLight }}>
            5 Chapters • Our Story So Far
          </span>
        </div>

        <svg viewBox="0 0 200 20" preserveAspectRatio="none" style={{ position: "relative", display: "block", width: "100%", height: 28, marginTop: 8 }} fill="#ffffff">
          <path d="M0,20 Q10,0 20,20 Q30,0 40,20 Q50,0 60,20 Q70,0 80,20 Q90,0 100,20 Q110,0 120,20 Q130,0 140,20 Q150,0 160,20 Q170,0 180,20 Q190,0 200,20 Z" />
        </svg>
      </section>
    </div>
  );
}

