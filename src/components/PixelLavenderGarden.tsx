import { useMemo } from "react";


/**
 * A handcrafted, pure-code pixelated lavender garden with animated swaying stems,
 * cute pixel bees & butterflies, and soft purple watercolor brush backgrounds.
 * Designed to match the warm paper editorial aesthetic of the site.
 */
export function PixelLavenderGarden() {
  // Generate random variation for pixel lavender stalks
  const stalks = useMemo(() => {
    return Array.from({ length: 75 }).map((_, i) => ({
      id: i,
      x: 4 + i * 16 + (i % 3) * 2,
      height: 48 + ((i * 7) % 5) * 12,
      delay: (i % 7) * 0.4,
      duration: 3 + (i % 4) * 0.5,
      flowerShade: i % 3 === 0 ? "#8B5CF6" : i % 3 === 1 ? "#A78BFA" : "#C084FC",
      flowerDark: i % 3 === 0 ? "#6D28D9" : i % 3 === 1 ? "#7C3AED" : "#9333EA",
      flowerLight: i % 3 === 0 ? "#DDD6FE" : i % 3 === 1 ? "#E9D5FF" : "#F3E8FF",
    }));
  }, []);

  return (
    <div className="relative w-full overflow-hidden pt-12 pb-6">
      {/* 1. SOFT WATERCOLOR BRUSHES OF PURPLE & PINK (Background Layer) */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        {/* Soft purple watercolor wash */}
        <div
          className="absolute left-1/2 bottom-0 h-64 w-[800px] -translate-x-1/2 rounded-full opacity-40 blur-[60px]"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(167, 139, 250, 0.45) 0%, rgba(244, 114, 182, 0.25) 50%, transparent 80%)",
          }}
        />
        {/* Pink blush brush accent on the left */}
        <div
          className="absolute left-4 bottom-2 h-36 w-64 rounded-full opacity-35 blur-[45px]"
          style={{
            background: "radial-gradient(circle, rgba(244, 114, 182, 0.4) 0%, transparent 70%)",
          }}
        />
        {/* Deep lavender brush accent on the right */}
        <div
          className="absolute right-4 bottom-2 h-36 w-64 rounded-full opacity-35 blur-[45px]"
          style={{
            background: "radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, transparent 70%)",
          }}
        />

        {/* Hand-painted watercolor brush stroke SVGs */}
        <svg
          className="absolute bottom-4 left-1/2 h-20 w-full max-w-2xl -translate-x-1/2 opacity-30"
          viewBox="0 0 600 60"
          preserveAspectRatio="none"
          fill="none"
        >
          <path
            d="M10 35C120 15 240 45 360 25C480 40 540 20 590 35"
            stroke="#A78BFA"
            strokeWidth="28"
            strokeLinecap="round"
            style={{ filter: "blur(8px)" }}
          />
          <path
            d="M30 40C150 25 280 40 410 20C490 35 550 25 580 38"
            stroke="#F472B6"
            strokeWidth="18"
            strokeLinecap="round"
            style={{ filter: "blur(6px)" }}
          />
        </svg>
      </div>

      {/* 2. PIXELATED CUTE LAVENDER GARDEN (Foreground Code Layer) */}
      <div className="relative flex w-full flex-col items-center">
        {/* Container uses a min-width to ensure the garden doesn't shrink to invisible on mobile, but overflow is hidden */}
        <div className="relative w-full overflow-hidden flex justify-center pt-8">
          <div className="relative w-full min-w-[800px] md:min-w-[1200px] xl:min-w-[1400px]">
            <svg
              viewBox="0 0 1200 120"
              className="w-full h-auto drop-shadow-sm"
            preserveAspectRatio="xMidYMax meet"
            shapeRendering="crispEdges"
          >
            <defs>
              {/* Keyframe animation for pixel swaying wind */}
              <style>{`
                @keyframes pixelSwaySlow {
                  0% { transform: rotate(0deg); }
                  50% { transform: rotate(2.5deg); }
                  100% { transform: rotate(-2deg); }
                }
                @keyframes pixelSwayFast {
                  0% { transform: rotate(0deg); }
                  50% { transform: rotate(-3deg); }
                  100% { transform: rotate(2deg); }
                }
                @keyframes beeHover {
                  0%, 100% { transform: translate(0, 0); }
                  50% { transform: translate(4px, -6px); }
                }
                @keyframes wingFlap {
                  0%, 100% { opacity: 0.9; }
                  50% { opacity: 0.3; }
                }
                @keyframes butterflyFloat {
                  0%, 100% { transform: translate(0, 0) rotate(0deg); }
                  25% { transform: translate(-5px, -8px) rotate(-5deg); }
                  75% { transform: translate(5px, -5px) rotate(5deg); }
                }
                .sway-slow { transform-origin: bottom center; animation: pixelSwaySlow 4s ease-in-out infinite; }
                .sway-fast { transform-origin: bottom center; animation: pixelSwayFast 3.2s ease-in-out infinite; }
                .bee-anim { animation: beeHover 2.8s ease-in-out infinite; }
                .wing-anim { animation: wingFlap 0.15s ease-in-out infinite; }
                .butterfly-anim { animation: butterflyFloat 4.5s ease-in-out infinite; }
              `}</style>

              {/* Reusable Pixel Lavender Stalk Template */}
              <g id="pixel-lavender-cluster">
                {/* Stem */}
                <rect x="3" y="20" width="2" height="40" fill="#4B6B4E" />
                <rect x="2" y="35" width="2" height="2" fill="#5E8362" />
                <rect x="5" y="45" width="2" height="2" fill="#5E8362" />
                {/* Leaves */}
                <rect x="0" y="40" width="3" height="2" fill="#4B6B4E" />
                <rect x="5" y="48" width="3" height="2" fill="#4B6B4E" />
                {/* Flower Buds Stack (Pixelated Lavender Spire) */}
                <rect x="2" y="4" width="4" height="4" fill="#A78BFA" />
                <rect x="1" y="8" width="6" height="4" fill="#8B5CF6" />
                <rect x="0" y="12" width="8" height="4" fill="#7C3AED" />
                <rect x="1" y="16" width="6" height="4" fill="#A78BFA" />
                <rect x="2" y="20" width="4" height="4" fill="#C084FC" />
                {/* Flower Highlights */}
                <rect x="2" y="5" width="2" height="2" fill="#EDE9FE" />
                <rect x="4" y="9" width="2" height="2" fill="#DDD6FE" />
                <rect x="1" y="13" width="2" height="2" fill="#F3E8FF" />
                <rect x="5" y="17" width="2" height="2" fill="#DDD6FE" />
              </g>

              {/* Cute Pixel Bee */}
              <g id="pixel-bee" className="bee-anim">
                {/* Bee Body */}
                <rect x="0" y="2" width="2" height="4" fill="#1E1B18" />
                <rect x="2" y="1" width="3" height="6" fill="#FBBF24" />
                <rect x="5" y="1" width="2" height="6" fill="#1E1B18" />
                <rect x="7" y="2" width="2" height="4" fill="#FBBF24" />
                {/* Bee Stinger */}
                <rect x="9" y="3" width="1" height="2" fill="#1E1B18" />
                {/* Bee Wings */}
                <g className="wing-anim">
                  <rect x="2" y="-2" width="3" height="3" fill="#E0F2FE" opacity="0.8" />
                  <rect x="5" y="-2" width="3" height="3" fill="#BAE6FD" opacity="0.8" />
                </g>
                {/* Eye */}
                <rect x="1" y="2" width="1" height="1" fill="#FFFFFF" />
              </g>

              {/* Cute Pixel Butterfly */}
              <g id="pixel-butterfly" className="butterfly-anim">
                {/* Left Wings */}
                <rect x="0" y="0" width="4" height="4" fill="#F472B6" />
                <rect x="1" y="1" width="2" height="2" fill="#FBCFE8" />
                <rect x="1" y="4" width="3" height="3" fill="#C084FC" />
                {/* Right Wings */}
                <rect x="6" y="0" width="4" height="4" fill="#F472B6" />
                <rect x="7" y="1" width="2" height="2" fill="#FBCFE8" />
                <rect x="6" y="4" width="3" height="3" fill="#C084FC" />
                {/* Body */}
                <rect x="4" y="1" width="2" height="6" fill="#312E81" />
                <rect x="4" y="0" width="2" height="1" fill="#4C1D95" />
              </g>
            </defs>

            {/* Earth / Grass Pixel Base Line */}
            <rect x="0" y="116" width="1200" height="4" fill="#423520" opacity="0.15" />
            <rect x="0" y="114" width="1200" height="2" fill="#5E8362" opacity="0.4" />

            {/* Render 75 Pixel Lavender Stalks across the bottom */}
            {stalks.map((s) => (
              <g
                key={s.id}
                transform={`translate(${s.x}, ${118 - s.height})`}
                className={s.id % 2 === 0 ? "sway-slow" : "sway-fast"}
                style={{ animationDelay: `${s.delay}s` }}
              >
                {/* Stem */}
                <rect x="3" y="18" width="2" height={s.height - 18} fill="#4B6B4E" />
                <rect x="2" y={Math.floor(s.height * 0.5)} width="2" height="2" fill="#5E8362" />
                {/* Leaves */}
                <rect x="0" y={Math.floor(s.height * 0.6)} width="3" height="2" fill="#4B6B4E" />
                <rect x="5" y={Math.floor(s.height * 0.7)} width="3" height="2" fill="#4B6B4E" />
                {/* Flower Spire */}
                <rect x="2" y="2" width="4" height="4" fill={s.flowerLight} />
                <rect x="1" y="6" width="6" height="4" fill={s.flowerShade} />
                <rect x="0" y="10" width="8" height="4" fill={s.flowerDark} />
                <rect x="1" y="14" width="6" height="4" fill={s.flowerShade} />
                <rect x="2" y="18" width="4" height="4" fill={s.flowerLight} />
                {/* Flower Pixel Sparkle */}
                <rect x="3" y="3" width="2" height="2" fill="#FFFFFF" />
                <rect x="2" y="11" width="2" height="2" fill="#FFFFFF" />
              </g>
            ))}

            {/* Cute Pixel Bee 1 hovering over left garden */}
            <use href="#pixel-bee" x="180" y="45" />

            {/* Cute Pixel Bee 2 hovering over right garden (flipped) */}
            <use href="#pixel-bee" transform="translate(1020, 55) scale(-1, 1)" />

            {/* Cute Pixel Bee 3 hovering over middle-right garden */}
            <use href="#pixel-bee" x="720" y="35" />

            {/* Cute Pixel Butterfly fluttering in center-left */}
            <use href="#pixel-butterfly" x="420" y="25" />
            
            {/* Cute Pixel Butterfly 2 fluttering in center-right (flipped) */}
            <use href="#pixel-butterfly" transform="translate(850, 40) scale(-1, 1)" />
          </svg>
        </div>
      </div>
    </div>
    </div>
  );
}
