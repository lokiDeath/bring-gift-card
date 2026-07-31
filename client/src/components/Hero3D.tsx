import { useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { ShieldCheck, Zap } from "lucide-react";

/**
 * Premium hero showcase — three realistic gift cards
 * (Apple, Amazon, Google Play) arranged in a TIGHT HAND-HELD FAN, matching
 * the reference layout provided by the user:
 *
 *   - Three identical-sized cards
 *   - Rotated counter-clockwise relative to each other (~18° apart)
 *   - Significant overlap (~30%)
 *   - Front card most upright (~-18°), back card most angled (~-54°)
 *   - Tight, not wide-spread — looks like a deck pinched between fingers
 *
 * Interaction:
 *   - Click ANY card → the whole fan toggles between SPREAD (fan) and STACKED
 *     (cards collapse to a neat pile). No separate button — the cards
 *     themselves are the control.
 *
 * Cards are designed to look like REAL gift cards (no chip, no card number,
 * no cardholder, no expiry) — only brand identity + tagline.
 */
export function Hero3D() {
  const ref = useRef<HTMLDivElement>(null);
  const [spread, setSpread] = useState(true);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 24,
    mass: 0.6,
  });

  // Backdrop glow.
  const glowOpacity = useTransform(progress, [0, 0.5, 1], [0.55, 0.85, 0.35]);
  const glowScale = useTransform(progress, [0, 1], [1, 1.2]);

  // Whole scene lifts subtly with scroll.
  const sceneY = useTransform(progress, [0, 1], [0, -40]);

  // Floating chips parallax.
  const chipLeftY = useTransform(progress, [0, 1], [0, -120]);
  const chipRightY = useTransform(progress, [0, 1], [0, 80]);

  // SPREAD positions — counter-clockwise fan with significant overlap.
  // Card 1 (FRONT, Apple): upright, tilted left ~-18°
  // Card 2 (MIDDLE, Amazon): more tilted ~-36°, offset down-left
  // Card 3 (BACK, Google Play): most tilted ~-54°, offset further down-left
  // Tight overlap: ~30% of card surface visible per layer
  const OFFSET_X = 80;   // small horizontal stagger
  const OFFSET_Y = 56;   // vertical stagger creates the "fan" feel

  // STACK positions — all aligned, only tiny rotation hints.
  const spread1 = { x: 30, y: -40, rotate: -18, zIndex: 30, scale: 1 };
  const spread2 = { x: -25, y: 0, rotate: -36, zIndex: 20, scale: 1 };
  const spread3 = { x: -80, y: 40, rotate: -54, zIndex: 10, scale: 1 };

  const stacked1 = { x: 0, y: -10, rotate: -4, zIndex: 30, scale: 1 };
  const stacked2 = { x: 0, y: 0, rotate: 0, zIndex: 20, scale: 1 };
  const stacked3 = { x: 0, y: 10, rotate: 4, zIndex: 10, scale: 1 };

  const card1Target = spread ? spread1 : stacked1;
  const card2Target = spread ? spread2 : stacked2;
  const card3Target = spread ? spread3 : stacked3;

  return (
    <div ref={ref} className="relative h-[680px] w-full perspective-2000 sm:h-[720px]">
      {/* Backdrop glow (royal blue + gold) */}
      <motion.div
        style={{ opacity: glowOpacity, scale: glowScale }}
        className="pointer-events-none absolute left-1/2 top-1/2 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#1E5BD6] blur-[120px]"
      />
      <motion.div
        style={{ opacity: glowOpacity }}
        className="pointer-events-none absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#C9A24B]/25 blur-[110px]"
      />

      {/* Hint label — tells user cards are interactive */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: spread ? 0.5 : 0.7 }}
        transition={{ duration: 0.4 }}
        className="pointer-events-none absolute bottom-8 left-1/2 z-40 -translate-x-1/2 text-[11px] font-medium uppercase tracking-[0.25em] text-white/60"
      >
        {spread ? "Tap a card to stack" : "Tap a card to spread"}
      </motion.div>

      {/* Card fan */}
      <motion.div
        style={{ y: sceneY }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      >
        <div className="relative h-[460px] w-[640px] sm:h-[500px] sm:w-[700px]">
          {/* Ground shadow */}
          <div
            className="absolute -bottom-4 left-1/2 h-12 w-[70%] -translate-x-1/2 rounded-[50%] bg-black/50 blur-2xl"
            aria-hidden
          />

          {/* Card 3 — BACK (Google Play) */}
          <motion.div
            className="absolute left-1/2 top-1/2 cursor-pointer"
            onClick={() => setSpread((s) => !s)}
            animate={card3Target}
            transition={{ type: "spring", stiffness: 140, damping: 18, mass: 0.9 }}
            style={{ x: OFFSET_X * -2, y: OFFSET_Y * 2 }}
            whileHover={spread ? { scale: 1.04, y: OFFSET_Y * 2 - 12 } : { scale: 1.04 }}
          >
            <div className="-translate-x-1/2 -translate-y-1/2">
              <GooglePlayCard />
            </div>
          </motion.div>

          {/* Card 2 — MIDDLE (Amazon) */}
          <motion.div
            className="absolute left-1/2 top-1/2 cursor-pointer"
            onClick={() => setSpread((s) => !s)}
            animate={card2Target}
            transition={{ type: "spring", stiffness: 140, damping: 18, mass: 0.9 }}
            style={{ x: OFFSET_X * -1, y: OFFSET_Y }}
            whileHover={spread ? { scale: 1.04, y: OFFSET_Y - 12 } : { scale: 1.04 }}
          >
            <div className="-translate-x-1/2 -translate-y-1/2">
              <AmazonCard />
            </div>
          </motion.div>

          {/* Card 1 — FRONT (Apple) */}
          <motion.div
            className="absolute left-1/2 top-1/2 cursor-pointer"
            onClick={() => setSpread((s) => !s)}
            animate={card1Target}
            transition={{ type: "spring", stiffness: 140, damping: 18, mass: 0.9 }}
            style={{ x: 0, y: 0 }}
            whileHover={spread ? { scale: 1.04, y: -12 } : { scale: 1.04 }}
          >
            <div className="-translate-x-1/2 -translate-y-1/2">
              <AppleCard />
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Floating feature chips */}
      <motion.div
        style={{ y: chipLeftY, opacity: spread ? 1 : 0 }}
        className="absolute left-0 top-1/2 hidden -translate-y-1/2 transition-opacity duration-300 sm:block"
      >
        <div className="flex items-center gap-2 rounded-2xl bg-white/85 p-3 shadow-xl ring-1 ring-black/5 backdrop-blur">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0047AB]/10 text-[#0047AB]">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#0A1224]">100% secure</p>
            <p className="text-[10px] text-[#6B7384]">Bank-grade encryption</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        style={{ y: chipRightY, opacity: spread ? 1 : 0 }}
        className="absolute right-0 top-1/3 hidden transition-opacity duration-300 sm:block"
      >
        <div className="flex items-center gap-2 rounded-2xl bg-white/85 p-3 shadow-xl ring-1 ring-black/5 backdrop-blur">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#C9A24B]/15 text-[#C9A24B]">
            <Zap className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#0A1224]">Instant pay</p>
            <p className="text-[10px] text-[#6B7384]">≤ 5 min average</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* =========================================================================
   CARD DIMENSIONS — gift-card aspect ratio (1.586 : 1, same as credit card)
   ========================================================================= */
const CARD_W = 440;
const CARD_H = Math.round(CARD_W / 1.586); // ~277

interface CardProps {
  children: React.ReactNode;
  background: React.ReactNode;
}

function CardShell({ children, background }: CardProps) {
  return (
    <div
      className="relative overflow-hidden rounded-3xl shadow-[0_40px_90px_-20px_rgba(0,0,0,0.6)] ring-1 ring-black/10"
      style={{ width: CARD_W, height: CARD_H, transformStyle: "preserve-3d" }}
    >
      {/* Background layer */}
      {background}
      {/* Foreground content */}
      <div className="absolute inset-0 p-7">{children}</div>
      {/* Subtle top sheen */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-t-3xl"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0) 100%)",
        }}
      />
    </div>
  );
}

