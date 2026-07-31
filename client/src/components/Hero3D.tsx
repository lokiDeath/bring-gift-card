import { useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { ShieldCheck, Zap } from "lucide-react";

/**
 * Premium hero showcase — three realistic gift cards
 * (Apple, Amazon, Google Play) in a WIDE SPREAD fan.
 *
 * Click cycle (simple alternating toggle):
 *   State 0 (default): SPREAD DOWN  (back cards rotated+offset DOWN)
 *   Click → State 1:   STACKED      (all aligned)
 *   Click → State 2:   SPREAD UP    (back cards rotated+offset UP)
 *   Click → State 3:   STACKED
 *   Click → State 0:   SPREAD DOWN  (cycle repeats)
 *
 * The "100% Secure" and "Instant Pay" badges are POSITIONED ABSOLUTELY
 * relative to the card-area container (NOT attached to any card), so they
 * float in the same spot no matter what state the cards are in.
 *
 * A continuous gentle floating animation makes the whole stack hover.
 */
export function Hero3D() {
  const ref = useRef<HTMLDivElement>(null);
  const [clickCount, setClickCount] = useState(0);

  // 4-state cycle: 0=spread-down, 1=stack, 2=spread-up, 3=stack
  const phase = clickCount % 4;
  const isStacked = phase === 1 || phase === 3;
  const isSpreadUp = phase === 2;

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

  // Scroll parallax for the whole scene.
  const sceneY = useTransform(progress, [0, 1], [0, -40]);

  // ── Wide spread layout (matching the original fan) ──
  // SPREAD: 3 cards fanned wide, each rotated ~22° apart, offset horizontally.
  // The back cards lift/drop based on direction (UP or DOWN).
  const dir = isSpreadUp ? -1 : 1; // -1 = up, 1 = down
  const SPREAD_OFFSET_Y = 100; // how far back cards offset vertically
  const SPREAD_OFFSET_X = 220; // how far back cards offset horizontally

  // Card 1 (FRONT, Apple): center, slight rotation
  const card1Target = isStacked
    ? { x: 0, y: -8, rotate: -3, zIndex: 30, scale: 1 }
    : { x: 0, y: 0, rotate: -16, zIndex: 30, scale: 1 };

  // Card 2 (MIDDLE, Amazon): left of center, more rotation, vertical offset
  const card2Target = isStacked
    ? { x: 0, y: 0, rotate: 0, zIndex: 20, scale: 1 }
    : {
        x: -SPREAD_OFFSET_X,
        y: SPREAD_OFFSET_Y * dir,
        rotate: -32,
        zIndex: 20,
        scale: 1,
      };

  // Card 3 (BACK, Google Play): far left, most rotation, bigger vertical offset
  const card3Target = isStacked
    ? { x: 0, y: 8, rotate: 3, zIndex: 10, scale: 1 }
    : {
        x: -SPREAD_OFFSET_X * 2,
        y: SPREAD_OFFSET_Y * 2 * dir,
        rotate: -48,
        zIndex: 10,
        scale: 1,
      };

  const spring = { type: "spring" as const, stiffness: 140, damping: 18, mass: 0.9 };

  return (
    <div
      ref={ref}
      className="absolute inset-0 perspective-2000"
      style={{ pointerEvents: "none" }}
    >
      {/* Backdrop glow */}
      <motion.div
        style={{ opacity: glowOpacity, scale: glowScale }}
        className="pointer-events-none absolute left-1/2 top-1/2 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#1E5BD6] blur-[120px]"
      />
      <motion.div
        style={{ opacity: glowOpacity }}
        className="pointer-events-none absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#C9A24B]/25 blur-[110px]"
      />

      {/* Inner wrapper re-enables pointer events for the cards.
          Positioned at the right side of the hero (where the grid column
          would have been) but with a wider width so the spread-out cards
          actually fit. */}
      <div
        className="absolute top-1/2 -translate-y-1/2"
        style={{
          left: "55%",
          right: "4%",
          height: "680px",
          pointerEvents: "auto",
        }}
      >

      {/* Scroll parallax wrapper */}
      <motion.div
        style={{ y: sceneY }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      >
        {/* Floating animation wrapper — continuous gentle hover */}
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Card-area container — badges are positioned relative to THIS,
              so they stay in the same spot regardless of card state. */}
          <div className="relative h-[460px] w-[900px] sm:h-[500px] sm:w-[1000px]">
            {/* Ground shadow */}
            <div
              className="absolute -bottom-4 left-1/2 h-12 w-[70%] -translate-x-1/2 rounded-[50%] bg-black/50 blur-2xl"
              aria-hidden
            />

            {/* Card 3 — BACK (Google Play) */}
            <motion.div
              className="absolute left-1/2 top-1/2 cursor-pointer"
              onClick={() => setClickCount((c) => c + 1)}
              animate={card3Target}
              transition={spring}
              whileHover={{ scale: 1.04 }}
            >
              <div className="-translate-x-1/2 -translate-y-1/2">
                <GooglePlayCard />
              </div>
            </motion.div>

            {/* Card 2 — MIDDLE (Amazon) */}
            <motion.div
              className="absolute left-1/2 top-1/2 cursor-pointer"
              onClick={() => setClickCount((c) => c + 1)}
              animate={card2Target}
              transition={spring}
              whileHover={{ scale: 1.04 }}
            >
              <div className="-translate-x-1/2 -translate-y-1/2">
                <AmazonCard />
              </div>
            </motion.div>

            {/* Card 1 — FRONT (Apple) */}
            <motion.div
              className="absolute left-1/2 top-1/2 cursor-pointer"
              onClick={() => setClickCount((c) => c + 1)}
              animate={card1Target}
              transition={spring}
              whileHover={{ scale: 1.04 }}
            >
              <div className="-translate-x-1/2 -translate-y-1/2">
                <AppleCard />
              </div>
            </motion.div>

            {/* Floating badges — positioned on the LEFT and RIGHT sides of
                the front card, slightly overlapping its edges. They float
                independently of the card state (always in the same spot
                relative to the card-area container). */}
            <div className="pointer-events-none absolute left-[28%] top-[38%] z-50">
              <div className="flex -translate-x-1/2 items-center gap-2 rounded-2xl bg-white/90 p-2.5 shadow-xl ring-1 ring-black/5 backdrop-blur">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0047AB]/10 text-[#0047AB]">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-[#0A1224]">100% Secure</p>
                  <p className="text-[9px] text-[#6B7384]">Bank-grade encryption</p>
                </div>
              </div>
            </div>

            <div className="pointer-events-none absolute right-[28%] top-[42%] z-50">
              <div className="flex translate-x-1/2 items-center gap-2 rounded-2xl bg-white/90 p-2.5 shadow-xl ring-1 ring-black/5 backdrop-blur">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#C9A24B]/15 text-[#C9A24B]">
                  <Zap className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-[#0A1224]">Instant Pay</p>
                  <p className="text-[9px] text-[#6B7384]">≤ 5 min average</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
      </div>
    </div>
  );
}

/* =========================================================================
   CARD DIMENSIONS — gift-card aspect ratio (1.586 : 1)
   ========================================================================= */
const CARD_W = 440;
const CARD_H = Math.round(CARD_W / 1.586); // ~277

interface CardProps {
  children: React.ReactNode;
  background: React.ReactNode;
  /** Show the massive transparent logo watermark on this card. Default true. */
  withWatermark?: boolean;
}

/**
 * CardShell — the shared card frame.
 *
 * Contains a MASSIVE transparent logo watermark using mix-blend-mode: screen.
 * Only the white parts of the logo show through; the transparent background
 * of the PNG is invisible. The watermark sits at z-index 0; the card content
 * (text, logos) sits at z-index 10 so it's always on top.
 *
 * Pass `withWatermark={false}` to skip the watermark (used on the Amazon card
 * where the user explicitly requested it be removed).
 */
function CardShell({ children, background, withWatermark = true }: CardProps) {
  return (
    <div
      className="relative overflow-hidden rounded-3xl shadow-[0_40px_90px_-20px_rgba(0,0,0,0.6)] ring-1 ring-black/10"
      style={{ width: CARD_W, height: CARD_H, transformStyle: "preserve-3d" }}
    >
      {/* Background layer */}
      {background}

      {/* Massive transparent logo watermark (optional) */}
      {withWatermark && (
        <img
          src="/logo-transparent.png"
          alt=""
          aria-hidden
          draggable={false}
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 object-contain"
          style={{
            width: "150%",
            height: "150%",
            mixBlendMode: "screen",
            opacity: 0.3,
            zIndex: 0,
          }}
        />
      )}

      {/* Subtle top sheen */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-t-3xl"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0) 100%)",
          zIndex: 5,
        }}
      />

      {/* Foreground content — on top of the watermark */}
      <div className="absolute inset-0 p-7" style={{ position: "relative", zIndex: 10 }}>
        {children}
      </div>
    </div>
  );
}

/* =========================================================================
   APPLE GIFT CARD — white card, "The gift card for everything Apple" text,
   colorful scribble Apple logo.
   ========================================================================= */
function AppleCard() {
  return (
    <CardShell
      background={
        <>
          <div className="absolute inset-0 bg-white" />
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
        <div className="pt-2">
          <p className="font-display text-[22px] font-normal leading-tight text-[#1D1D1F]">
            The gift card for
          </p>
          <p className="font-display text-[22px] font-semibold leading-tight text-[#1D1D1F]">
            everything Apple.
          </p>
        </div>
        <AppleScribbleLogo className="h-32 w-32" />
        <p className="pb-1 text-[10px] font-medium uppercase tracking-[0.25em] text-[#86868B]">
          App Store · iTunes
        </p>
      </div>
    </CardShell>
  );
}

function AppleScribbleLogo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      <defs>
        <clipPath id="apple-clip">
          <path d="M74.05 84.28c-3.98 3.85-8.05 3.49-11.92 1.74-4.23-1.83-8.09-1.95-12.56 0-5.59 2.38-8.55 1.69-11.88-1.74C9.79 62.25 12.51 30.59 35.05 30.31c5.35.07 9.09 2.96 12.18 3.21 4.66-.97 9.16-3.79 14.07-3.43 5.96.48 10.46 2.92 13.45 7.31-12.36 7.61-9.44 24.18 1.94 28.55-2.30 5.99-5.31 11.97-10.18 16.18zM47.03 30.25c-.59-9.06 6.65-16.46 14.74-17.21 1.16 9.49-9.20 17.16-14.74 17.21z" />
        </clipPath>
      </defs>
      <path
        d="M74.05 84.28c-3.98 3.85-8.05 3.49-11.92 1.74-4.23-1.83-8.09-1.95-12.56 0-5.59 2.38-8.55 1.69-11.88-1.74C9.79 62.25 12.51 30.59 35.05 30.31c5.35.07 9.09 2.96 12.18 3.21 4.66-.97 9.16-3.79 14.07-3.43 5.96.48 10.46 2.92 13.45 7.31-12.36 7.61-9.44 24.18 1.94 28.55-2.30 5.99-5.31 11.97-10.18 16.18zM47.03 30.25c-.59-9.06 6.65-16.46 14.74-17.21 1.16 9.49-9.20 17.16-14.74 17.21z"
        fill="#F5F5F7"
      />
      <g clipPath="url(#apple-clip)" stroke="none">
        <rect x="20" y="20" width="35" height="30" fill="#FFD700" />
        <rect x="20" y="35" width="35" height="20" fill="#ADFF2F" />
        <rect x="40" y="18" width="30" height="30" fill="#00CED1" />
        <rect x="35" y="38" width="40" height="30" fill="#FF1493" />
        <rect x="55" y="20" width="35" height="50" fill="#FF6347" />
        <rect x="25" y="60" width="60" height="30" fill="#8A2BE2" />
        <rect x="45" y="8" width="20" height="20" fill="#5B86E5" />
        <rect x="45" y="18" width="20" height="12" fill="#FF69B4" />
      </g>
      <g clipPath="url(#apple-clip)" stroke="rgba(255,255,255,0.25)" strokeWidth="1.2" fill="none">
        <path d="M22 28 Q 50 22, 80 28" />
        <path d="M22 45 Q 50 39, 80 45" />
        <path d="M22 60 Q 50 54, 80 60" />
        <path d="M22 75 Q 50 69, 80 75" />
      </g>
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
   AMAZON GIFT CARD — clean dark charcoal background, centered white
   "amazon" wordmark with the signature orange smile/arrow underneath.
   NO tagline, NO watermark (per user request).
   ========================================================================= */
function AmazonCard() {
  return (
    <CardShell
      withWatermark={false}
      background={
        <>
          <div className="absolute inset-0 bg-[#131921]" />
          {/* Very subtle radial highlight to give the card depth */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              background:
                "radial-gradient(ellipse at 50% 40%, rgba(255,255,255,0.04), transparent 70%)",
            }}
          />
        </>
      }
    >
      <div className="flex h-full items-center justify-center">
        <AmazonWordmarkLarge />
      </div>
    </CardShell>
  );
}

function AmazonWordmarkLarge() {
  return (
    <svg viewBox="0 0 200 90" className="w-[75%] max-w-[340px]" aria-hidden>
      {/* "amazon" wordmark — bold lowercase, perfectly centered */}
      <text
        x="100"
        y="42"
        fontFamily="Arial, Helvetica, sans-serif"
        fontSize="46"
        fontWeight="700"
        fill="white"
        textAnchor="middle"
        letterSpacing="-1"
      >
        amazon
      </text>
      {/* Smile/arrow — curved stroke from left to right with arrowhead */}
      <path
        d="M30 52 Q 100 76, 170 50"
        stroke="#FF9900"
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
      />
      {/* Arrow head — points up-right at the end of the smile */}
      <path
        d="M158 42 L 172 50 L 161 62"
        stroke="#FF9900"
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* =========================================================================
   GOOGLE PLAY GIFT CARD — clean white background, centered multicolor
   Google Play triangle logo, "Google Play" text below in grey.
   NO tagline — matches the reference image exactly.
   ========================================================================= */
function GooglePlayCard() {
  return (
    <CardShell
      background={
        <>
          <div className="absolute inset-0 bg-white" />
          {/* Very subtle corner glow for depth */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, rgba(0,0,0,0.02), transparent 70%)",
            }}
          />
        </>
      }
    >
      <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
        <GooglePlayTriangleLarge className="h-24 w-24" />
        <p
          className="font-display text-[30px] font-medium leading-tight text-[#5F6368]"
          style={{ letterSpacing: "-0.5px" }}
        >
          Google Play
        </p>
      </div>
    </CardShell>
  );
}

function GooglePlayTriangleLarge({ className = "" }: { className?: string }) {
  // The Google Play triangle — 4 colored segments meeting at an off-center point.
  // Colors from the reference: green #4CAF50, blue #2196F3, red #F44336, yellow #FFC107.
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      {/* Top segment — green */}
      <path d="M22 12 L 50 44 L 62 36 L 30 8 C 26.5 6, 23.5 8, 22 12 Z" fill="#4CAF50" />
      {/* Left segment — blue */}
      <path d="M22 12 C 21 16, 21 84, 22 88 L 50 56 L 50 44 Z" fill="#2196F3" />
      {/* Bottom segment — red */}
      <path d="M22 88 C 23.5 92, 26.5 94, 30 92 L 62 64 L 50 56 Z" fill="#F44336" />
      {/* Right segment — yellow (the pointed tip) */}
      <path
        d="M30 8 L 62 36 L 78 45 C 82 47, 82 53, 78 55 L 62 64 L 30 92 Z M50 44 L 50 56 L 62 50 Z"
        fill="#FFC107"
      />
      {/* Center notch (slight shadow for depth) */}
      <path d="M50 44 L 62 50 L 50 56 Z" fill="rgba(0,0,0,0.08)" />
    </svg>
  );
}
