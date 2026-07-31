import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Sparkles, ShieldCheck, Zap } from "lucide-react";

/**
 * Premium 3D exploded view of a digital gift card.
 * Layers (back glow → card body → chip → emboss → front particles)
 * separate on scroll for a buttery-smooth parallax reveal.
 */
export function Hero3D() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Smooth out the scroll value.
  const progress = useSpring(scrollYProgress, { stiffness: 80, damping: 24, mass: 0.6 });

  // Layer transforms — each layer separates at a different rate.
  const rotateX = useTransform(progress, [0, 1], [18, 38]);
  const rotateZ = useTransform(progress, [0, 1], [0, 6]);
  const cardY = useTransform(progress, [0, 1], [0, -60]);
  const cardScale = useTransform(progress, [0, 1], [1, 1.05]);

  const glowOpacity = useTransform(progress, [0, 0.5, 1], [0.5, 0.8, 0.4]);
  const glowScale = useTransform(progress, [0, 1], [1, 1.4]);

  const chipZ = useTransform(progress, [0, 1], [40, 140]);
  const chipRotate = useTransform(progress, [0, 1], [0, -10]);

  const particlesY = useTransform(progress, [0, 1], [0, -200]);
  const particlesOpacity = useTransform(progress, [0, 0.3, 0.8], [0, 1, 0]);

  const shineX = useTransform(progress, [0, 1], ["-30%", "130%"]);

  return (
    <div ref={ref} className="relative h-[520px] w-full perspective-2000 sm:h-[600px]">
      {/* Backdrop glow */}
      <motion.div
        style={{ opacity: glowOpacity, scale: glowScale }}
        className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#1E5BD6] blur-[100px] sm:h-96 sm:w-96"
      />
      <motion.div
        style={{ opacity: glowOpacity }}
        className="pointer-events-none absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#C9A24B]/40 blur-[80px] sm:h-72 sm:w-72"
      />

      {/* 3D scene */}
      <motion.div
        style={{
          rotateX,
          rotateZ,
          y: cardY,
          scale: cardScale,
          transformStyle: "preserve-3d",
        }}
        className="absolute left-1/2 top-1/2 h-[340px] w-[520px] -translate-x-1/2 -translate-y-1/2 sm:h-[400px] sm:w-[600px]"
      >
        {/* Shadow plane below */}
        <div
          className="absolute -bottom-12 left-1/2 h-12 w-[80%] -translate-x-1/2 rounded-[50%] bg-black/40 blur-2xl"
          style={{ transform: "translateZ(-60px) rotateX(90deg)" }}
        />

        {/* Card base layer */}
        <div
          className="absolute inset-0 rounded-[28px] border border-white/15 bg-gradient-to-br from-[#002B6D] via-[#0047AB] to-[#1E5BD6] shadow-[0_30px_80px_-20px_rgba(0,43,109,0.7)]"
          style={{ transform: "translateZ(0px)" }}
        >
          {/* Card noise / texture */}
          <div className="absolute inset-0 rounded-[28px] bg-grid-dark opacity-30" />
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-16 -left-12 h-40 w-40 rounded-full bg-[#C9A24B]/20 blur-3xl" />

          {/* Shimmer */}
          <motion.div
            style={{ x: shineX }}
            className="absolute inset-y-0 -left-1/3 w-1/3 skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/25 to-transparent"
          />
        </div>

        {/* Card content layer (raised) */}
        <div
          className="absolute inset-0 flex flex-col justify-between p-7 text-white"
          style={{ transform: "translateZ(30px)" }}
        >
          {/* Top row */}
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.25em] text-white/60">
                Bring Gift Card
              </p>
              <p className="mt-1 font-display text-lg font-bold tracking-tight">
                GLOBAL · PREMIUM
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[10px] font-medium ring-1 ring-white/20">
              <Sparkles className="h-3 w-3 text-[#E5C77B]" />
              Verified
            </div>
          </div>

          {/* Chip (raised highest) */}
          <motion.div
            style={{ z: chipZ, rotate: chipRotate }}
            className="absolute left-7 top-1/2 -translate-y-1/2"
          >
            <div className="relative h-12 w-16 rounded-md bg-gradient-to-br from-[#E5C77B] via-[#C9A24B] to-[#9B7A2E] shadow-lg ring-1 ring-white/30">
              <div className="absolute inset-1 grid grid-cols-3 gap-0.5 opacity-60">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="rounded-[1px] bg-[#7A5F23]" />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Bottom row */}
          <div>
            <p className="font-mono text-sm tracking-widest text-white/70">
              •••• •••• •••• 2024
            </p>
            <div className="mt-3 flex items-end justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-white/50">Card Holder</p>
                <p className="font-display text-base font-semibold">BRING GIFT CARD</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-wider text-white/50">Valid Thru</p>
                <p className="font-mono text-sm">12/29</p>
              </div>
            </div>
          </div>
        </div>

        {/* Floating particles */}
        <motion.div
          style={{ y: particlesY, opacity: particlesOpacity, transformStyle: "preserve-3d" }}
          className="pointer-events-none absolute inset-0"
        >
          {PARTICLES.map((p, i) => (
            <motion.span
              key={i}
              className="absolute rounded-full"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: p.size,
                height: p.size,
                background: p.color,
                transform: `translateZ(${p.z}px)`,
                opacity: p.opacity,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [p.opacity, p.opacity * 1.5, p.opacity],
              }}
              transition={{
                duration: 3 + (i % 3),
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.2,
              }}
            />
          ))}
        </motion.div>
      </motion.div>

      {/* Floating feature chips (separate from card, parallax) */}
      <FloatingChips progress={progress} />
    </div>
  );
}