/* =========================================================================
   APPLE GIFT CARD — based on reference: white card, "The gift card for
   everything Apple" text up top, large colorful scribble Apple logo below.
   ========================================================================= */
function AppleCard() {
  return (
    <CardShell
      background={
        <>
          <div className="absolute inset-0 bg-white" />
          {/* Very subtle warm corner glow */}
          <div
            className="absolute inset-0 opacity-50"
            style={{
              background:
                "radial-gradient(circle at 80% 20%, rgba(255,200,220,0.18), transparent 50%), radial-gradient(circle at 20% 80%, rgba(200,220,255,0.18), transparent 50%)",
            }}
          />
        </>
      }
    >
      <div className="flex h-full flex-col items-center justify-between py-2 text-center">
        {/* Top: tagline */}
        <div className="pt-2">
          <p className="font-display text-[22px] font-normal leading-tight text-[#1D1D1F]">
            The gift card for
          </p>
          <p className="font-display text-[22px] font-semibold leading-tight text-[#1D1D1F]">
            everything Apple.
          </p>
        </div>

        {/* Center: colorful scribble Apple logo */}
        <AppleScribbleLogo className="h-32 w-32" />

        {/* Bottom: small text */}
        <p className="pb-1 text-[10px] font-medium uppercase tracking-[0.25em] text-[#86868B]">
          App Store · iTunes
        </p>
      </div>
    </CardShell>
  );
}

