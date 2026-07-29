"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  type MotionValue,
} from "framer-motion";

/* ============================================================
   GiftCard3D — the "All Star Burgers" style stage object.
   A gift card rendered as a real 3D object:
     - perspective context on .stage
     - preserve-3d on .scene
     - each visual element is a .layer translated along Z
   Two drivers:
     1) SCROLL: a Framer scroll timeline maps page scroll → rotation,
        translateZ separation (exploded view), and opacity (scenes).
     2) MOUSE: pointer position springs a subtle tilt (parallax).
   ============================================================ */

export default function GiftCard3D() {
  const ref = useRef<HTMLDivElement>(null);

  // ── Scroll timeline (drives the 4 scenes) ──
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const scroll = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.4,
  });

  // Card stack rotation + exploded separation.
  const scrollRotateX = useTransform(scroll, [0, 1], [8, -22]);
  const scrollRotateY = useTransform(scroll, [0, 1], [-18, 22]);
  const sceneScale = useTransform(scroll, [0, 0.5, 1], [1, 1.05, 0.92]);

  // Per-layer Z separation (exploded view) — peaks mid-scroll.
  // Typed as a mutable tuple so it satisfies Framer's InputRange type.
  const explodeCurve: [number, number, number, number] = [0, 0.45, 0.55, 1];
  const frontZ = useTransform(scroll, explodeCurve, [0, 90, 90, 40]);
  const midZ = useTransform(scroll, explodeCurve, [0, 40, 40, 20]);
  const backZ = useTransform(scroll, explodeCurve, [0, -70, -70, -30]);
  const glowOpacity = useTransform(scroll, [0, 0.5, 1], [0.5, 0.9, 0.3]);
  const glowScale = useTransform(scroll, [0, 0.5, 1], [1, 1.4, 1.1]);

  // Floating accent icons orbit distance.
  const orbitZ = useTransform(scroll, explodeCurve, [60, 140, 140, 80]);

  // ── Mouse parallax ──
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const tiltY = useSpring(useTransform(mx, [-0.5, 0.5], [12, -12]), {
    stiffness: 150,
    damping: 20,
  });
  const tiltX = useSpring(useTransform(my, [-0.5, 0.5], [-10, 10]), {
    stiffness: 150,
    damping: 20,
  });

  // Combine scroll rotation + mouse tilt into single MotionValues.
  // We pass a mutable tuple (not `as const`) so Framer's array-overload matches.
  const rotateX = useTransform(
    [scrollRotateX, tiltX],
    (vals: number[]) => vals[0] + vals[1]
  );
  const rotateY = useTransform(
    [scrollRotateY, tiltY],
    (vals: number[]) => vals[0] + vals[1]
  );

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  }
  function onMouseLeave() {
    mx.set(0);
    my.set(0);
  }

  return (
    <div
      ref={ref}
      className="stage relative mx-auto flex h-[420px] w-full max-w-md items-center justify-center sm:h-[480px] md:h-[520px]"
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      {/* Ambient glow behind the stack */}
      <motion.div
        className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl sm:h-80 sm:w-80"
        style={{
          background:
            "radial-gradient(circle, rgba(47,134,245,0.55) 0%, rgba(124,58,237,0.25) 45%, transparent 70%)",
          opacity: glowOpacity,
          scale: glowScale,
        }}
      />

      {/* The 3D scene */}
      <motion.div
        className="scene relative h-[300px] w-[230px] sm:h-[340px] sm:w-[260px] md:h-[380px] md:w-[290px]"
        style={{
          rotateX,
          rotateY,
          scale: sceneScale,
        }}
      >
        {/* Orbit ring (decorative) */}
        <motion.div
          className="orbit absolute left-1/2 top-1/2 h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 sm:h-[420px] sm:w-[420px]"
          style={{ rotateX: 70, translateZ: orbitZ }}
          aria-hidden
        />

        {/* BACK card — deep brand blue */}
        <motion.div
          className="layer card-face bg-gradient-to-br from-brand-700 via-brand-800 to-brand-950"
          style={{ translateZ: backZ, rotateY: -6, x: -34, y: -8 }}
        >
          <CardFace
            brand="STEAM"
            sub="WALLET CODE"
            amount="$500"
            accent="text-white"
            chip="bg-white/20 text-white"
            iconColor="text-white"
          />
        </motion.div>

        {/* MID card — light blue gradient */}
        <motion.div
          className="layer card-face bg-gradient-to-br from-brand-300 via-brand-400 to-brand-600"
          style={{ translateZ: midZ, rotateY: 8, x: 30, y: 6 }}
        >
          <CardFace
            brand="XBOX"
            sub="GAME PASS"
            amount="$100"
            accent="text-white"
            chip="bg-white/30 text-white"
            iconColor="text-white"
          />
        </motion.div>

        {/* FRONT card — the hero: white-to-blue with the logo mark */}
        <motion.div
          className="layer card-face bg-gradient-to-br from-white via-brand-50 to-brand-100"
          style={{ translateZ: frontZ, x: 2, y: 16 }}
        >
          <CardFace
            brand="BRING GIFT CARD"
            sub="PREMIUM TRADING"
            amount="$1,000"
            accent="text-brand-900"
            chip="bg-brand-500/15 text-brand-700"
            iconColor="text-brand-600"
            featured
          />
        </motion.div>

        {/* Floating accent chips around the stack */}
        <FloatingChip
          className="left-[-10%] top-[8%]"
          label="Instant Payout"
          z={orbitZ}
          delay={0}
          color="text-emerald-300"
        />
        <FloatingChip
          className="right-[-12%] top-[28%]"
          label="Live Rates"
          z={orbitZ}
          delay={1.2}
          color="text-amber-200"
        />
        <FloatingChip
          className="bottom-[6%] left-[2%]"
          label="24/7 Global"
          z={orbitZ}
          delay={0.6}
          color="text-brand-200"
        />

        {/* Particles */}
        {PARTICLES.map((p, i) => (
          <motion.span
            key={i}
            className="particle"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              background: p.color,
              translateZ: orbitZ,
              opacity: glowOpacity,
            }}
            animate={{ y: [0, -16, 0], x: [0, 8, 0] }}
            transition={{
              duration: p.dur,
              repeat: Infinity,
              ease: "easeInOut",
              delay: p.delay,
            }}
          />
        ))}
      </motion.div>

      {/* Ground reflection shadow */}
      <div className="pointer-events-none absolute bottom-6 left-1/2 h-8 w-48 -translate-x-1/2 rounded-[100%] bg-black/60 blur-xl sm:w-64" />
    </div>
  );
}

