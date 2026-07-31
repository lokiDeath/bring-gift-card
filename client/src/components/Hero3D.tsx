import { useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { ShieldCheck, Zap, Plus } from "lucide-react";

/**
 * Premium hero showcase — three BIG, REALISTIC gift cards
 * (Apple, Amazon, Google Play) arranged in a wide fan layout.
 *
 * - Default state: SPREAD OUT — all three cards clearly visible.
 * - Click anywhere on the spread → cards COLLAPSE into a neat stack.
 * - Click again → cards SPREAD back out.
 *
 * The whole scene also reacts to scroll for subtle parallax.
 *
 * Cards are designed to look like real gift cards:
 *   - Apple:     clean white + iridescent sheen + Apple logo + "Gift Card"
 *   - Amazon:    squid-ink navy + amazon wordmark with smile/arrow + "Gift Card"
 *   - Google Play: light gradient + Google Play triangle logo + "Gift Card"
 *
 * No credit-card decorations (no chip, no card number, no cardholder, no
 * expiry) — these are GIFT CARDS, not debit/credit cards.
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

  // Card layout configs — when SPREAD vs FOLDED.
  // SPREAD: rotated out wide, lifted to different heights, offset horizontally.
  // FOLDED: stacked tightly, only slight rotation, no horizontal offset.
  const leftRotate = spread ? -22 : 0;
  const leftOffsetX = spread ? -340 : -30;
  const leftOffsetY = spread ? -30 : -8;
  const leftZ = spread ? 10 : 20;

  const centerOffsetY = spread ? -50 : 0;
  const centerScale = spread ? 1 : 0.95;
  const centerZ = 30;

  const rightRotate = spread ? 22 : 0;
  const rightOffsetX = spread ? 340 : 30;
  const rightOffsetY = spread ? -30 : 8;
  const rightZ = spread ? 10 : 20;

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

      {/* Spread/stack toggle button (centered below the fan) */}
      <button
        onClick={() => setSpread((s) => !s)}
        className="absolute bottom-6 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2 rounded-full bg-white/10 px-5 py-2.5 text-xs font-semibold text-white/80 ring-1 ring-white/20 backdrop-blur transition-all hover:bg-white/20 hover:text-white"
        aria-label={spread ? "Stack cards" : "Spread cards"}
      >
        <Plus
          className={`h-3.5 w-3.5 transition-transform duration-500 ${spread ? "rotate-45" : ""}`}
        />
        {spread ? "Stack" : "Spread"}
      </button>

      {/* Card stack */}
      <motion.div
        style={{ y: sceneY }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      >
        <div className="relative h-[460px] w-[700px] sm:h-[500px] sm:w-[760px]">
          {/* Ground shadow */}
          <div
            className="absolute -bottom-2 left-1/2 h-10 w-[80%] -translate-x-1/2 rounded-[50%] bg-black/40 blur-2xl"
            aria-hidden
          />

          {/* LEFT card — Apple */}
          <motion.div
            className="absolute left-1/2 top-1/2"
            animate={{
              x: leftOffsetX,
              y: leftOffsetY,
              rotate: leftRotate,
              zIndex: leftZ,
            }}
            transition={{
              type: "spring",
              stiffness: 120,
              damping: 18,
              mass: 0.9,
            }}
          >
            <div className="-translate-x-1/2 -translate-y-1/2">
              <AppleCard />
            </div>
          </motion.div>

          {/* CENTER card — Amazon (always on top) */}
          <motion.div
            className="absolute left-1/2 top-1/2"
            animate={{
              y: centerOffsetY,
              rotate: 0,
              scale: centerScale,
              zIndex: centerZ,
            }}
            transition={{
              type: "spring",
              stiffness: 120,
              damping: 18,
              mass: 0.9,
            }}
          >
            <div className="-translate-x-1/2 -translate-y-1/2">
              <AmazonCard />
            </div>
          </motion.div>

          {/* RIGHT card — Google Play */}
          <motion.div
            className="absolute left-1/2 top-1/2"
            animate={{
              x: rightOffsetX,
              y: rightOffsetY,
              rotate: rightRotate,
              zIndex: rightZ,
            }}
            transition={{
              type: "spring",
              stiffness: 120,
              damping: 18,
              mass: 0.9,
            }}
          >
            <div className="-translate-x-1/2 -translate-y-1/2">
              <GooglePlayCard />
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Floating feature chips (separate parallax, hidden when folded for cleanliness) */}
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
   CARD DIMENSIONS — big. Same proportions as a real gift card (1.586 : 1).
   ========================================================================= */
