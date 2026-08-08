import { useMemo } from "react";
import { motion } from "framer-motion";
import { colors } from "../lib/tokens";
import { BowIcon, HeartIcon, StarIcon } from "./icons";

type ParticleType = "bow" | "heart" | "star";

interface Particle {
  id: number;
  type: ParticleType;
  left: number;
  top: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
  color: string;
}

const PARTICLE_COLORS = [colors.cherry500, colors.pink300, colors.babyBlue200, "#FFFFFF"];

function ParticleIcon({ type, color }: { type: ParticleType; color: string }) {
  if (type === "bow") return <BowIcon size={24} color={color} />;
  if (type === "heart") return <HeartIcon size={24} color={color} />;
  return <StarIcon size={24} color={color} />;
}

/** Small bows/hearts/stars drifting slowly across the cover hero — subtle, not distracting. */
export function FloatingParticles({ density = "lively" }: { density?: "calm" | "lively" }) {
  const particles = useMemo<Particle[]>(() => {
    const count = density === "calm" ? 8 : 14;
    const types: ParticleType[] = ["bow", "heart", "star"];
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      type: types[Math.floor(Math.random() * types.length)],
      left: Math.round(Math.random() * 88) + 4,
      top: Math.round(Math.random() * 78) + 6,
      size: Math.round(Math.random() * 14) + 12,
      duration: Math.random() * 5 + 5,
      delay: Math.random() * 4,
      opacity: Math.random() * 0.35 + 0.35,
      color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [density]);

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }} aria-hidden>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          style={{ position: "absolute", left: `${p.left}%`, top: `${p.top}%`, width: p.size, height: p.size, opacity: p.opacity }}
          animate={{ rotate: [0, 10, 0] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
        >
          <ParticleIcon type={p.type} color={p.color} />
        </motion.div>
      ))}
    </div>
  );
}
