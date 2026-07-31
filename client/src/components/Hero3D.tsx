import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { ShieldCheck, Zap } from "lucide-react";

/**
 * Premium hero showcase — three realistic gift cards
 * (Apple, Amazon, Google Play) arranged in a fan layout.
 * Each card is a hand-crafted CSS/SVG replica of the real brand design.
 *
 * Scroll parallax: cards lift and separate subtly as the user scrolls.
 */
export function Hero3D() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Smooth out scroll.
  const progress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 24,
    mass: 0.6,
  });

  // Backdrop glow.
  const glowOpacity = useTransform(progress, [0, 0.5, 1], [0.55, 0.85, 0.4]);
  const glowScale = useTransform(progress, [0, 1], [1, 1.25]);

  // Whole scene lifts subtly.
  const sceneY = useTransform(progress, [0, 1], [0, -50]);
  const sceneRotate = useTransform(progress, [0, 1], [0, -3]);

  // Per-card transforms — each lifts at a different rate for depth.
  const appleY = useTransform(progress, [0, 1], [0, -110]);
  const appleRotate = useTransform(progress, [0, 1], [-14, -22]);
  const appleX = useTransform(progress, [0, 1], [0, -50]);

  const amazonY = useTransform(progress, [0, 1], [0, -150]);
  const amazonScale = useTransform(progress, [0, 1], [1, 1.04]);

  const googleY = useTransform(progress, [0, 1], [0, -110]);
  const googleRotate = useTransform(progress, [0, 1], [14, 22]);
  const googleX = useTransform(progress, [0, 1], [0, 50]);

  // Floating chips parallax.
  const chipLeftY = useTransform(progress, [0, 1], [0, -120]);
  const chipRightY = useTransform(progress, [0, 1], [0, 80]);

  return (
    <div ref={ref} className="relative h-[560px] w-full perspective-2000 sm:h-[620px]">
      {/* Backdrop glow */}
      <motion.div
        style={{ opacity: glowOpacity, scale: glowScale }}
        className="pointer-events-none absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#1E5BD6] blur-[110px] sm:h-96 sm:w-96"
      />
      <motion.div
        style={{ opacity: glowOpacity }}
        className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#C9A24B]/30 blur-[90px] sm:h-72 sm:w-72"
      />

      {/* Card stack */}
      <motion.div
        style={{ y: sceneY, rotate: sceneRotate }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      >
        <div className="relative h-[340px] w-[460px] sm:h-[400px] sm:w-[540px]">
          {/* Ground shadow */}
          <div
            className="absolute -bottom-6 left-1/2 h-8 w-[70%] -translate-x-1/2 rounded-[50%] bg-black/40 blur-2xl"
            aria-hidden
          />

          {/* Apple card — back left */}
          <motion.div
            style={{ y: appleY, x: appleX, rotate: appleRotate }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
          >
            <AppleCard />
          </motion.div>

          {/* Amazon card — front center */}
          <motion.div
            style={{ y: amazonY, scale: amazonScale }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30"
          >
            <AmazonCard />
          </motion.div>

          {/* Google Play card — back right */}
          <motion.div
            style={{ y: googleY, x: googleX, rotate: googleRotate }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
          >
            <GooglePlayCard />
          </motion.div>
        </div>
      </motion.div>

      {/* Floating feature chips (separate parallax) */}
      <motion.div
        style={{ y: chipLeftY }}
        className="absolute left-0 top-1/2 hidden -translate-y-1/2 sm:block"
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
        style={{ y: chipRightY }}
        className="absolute right-0 top-1/3 hidden sm:block"
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
   CARD DIMENSIONS — gift-card aspect ratio (1.586 : 1, same as a credit card)
   ========================================================================= */
const CARD_W = 320;
const CARD_H = Math.round(CARD_W / 1.586); // ~202

interface CardProps {
  children: React.ReactNode;
  background: React.ReactNode;
  /** z-index of the card front content */
  frontZ?: number;
}

function CardShell({ children, background }: CardProps) {
  return (
    <div
      className="relative overflow-hidden rounded-2xl shadow-[0_30px_70px_-20px_rgba(0,0,0,0.55)] ring-1 ring-black/10"
      style={{ width: CARD_W, height: CARD_H, transformStyle: "preserve-3d" }}
    >
      {/* Background layer (gradient + brand-specific design) */}
      {background}

      {/* Foreground content (logo, text, chip, etc.) */}
      <div className="absolute inset-0 p-4">{children}</div>

      {/* Subtle top sheen */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-t-2xl"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 100%)",
        }}
      />
    </div>
  );
}

/** Realistic embossed chip — same proportions as a real EMV chip. */
function Chip() {
  return (
    <div className="relative h-7 w-9 rounded-[5px] bg-gradient-to-br from-[#E5C77B] via-[#C9A24B] to-[#9B7A2E] shadow-inner ring-1 ring-white/30">
      <div className="absolute inset-[3px] grid grid-cols-3 gap-[1px] opacity-70">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="rounded-[1px] bg-[#7A5F23]" />
        ))}
      </div>
    </div>
  );
}

/* =========================================================================
   APPLE GIFT CARD
   - Clean white card with subtle iridescent sheen
   - Apple logo (silver-grey) on top-left
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
            className="absolute inset-0 opacity-60"
            style={{
              background:
                "linear-gradient(115deg, rgba(255,200,255,0.15) 0%, rgba(200,220,255,0.18) 30%, rgba(255,255,200,0.15) 60%, rgba(200,255,220,0.18) 100%)",
            }}
          />
          {/* Diagonal holographic stripe */}
          <div
            className="absolute -inset-10 opacity-30"
            style={{
              background:
                "repeating-linear-gradient(115deg, transparent 0px, transparent 30px, rgba(180,200,255,0.15) 30px, rgba(180,200,255,0.15) 60px)",
            }}
          />
        </>
      }
    >
      <div className="flex h-full flex-col justify-between text-[#1D1D1F]">
        {/* Top: Apple logo + Gift Card */}
        <div className="flex items-start justify-between">
          <div className="flex flex-col">
            <AppleLogo className="h-7 w-7 text-[#1D1D1F]" />
            <span className="mt-2 font-display text-[11px] font-medium tracking-[0.18em] text-[#86868B]">
              GIFT CARD
            </span>
          </div>
          <span className="rounded-full bg-[#1D1D1F] px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-white">
            USD
          </span>
        </div>

        {/* Middle: chip + value */}
        <div className="flex items-center gap-3">
          <Chip />
          <div className="font-mono text-[11px] tracking-[0.18em] text-[#1D1D1F]/70">
            ••••  2025
          </div>
        </div>

        {/* Bottom: cardholder + valid */}
        <div className="flex items-end justify-between border-t border-black/10 pt-2">
          <div>
            <p className="text-[8px] font-medium uppercase tracking-wider text-[#86868B]">
              Cardholder
            </p>
            <p className="font-display text-[11px] font-semibold tracking-wide text-[#1D1D1F]">
              BRING GIFT CARD
            </p>
          </div>
          <div className="text-right">
            <p className="text-[8px] font-medium uppercase tracking-wider text-[#86868B]">
              Valid Thru
            </p>
            <p className="font-mono text-[10px] text-[#1D1D1F]">12/29</p>
          </div>
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
                "radial-gradient(circle at 20% 30%, rgba(255,153,0,0.08), transparent 50%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.04), transparent 40%)",
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
      <div className="flex h-full flex-col justify-between text-white">
        {/* Top: amazon logo + gift card */}
        <div className="flex items-start justify-between">
          <div>
            <AmazonWordmark />
            <p className="mt-1.5 font-display text-[10px] font-medium uppercase tracking-[0.25em] text-white/70">
              Gift Card
            </p>
          </div>
          <span className="rounded-full bg-[#FF9900] px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-[#232F3E]">
            USD
          </span>
        </div>

        {/* Middle: chip + card number */}
        <div className="flex items-center gap-3">
          <Chip />
          <div className="font-mono text-[11px] tracking-[0.2em] text-white/80">
            ••••  3025
          </div>
        </div>

        {/* Bottom: cardholder + valid */}
        <div className="flex items-end justify-between border-t border-white/15 pt-2">
          <div>
            <p className="text-[8px] font-medium uppercase tracking-wider text-white/50">
              Cardholder
            </p>
            <p className="font-display text-[11px] font-semibold tracking-wide text-white">
              BRING GIFT CARD
            </p>
          </div>
          <div className="text-right">
            <p className="text-[8px] font-medium uppercase tracking-wider text-white/50">
              Valid Thru
            </p>
            <p className="font-mono text-[10px] text-white">12/29</p>
          </div>
        </div>
      </div>
    </CardShell>
  );
}