/**
 * Apple "scribble" logo — the colorful hand-drawn variant introduced in 2021.
 * Built as overlapping colored strokes inside the Apple silhouette path.
 */
function AppleScribbleLogo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      <defs>
        {/* Clip to Apple silhouette */}
        <clipPath id="apple-clip">
          <path d="M74.05 84.28c-3.98 3.85-8.05 3.49-11.92 1.74-4.23-1.83-8.09-1.95-12.56 0-5.59 2.38-8.55 1.69-11.88-1.74C9.79 62.25 12.51 30.59 35.05 30.31c5.35.07 9.09 2.96 12.18 3.21 4.66-.97 9.16-3.79 14.07-3.43 5.96.48 10.46 2.92 13.45 7.31-12.36 7.61-9.44 24.18 1.94 28.55-2.30 5.99-5.31 11.97-10.18 16.18zM47.03 30.25c-.59-9.06 6.65-16.46 14.74-17.21 1.16 9.49-9.20 17.16-14.74 17.21z" />
        </clipPath>
      </defs>

      {/* Background neutral fill so any gap doesn't show transparent */}
      <path
        d="M74.05 84.28c-3.98 3.85-8.05 3.49-11.92 1.74-4.23-1.83-8.09-1.95-12.56 0-5.59 2.38-8.55 1.69-11.88-1.74C9.79 62.25 12.51 30.59 35.05 30.31c5.35.07 9.09 2.96 12.18 3.21 4.66-.97 9.16-3.79 14.07-3.43 5.96.48 10.46 2.92 13.45 7.31-12.36 7.61-9.44 24.18 1.94 28.55-2.30 5.99-5.31 11.97-10.18 16.18zM47.03 30.25c-.59-9.06 6.65-16.46 14.74-17.21 1.16 9.49-9.20 17.16-14.74 17.21z"
        fill="#F5F5F7"
      />

      {/* Colorful strokes clipped to Apple shape */}
      <g clipPath="url(#apple-clip)" stroke="none">
        {/* Yellow + lime (top-left lobe) */}
        <rect x="20" y="20" width="35" height="30" fill="#FFD700" />
        <rect x="20" y="35" width="35" height="20" fill="#ADFF2F" />

        {/* Teal/cyan (top-center) */}
        <rect x="40" y="18" width="30" height="30" fill="#00CED1" />

        {/* Pink/magenta (center) */}
        <rect x="35" y="38" width="40" height="30" fill="#FF1493" />

        {/* Orange-red (right) */}
        <rect x="55" y="20" width="35" height="50" fill="#FF6347" />

        {/* Deep purple (bottom) */}
        <rect x="25" y="60" width="60" height="30" fill="#8A2BE2" />

        {/* Blue/purple (leaf top) */}
        <rect x="45" y="8" width="20" height="20" fill="#5B86E5" />

        {/* Pink/magenta (leaf bottom) */}
        <rect x="45" y="18" width="20" height="12" fill="#FF69B4" />
      </g>

      {/* Subtle scribble texture lines on top */}
      <g
        clipPath="url(#apple-clip)"
        stroke="rgba(255,255,255,0.25)"
        strokeWidth="1.2"
        fill="none"
      >
        <path d="M22 28 Q 50 22, 80 28" />
        <path d="M22 45 Q 50 39, 80 45" />
        <path d="M22 60 Q 50 54, 80 60" />
        <path d="M22 75 Q 50 69, 80 75" />
      </g>

      {/* Outline so edges are crisp */}
      <path
        d="M74.05 84.28c-3.98 3.85-8.05 3.49-11.92 1.74-4.23-1.83-8.09-1.95-12.56 0-5.59 2.38-8.55 1.69-11.88-1.74C9.79 62.25 12.51 30.59 35.05 30.31c5.35.07 9.09 2.96 12.18 3.21 4.66-.97 9.16-3.79 14.07-3.43 5.96.48 10.46 2.92 13.45 7.31-12.36 7.61-9.44 24.18 1.94 28.55-2.30 5.99-5.31 11.97-10.18 16.18zM47.03 30.25c-.59-9.06 6.65-16.46 14.74-17.21 1.16 9.49-9.20 17.16-14.74 17.21z"
        fill="none"
        stroke="rgba(0,0,0,0.08)"
        strokeWidth="1"
      />
    </svg>
  );
}

