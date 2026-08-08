import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

type AtmosphereMode = "twilight" | "midnight" | "sunset";
type WindSpeed = "calm" | "breeze" | "gust";

interface PlantedLavender {
  id: string;
  xPct: number;
  height: number;
  variant: string;
  delay: number;
  createdAt: number;
}

interface Particle {
  id: string;
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  rotation: number;
  opacity: number;
  color: string;
  type: "petal" | "sparkle" | "firefly";
}

const LAVENDER_VARIANTS = [
  "/lavender.png",
  "/lavender-soft.png",
  "/lavender-deep.png",
  "/lavender-sunset.png",
];

export function PixelLavenderGarden() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [atmosphere, setAtmosphere] = useState<AtmosphereMode>("twilight");
  const [windSpeed, setWindSpeed] = useState<WindSpeed>("breeze");
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const [plantedList, setPlantedList] = useState<PlantedLavender[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Sound Synth using Web Audio API for soothing gentle chimes
  const playChime = useCallback((freq = 523.25) => {
    if (!isAudioEnabled) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.25);
    } catch {
      // Audio context ignored if blocked
    }
  }, [isAudioEnabled]);

  // Initial dense garden layout generation (95 stalks spanning edge-to-edge)
  const baseStalks = useMemo(() => {
    const total = 95;
    return Array.from({ length: total }).map((_, i) => {
      const layer = i % 3; // 0: background, 1: midground, 2: foreground
      // Spread from -2% to 102% so edges are completely filled with zero gaps
      const rawPct = (i / (total - 1)) * 104 - 2;
      const jitter = (i % 3 === 0 ? 0.4 : i % 3 === 1 ? -0.4 : 0);
      const xPct = Math.max(-2, Math.min(102, rawPct + jitter));
      
      const height = layer === 0 ? 115 + (i % 5) * 12 : layer === 1 ? 150 + (i % 7) * 14 : 185 + (i % 4) * 18;
      const variantIndex = (i + layer) % LAVENDER_VARIANTS.length;
      const swayDuration = windSpeed === "calm" ? 4.5 + (i % 3) * 0.5 : windSpeed === "breeze" ? 3.2 + (i % 4) * 0.4 : 1.8 + (i % 3) * 0.3;
      const delay = (i % 9) * 0.35;

      return {
        id: `base-${i}`,
        xPct,
        height,
        layer,
        variant: LAVENDER_VARIANTS[variantIndex],
        swayDuration,
        delay,
        scale: layer === 0 ? 0.75 : layer === 1 ? 0.95 : 1.15,
      };
    });
  }, [windSpeed]);

  // Handle Mouse movement across garden to calculate stem deflection
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });

    // Spawn floating sparkles/petals randomly on mouse drag/hover
    if (Math.random() < 0.22) {
      const colors = ["#C084FC", "#E9D5FF", "#F472B6", "#FDE047"];
      const newParticle: Particle = {
        id: `p-${Date.now()}-${Math.random()}`,
        x,
        y,
        size: Math.random() * 8 + 4,
        speedX: (Math.random() - 0.2) * 2.5,
        speedY: -(Math.random() * 2 + 1.2),
        rotation: Math.random() * 360,
        opacity: 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        type: Math.random() > 0.4 ? "sparkle" : "petal",
      };
      setParticles((prev) => [...prev.slice(-35), newParticle]);
    }
  };

  const handleMouseLeave = () => {
    setMousePos(null);
  };

  // Interactive Click to Plant extra lavender stalk
  const handleGardenClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const xPct = ((e.clientX - rect.left) / rect.width) * 100;
    
    const newLavender: PlantedLavender = {
      id: `planted-${Date.now()}`,
      xPct: Math.max(0, Math.min(100, xPct)),
      height: 165 + Math.random() * 45,
      variant: LAVENDER_VARIANTS[Math.floor(Math.random() * LAVENDER_VARIANTS.length)],
      delay: 0,
      createdAt: Date.now(),
    };

    setPlantedList((prev) => [...prev, newLavender]);

    // Play chime sound
    const notes = [523.25, 587.33, 659.25, 783.99, 880.0];
    const randomNote = notes[Math.floor(Math.random() * notes.length)];
    playChime(randomNote);

    // Burst of sparkles at click location
    const burst: Particle[] = Array.from({ length: 8 }).map((_, i) => ({
      id: `burst-${Date.now()}-${i}`,
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      size: Math.random() * 10 + 6,
      speedX: (Math.random() - 0.5) * 4,
      speedY: -(Math.random() * 3 + 1.5),
      rotation: Math.random() * 360,
      opacity: 1,
      color: "#E9D5FF",
      type: "sparkle",
    }));
    setParticles((prev) => [...prev, ...burst]);
  };

  // Particle animation loop
  useEffect(() => {
    if (particles.length === 0) return;
    const timer = setInterval(() => {
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.speedX,
            y: p.y + p.speedY,
            opacity: p.opacity - 0.025,
          }))
          .filter((p) => p.opacity > 0)
      );
    }, 30);
    return () => clearInterval(timer);
  }, [particles]);

  // Atmosphere Styles
  const getAtmosphereGlow = () => {
    switch (atmosphere) {
      case "midnight":
        return "radial-gradient(ellipse at bottom, rgba(88, 28, 135, 0.7) 0%, rgba(30, 27, 75, 0.5) 60%, transparent 85%)";
      case "sunset":
        return "radial-gradient(ellipse at bottom, rgba(244, 114, 182, 0.6) 0%, rgba(192, 132, 252, 0.35) 55%, transparent 85%)";
      case "twilight":
      default:
        return "radial-gradient(ellipse at bottom, rgba(167, 139, 250, 0.5) 0%, rgba(251, 207, 232, 0.3) 55%, transparent 85%)";
    }
  };

  return (
    <div className="relative w-full overflow-hidden pt-8 pb-0 mb-0">
      {/* 1. ATMOSPHERE WATERCOLOR & GLOW LAYER */}
      <div className="absolute inset-0 pointer-events-none transition-all duration-700">
        <div
          className="absolute left-1/2 bottom-0 h-[320px] w-full -translate-x-1/2 blur-[80px] transition-all duration-700"
          style={{ background: getAtmosphereGlow() }}
        />
        <div
          className="absolute left-0 bottom-0 h-56 w-96 rounded-full blur-[70px]"
          style={{
            background: atmosphere === "midnight"
              ? "rgba(67, 56, 202, 0.45)"
              : "rgba(244, 114, 182, 0.35)",
          }}
        />
        <div
          className="absolute right-0 bottom-0 h-56 w-96 rounded-full blur-[70px]"
          style={{
            background: atmosphere === "sunset"
              ? "rgba(217, 70, 239, 0.4)"
              : "rgba(139, 92, 246, 0.4)",
          }}
        />
      </div>

      {/* 2. GARDEN TITLE HEADER */}
      <div className="relative z-20 mb-3 flex flex-col items-center justify-center text-center px-4">
        <h2 className="font-display text-step2 sm:text-step3 font-normal italic tracking-tight text-ink drop-shadow-xs">
          Syvelle’s Lavender Garden
        </h2>
        <div className="mt-1 flex items-center gap-2">
          <span className="h-px w-6 bg-accent/40" aria-hidden="true" />
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-faint">
            ✦ Planted with love ✦
          </span>
          <span className="h-px w-6 bg-accent/40" aria-hidden="true" />
        </div>
      </div>

      {/* 3. INTERACTIVE GARDEN CONTROLS PANEL */}
      <div className="relative z-20 mb-3 flex flex-wrap items-center justify-center gap-2 sm:gap-3 px-4 font-mono text-[11px] text-ink-muted">
        <div className="flex items-center gap-1 rounded-full border border-line bg-surface/90 backdrop-blur-md px-3 py-1 shadow-sm">
          <span className="text-ink-faint mr-1">Sky:</span>
          {(["twilight", "midnight", "sunset"] as AtmosphereMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setAtmosphere(mode)}
              className={`rounded-full px-2.5 py-0.5 transition-all ${
                atmosphere === mode
                  ? "bg-accent text-white font-medium shadow-xs"
                  : "text-ink-muted hover:text-ink hover:bg-surface-sunken"
              }`}
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 rounded-full border border-line bg-surface/90 backdrop-blur-md px-3 py-1 shadow-sm">
          <span className="text-ink-faint mr-1">Wind:</span>
          {(["calm", "breeze", "gust"] as WindSpeed[]).map((w) => (
            <button
              key={w}
              onClick={() => setWindSpeed(w)}
              className={`rounded-full px-2.5 py-0.5 transition-all ${
                windSpeed === w
                  ? "bg-accent text-white font-medium shadow-xs"
                  : "text-ink-muted hover:text-ink hover:bg-surface-sunken"
              }`}
            >
              {w.charAt(0).toUpperCase() + w.slice(1)}
            </button>
          ))}
        </div>

        <button
          onClick={() => {
            setIsAudioEnabled(!isAudioEnabled);
            if (!isAudioEnabled) playChime(659.25);
          }}
          className={`flex items-center gap-1.5 rounded-full border border-line px-3 py-1 shadow-sm transition-all ${
            isAudioEnabled
              ? "bg-purple-100 text-purple-800 border-purple-300 font-medium"
              : "bg-surface/90 text-ink-muted hover:text-ink"
          }`}
          title="Toggle soft chime audio when planting lavenders"
        >
          <span>{isAudioEnabled ? "🎵 Sound: On" : "🔇 Sound: Off"}</span>
        </button>

        <span className="hidden md:inline-block text-[10px] text-ink-faint italic ml-1">
          ✦ Click garden to plant lavenders & brush cursor to sway flowers
        </span>
      </div>

      {/* 3. MAIN PIXEL LAVENDER GARDEN DISPLAY AREA (Full Bleed Edge-to-Edge) */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleGardenClick}
        className="relative h-[230px] sm:h-[280px] md:h-[320px] w-full cursor-pointer select-none overflow-hidden pb-0 mb-0"
      >
        {/* Render Base Lavender Stalks */}
        {baseStalks.map((stalk) => {
          let tilt = 0;
          if (containerRef.current && mousePos) {
            const rect = containerRef.current.getBoundingClientRect();
            const stalkX = (stalk.xPct / 100) * rect.width;
            const dist = Math.abs(mousePos.x - stalkX);
            if (dist < 120) {
              const force = (1 - dist / 120) * 16;
              tilt = mousePos.x > stalkX ? -force : force;
            }
          }

          const animClass =
            windSpeed === "calm"
              ? "animate-pixel-calm"
              : windSpeed === "breeze"
              ? "animate-pixel-breeze"
              : "animate-pixel-gust";

          return (
            <div
              key={stalk.id}
              className="absolute bottom-0 transition-transform duration-300 ease-out"
              style={{
                left: `${stalk.xPct}%`,
                zIndex: stalk.layer + 1,
                transform: `translateX(-50%) rotate(${tilt}deg)`,
                transformOrigin: "bottom center",
              }}
            >
              <div
                className={animClass}
                style={{
                  animationDelay: `${stalk.delay}s`,
                  animationDuration: `${stalk.swayDuration}s`,
                  transformOrigin: "bottom center",
                }}
              >
                <img
                  src={stalk.variant}
                  alt="Pixel Lavender"
                  className="pixelated block object-bottom drop-shadow-xs pointer-events-none"
                  style={{
                    height: `${stalk.height}px`,
                    width: "auto",
                    opacity: stalk.layer === 0 ? 0.8 : stalk.layer === 1 ? 0.92 : 1.0,
                    filter:
                      atmosphere === "midnight"
                        ? "brightness(0.85) contrast(1.1) hue-rotate(10deg)"
                        : atmosphere === "sunset"
                        ? "brightness(1.05) saturate(1.15)"
                        : "none",
                  }}
                />
              </div>
            </div>
          );
        })}

        {/* Render Interactive Planted Lavenders */}
        <AnimatePresence>
          {plantedList.map((item) => (
            <motion.div
              key={item.id}
              initial={{ scale: 0.1, y: 60, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 220, damping: 15 }}
              className="absolute bottom-0 z-30"
              style={{
                left: `${item.xPct}%`,
                transform: "translateX(-50%)",
                transformOrigin: "bottom center",
              }}
            >
              <div className="animate-pixel-breeze" style={{ transformOrigin: "bottom center" }}>
                <img
                  src={item.variant}
                  alt="Planted Pixel Lavender"
                  className="pixelated block object-bottom drop-shadow-md pointer-events-none"
                  style={{
                    height: `${item.height}px`,
                    width: "auto",
                  }}
                />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Dynamic Floating Particles & Sparkles */}
        {particles.map((p) => (
          <div
            key={p.id}
            className="pointer-events-none absolute z-40 transition-opacity"
            style={{
              left: `${p.x}px`,
              top: `${p.y}px`,
              opacity: p.opacity,
              transform: `translate(-50%, -50%) rotate(${p.rotation}deg)`,
            }}
          >
            {p.type === "sparkle" ? (
              <img
                src="/pixel-sparkle.png"
                alt="Sparkle"
                className="pixelated animate-sparkle"
                style={{ width: `${p.size * 1.5}px`, height: "auto" }}
              />
            ) : (
              <div
                className="pixelated rounded-xs"
                style={{
                  width: `${p.size}px`,
                  height: `${p.size}px`,
                  backgroundColor: p.color,
                  boxShadow: `0 0 6px ${p.color}`,
                }}
              />
            )}
          </div>
        ))}

        {/* Ambient Fireflies in Midnight mode */}
        {atmosphere === "midnight" && (
          <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
            {Array.from({ length: 18 }).map((_, i) => (
              <div
                key={`ff-${i}`}
                className="animate-firefly absolute rounded-full bg-yellow-200 shadow-[0_0_8px_rgba(253,224,71,0.9)]"
                style={{
                  width: `${4 + (i % 3) * 2}px`,
                  height: `${4 + (i % 3) * 2}px`,
                  left: `${(i * 5.5) % 98}%`,
                  bottom: `${20 + (i % 5) * 35}px`,
                  animationDelay: `${(i % 5) * 0.8}s`,
                  animationDuration: `${4 + (i % 4) * 1.2}s`,
                }}
              />
            ))}
          </div>
        )}

        {/* Soil Bed Pixel Bottom Detail Layer - Flush to bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-purple-950/25 via-purple-900/10 to-transparent pointer-events-none" />
      </div>
    </div>
  );
}