const CARD_W = 460;
const CARD_H = Math.round(CARD_W / 1.586); // ~290

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
      {/* Background layer (gradient + brand-specific design) */}
      {background}

      {/* Foreground content (logo + "Gift Card" only) */}
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
   APPLE GIFT CARD
   - Clean white with iridescent sheen
   - Apple logo (large, top-left)
   - "Gift Card" in Apple-style typography
   ========================================================================= */
function AppleCard() {
  return (
    <CardShell
      background={
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-white via-[#F8F8F8] to-[#E8E8E8]" />
          {/* Iridescent sheen */}
          <div
            className="absolute inset-0 opacity-70"
            style={{
              background:
                "linear-gradient(115deg, rgba(255,200,255,0.18) 0%, rgba(200,220,255,0.22) 30%, rgba(255,255,200,0.18) 60%, rgba(200,255,220,0.22) 100%)",
            }}
          />
          {/* Diagonal holographic stripe */}
          <div
            className="absolute -inset-10 opacity-30"
            style={{
              background:
                "repeating-linear-gradient(115deg, transparent 0px, transparent 40px, rgba(180,200,255,0.15) 40px, rgba(180,200,255,0.15) 80px)",
            }}
          />
        </>
      }
    >
      <div className="flex h-full flex-col justify-between text-[#1D1D1F]">
        {/* Top: Apple logo + USD tag */}
        <div className="flex items-start justify-between">
          <AppleLogo className="h-12 w-12 text-[#1D1D1F]" />
          <span className="rounded-full bg-[#1D1D1F] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
            USD
          </span>
        </div>

        {/* Bottom: "Gift Card" wordmark */}
        <div>
          <p className="font-display text-3xl font-medium tracking-tight text-[#1D1D1F]">
            Gift Card
          </p>
          <p className="mt-1 text-xs font-medium uppercase tracking-[0.25em] text-[#86868B]">
            App Store · iTunes
          </p>
        </div>
      </div>
    </CardShell>
  );
}

function AppleLogo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M17.05 20.28c-.98.95-2.05.86-3.08.43-1.09-.45-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.43C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.08zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </svg>
  );
}

/* =========================================================================
   AMAZON GIFT CARD
   - Squid-ink navy background (Amazon's brand color)
   - "amazon" wordmark + orange smile/arrow underneath
   - "Gift Card" in white
   ========================================================================= */
function AmazonCard() {
  return (
    <CardShell
      background={
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-[#232F3E] via-[#1A2535] to-[#0F1825]" />
          {/* Subtle texture */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 30%, rgba(255,153,0,0.1), transparent 50%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.04), transparent 40%)",
            }}
          />
          {/* Top sheen */}
          <div
            className="absolute inset-x-0 top-0 h-1/3"
            style={{
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.08) 0%, transparent 100%)",
            }}
          />
        </>
      }
    >
      <div className="flex h-full flex-col justify-between text-white">
        {/* Top: amazon logo + USD tag */}
        <div className="flex items-start justify-between">
          <div>
            <AmazonWordmark />
            <p className="mt-2 font-display text-[11px] font-medium uppercase tracking-[0.3em] text-white/70">
              Gift Card
            </p>
          </div>
          <span className="rounded-full bg-[#FF9900] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#232F3E]">
            USD
          </span>
        </div>

        {/* Bottom: "Gift Card" wordmark */}
        <div>
          <p className="font-display text-3xl font-semibold tracking-tight text-white">
            Gift Card
          </p>
          <p className="mt-1 text-xs font-medium uppercase tracking-[0.25em] text-white/50">
            Shop millions of items
          </p>
        </div>
      </div>
    </CardShell>
  );
}