function FloatingChips({ progress }: { progress: ReturnType<typeof useSpring> }) {
  const yLeft = useTransform(progress, [0, 1], [0, -120]);
  const yRight = useTransform(progress, [0, 1], [0, 80]);

  return (
    <>
      <motion.div
        style={{ y: yLeft }}
        className="absolute left-0 top-1/2 hidden -translate-y-1/2 sm:block"
      >
        <div className="flex items-center gap-2 rounded-2xl bg-white/80 p-3 shadow-xl ring-1 ring-black/5 backdrop-blur">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0047AB]/10 text-[#0047AB]">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#0A1224]">Bank-grade security</p>
            <p className="text-[10px] text-[#6B7384]">256-bit encryption</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        style={{ y: yRight }}
        className="absolute right-0 top-1/3 hidden sm:block"
      >
        <div className="flex items-center gap-2 rounded-2xl bg-white/80 p-3 shadow-xl ring-1 ring-black/5 backdrop-blur">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#C9A24B]/15 text-[#C9A24B]">
            <Zap className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#0A1224]">Instant payouts</p>
            <p className="text-[10px] text-[#6B7384]">≤ 5 min average</p>
          </div>
        </div>
      </motion.div>
    </>
  );
}

const PARTICLES = [
  { x: 12, y: 30, size: 6, color: "#E5C77B", z: 80, opacity: 0.9 },
  { x: 88, y: 22, size: 4, color: "#5B85E5", z: 100, opacity: 0.8 },
  { x: 20, y: 78, size: 5, color: "#1E5BD6", z: 60, opacity: 0.7 },
  { x: 78, y: 70, size: 7, color: "#C9A24B", z: 120, opacity: 0.85 },
  { x: 50, y: 12, size: 3, color: "#ffffff", z: 140, opacity: 1 },
  { x: 92, y: 50, size: 4, color: "#E5C77B", z: 90, opacity: 0.75 },
  { x: 8, y: 55, size: 5, color: "#5B85E5", z: 110, opacity: 0.8 },
  { x: 60, y: 88, size: 3, color: "#ffffff", z: 70, opacity: 0.9 },
];