/* =========================================================================
   AMAZON GIFT CARD — based on reference: dark charcoal (#131921) card,
   centered white "amazon" wordmark with orange smile/arrow underneath.
   ========================================================================= */
function AmazonCard() {
  return (
    <CardShell
      background={
        <>
          <div className="absolute inset-0 bg-[#131921]" />
          {/* Subtle radial highlight */}
          <div
            className="absolute inset-0 opacity-40"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, rgba(255,153,0,0.08), transparent 60%)",
            }}
          />
          {/* Top sheen */}
          <div
            className="absolute inset-x-0 top-0 h-1/3"
            style={{
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, transparent 100%)",
            }}
          />
        </>
      }
    >
      <div className="flex h-full flex-col items-center justify-center text-center">
        {/* Center: amazon wordmark + smile */}
        <AmazonWordmarkLarge />

        {/* Bottom: small tagline */}
        <p className="absolute bottom-7 left-1/2 -translate-x-1/2 text-[10px] font-medium uppercase tracking-[0.3em] text-white/40">
          Gift Card
        </p>
      </div>
    </CardShell>
  );
}

function AmazonWordmarkLarge() {
  // "amazon" lowercase wordmark with the signature smile/arrow underneath.
  return (
    <svg viewBox="0 0 200 80" className="w-[80%] max-w-[320px]" aria-hidden>
      {/* "amazon" wordmark — bold lowercase */}
      <text
        x="100"
        y="38"
        fontFamily="Arial, Helvetica, sans-serif"
        fontSize="44"
        fontWeight="700"
        fill="white"
        textAnchor="middle"
        letterSpacing="-1"
      >
        amazon
      </text>
      {/* Smile/arrow — curved stroke + arrowhead */}
      <path
        d="M40 50 Q 100 68, 160 50"
        stroke="#FF9900"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />
      {/* Arrow head — points up-right at the end of the smile */}
      <path
        d="M150 42 L 162 50 L 152 60"
        stroke="#FF9900"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* =========================================================================
   GOOGLE PLAY GIFT CARD — based on reference: white card, multicolor
   Google Play triangle logo centered upper, "Google Play" text below in grey.
   ========================================================================= */
function GooglePlayCard() {
  return (
    <CardShell
      background={
        <>
          <div className="absolute inset-0 bg-white" />
          {/* Subtle holographic sweep */}
          <div
            className="absolute -inset-10 opacity-40"
            style={{
              background:
                "linear-gradient(115deg, transparent 30%, rgba(0,197,255,0.08) 45%, rgba(0,230,118,0.08) 55%, rgba(255,193,7,0.08) 65%, rgba(255,61,0,0.08) 75%, transparent 90%)",
            }}
          />
        </>
      }
    >
      <div className="flex h-full flex-col items-center justify-center gap-5 text-center">
        {/* Logo — Google Play triangle, large */}
        <GooglePlayTriangleLarge className="h-24 w-24" />

        {/* Brand text */}
        <div>
          <p className="font-display text-[28px] font-medium leading-tight text-[#5F6368]" style={{ letterSpacing: "-0.5px" }}>
            Google Play
          </p>
          <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.3em] text-[#9AA0A6]">
            Apps · Games · Movies
          </p>
        </div>
      </div>
    </CardShell>
  );
}

function GooglePlayTriangleLarge({ className = "" }: { className?: string }) {
  // The Google Play triangle is made of 4 colored segments.
  // Colors from the reference: green #4CAF50, blue #2196F3, red #F44336, yellow #FFC107.
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      {/* Top segment — green */}
      <path
        d="M22 12 L 50 44 L 62 36 L 30 8 C 26.5 6, 23.5 8, 22 12 Z"
        fill="#4CAF50"
      />
      {/* Left segment — blue */}
      <path
        d="M22 12 C 21 16, 21 84, 22 88 L 50 56 L 50 44 Z"
        fill="#2196F3"
      />
      {/* Bottom segment — red */}
      <path
        d="M22 88 C 23.5 92, 26.5 94, 30 92 L 62 64 L 50 56 Z"
        fill="#F44336"
      />
      {/* Right segment — yellow (the pointed tip) */}
      <path
        d="M30 8 L 62 36 L 78 45 C 82 47, 82 53, 78 55 L 62 64 L 30 92 Z M50 44 L 50 56 L 62 50 Z"
        fill="#FFC107"
      />
      {/* Center notch (slight darker for depth) */}
      <path
        d="M50 44 L 62 50 L 50 56 Z"
        fill="rgba(0,0,0,0.08)"
      />
    </svg>
  );
}