function AmazonWordmark() {
  // "amazon" lowercase wordmark with the signature smile/arrow underneath.
  return (
    <svg viewBox="0 0 100 36" className="h-7 w-20" aria-hidden>
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
   - Light gradient background (white → very pale grey/blue)
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
            className="absolute -inset-10 opacity-40"
            style={{
              background:
                "linear-gradient(115deg, transparent 30%, rgba(0,197,255,0.08) 45%, rgba(0,230,118,0.08) 55%, rgba(255,193,7,0.08) 65%, rgba(255,61,0,0.08) 75%, transparent 90%)",
            }}
          />
        </>
      }
    >
      <div className="flex h-full flex-col justify-between text-[#202124]">
        {/* Top: Google Play logo + Gift Card */}
        <div className="flex items-start justify-between">
          <div className="flex flex-col">
            <GooglePlayLogo className="h-7 w-7" />
            <span className="mt-2 font-display text-[11px] font-medium tracking-[0.18em] text-[#5F6368]">
              GIFT CARD
            </span>
          </div>
          <span className="rounded-full bg-[#202124] px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-white">
            USD
          </span>
        </div>

        {/* Middle: chip + card number */}
        <div className="flex items-center gap-3">
          <Chip />
          <div className="font-mono text-[11px] tracking-[0.18em] text-[#202124]/70">
            ••••  4025
          </div>
        </div>

        {/* Bottom: cardholder + valid */}
        <div className="flex items-end justify-between border-t border-black/10 pt-2">
          <div>
            <p className="text-[8px] font-medium uppercase tracking-wider text-[#5F6368]">
              Cardholder
            </p>
            <p className="font-display text-[11px] font-semibold tracking-wide text-[#202124]">
              BRING GIFT CARD
            </p>
          </div>
          <div className="text-right">
            <p className="text-[8px] font-medium uppercase tracking-wider text-[#5F6368]">
              Valid Thru
            </p>
            <p className="font-mono text-[10px] text-[#202124]">12/29</p>
          </div>
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