function AmazonWordmark() {
  // "amazon" lowercase wordmark with the signature smile/arrow underneath.
  return (
    <svg viewBox="0 0 100 36" className="h-9 w-24" aria-hidden>
      {/* "amazon" wordmark */}
      <text
        x="0"
        y="22"
        fontFamily="Arial, sans-serif"
        fontSize="22"
        fontWeight="700"
        fill="white"
        letterSpacing="-0.5"
      >
        amazon
      </text>
      {/* Smile/arrow */}
      <path
        d="M6 28 Q 50 38, 92 27"
        stroke="#FF9900"
        strokeWidth="2.4"
        fill="none"
        strokeLinecap="round"
      />
      {/* Arrow head */}
      <path
        d="M86 23 L 94 27 L 87 32"
        stroke="#FF9900"
        strokeWidth="2.4"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* =========================================================================
   GOOGLE PLAY GIFT CARD
   - Light gradient background
   - Multi-color Google Play triangle logo
   - "Gift Card" in dark grey
   ========================================================================= */
function GooglePlayCard() {
  return (
    <CardShell
      background={
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-[#FFFFFF] via-[#F5F7FA] to-[#E8ECF2]" />
          {/* Subtle holographic sweep */}
          <div
            className="absolute -inset-10 opacity-50"
            style={{
              background:
                "linear-gradient(115deg, transparent 30%, rgba(0,197,255,0.1) 45%, rgba(0,230,118,0.1) 55%, rgba(255,193,7,0.1) 65%, rgba(255,61,0,0.1) 75%, transparent 90%)",
            }}
          />
        </>
      }
    >
      <div className="flex h-full flex-col justify-between text-[#202124]">
        {/* Top: Google Play logo + USD tag */}
        <div className="flex items-start justify-between">
          <GooglePlayLogo className="h-12 w-12" />
          <span className="rounded-full bg-[#202124] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
            USD
          </span>
        </div>

        {/* Bottom: "Gift Card" wordmark */}
        <div>
          <p className="font-display text-3xl font-semibold tracking-tight text-[#202124]">
            Gift Card
          </p>
          <p className="mt-1 text-xs font-medium uppercase tracking-[0.25em] text-[#5F6368]">
            Play · Apps · Games
          </p>
        </div>
      </div>
    </CardShell>
  );
}

function GooglePlayLogo({ className = "" }: { className?: string }) {
  // The Google Play triangle is made of 4 colored segments.
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      {/* Top — blue/cyan */}
      <path d="M4 2.5 L 16.5 14.5 L 21 10 L 7 0.3 C 5.6 -0.4 4.2 0.9 4 2.5 Z" fill="#00D4FF" />
      {/* Bottom-left — green */}
      <path d="M4 29.5 C 4.2 31.1 5.6 32.4 7 31.7 L 21 22 L 16.5 17.5 L 4 29.5 Z" fill="#00E676" />
      {/* Bottom-right — yellow/amber */}
      <path d="M16.5 17.5 L 21 22 L 26.5 25.2 C 28.4 26.3 30.5 25.3 30.7 23.9 L 16.5 17.5 Z" fill="#FFC107" />
      {/* Top-right — red */}
      <path d="M16.5 14.5 L 30.7 8.1 C 30.5 6.7 28.4 5.7 26.5 6.8 L 21 10 L 16.5 14.5 Z" fill="#FF3D00" />
      {/* Tiny play notch (center triangle hint) */}
      <path d="M16.5 14.5 L 21 10 L 16.5 17.5 L 21 22 Z" fill="rgba(0,0,0,0.06)" />
    </svg>
  );
}