/* ---------- Card face content (SVG/CSS only) ---------- */
function CardFace({
  brand,
  sub,
  amount,
  accent,
  chip,
  iconColor,
  featured,
}: {
  brand: string;
  sub: string;
  amount: string;
  accent: string;
  chip: string;
  iconColor: string;
  featured?: boolean;
}) {
  return (
    <div className="flex h-full w-full flex-col justify-between p-4 sm:p-5">
      <div className="flex items-start justify-between">
        {/* Contactless / brand mark */}
        <svg viewBox="0 0 24 24" className={`h-6 w-6 ${iconColor}`} fill="none">
          <path
            d="M8.5 8.5a5 5 0 0 1 0 7M11 6a8 8 0 0 1 0 12M13.5 3.5a11 11 0 0 1 0 17"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
        <span className={`font-mono text-xs font-black ${accent} sm:text-sm`}>
          {amount}
        </span>
      </div>

      {/* Center chip */}
      <div className="flex justify-center">
        <div
          className={`rounded-md px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest ${chip}`}
        >
          {featured ? "Instant Payout" : "Verified"}
        </div>
      </div>

      <div className="flex items-end justify-between">
        <div>
          <p className={`text-[9px] uppercase tracking-[0.2em] font-semibold ${accent} opacity-80`}>
            {sub}
          </p>
          <p className={`text-sm font-black tracking-wide ${accent} sm:text-base`}>
            {brand}
          </p>
        </div>
        {/* Card number dots — never real digits */}
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <span key={i} className={`h-1.5 w-1.5 rounded-full ${accent} opacity-60`} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- Floating chip wrapper ---------- */
function FloatingChip({
  className,
  label,
  z,
  delay,
  color,
}: {
  className: string;
  label: string;
  z: MotionValue<number>;
  delay: number;
  color: string;
}) {
  return (
    <motion.div
      className={`layer absolute ${className}`}
      style={{ translateZ: z }}
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay }}
    >
      <div className="glass-pill rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider shadow-lg">
        <span className={color}>● {label}</span>
      </div>
    </motion.div>
  );
}

/* ---------- Helpers ---------- */

const PARTICLES = [
  { x: 12, y: 18, size: 6, color: "rgba(47,134,245,0.9)", dur: 5, delay: 0 },
  { x: 84, y: 22, size: 4, color: "rgba(245,158,11,0.9)", dur: 6, delay: 0.5 },
  { x: 20, y: 78, size: 5, color: "rgba(16,185,129,0.9)", dur: 5.5, delay: 1 },
  { x: 78, y: 74, size: 3, color: "rgba(196,181,253,0.9)", dur: 7, delay: 1.5 },
  { x: 50, y: 10, size: 4, color: "rgba(255,255,255,0.85)", dur: 6.5, delay: 0.8 },
  { x: 92, y: 50, size: 3, color: "rgba(47,134,245,0.8)", dur: 5.5, delay: 2 },
];
