import { useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { ShieldCheck, Zap } from "lucide-react";

/**
 * Premium hero showcase — three realistic gift cards
 * (Apple, Amazon, Google Play) with:
 *
 * 1. MASSIVE transparent logo watermark on each card (mix-blend-mode: screen)
 * 2. Persistent "100% Secure" + "Instant Pay" badges on the front card
 * 3. Continuous gentle floating animation (hovering in mid-air)
 * 4. 4-state click cycle:
 *      State 0 (default): spread DOWN
 *      State 1: stacked
 *      State 2: spread UP
 *      State 3: stacked
 *      State 4: spread DOWN (back to start)
 *    Click any card to advance to the next state.
 */
export function Hero3D() {
  const ref = useRef<HTMLDivElement>(null);
  const [clickCount, setClickCount] = useState(0);

  // 4-state cycle: 0 = spread-down, 1 = stack, 2 = spread-up, 3 = stack
  const phase = clickCount % 4;
  const isStacked = phase === 1 || phase === 3;
  const isSpreadUp = phase === 2; // phase 0 = spread-down (default)

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

  // Whole scene scroll parallax (separate from floating animation).
  const sceneY = useTransform(progress, [0, 1], [0, -40]);

  // ── Card position targets per state ──
  // SPREAD DOWN: back cards go DOWN (positive Y), rotated CCW.
  // SPREAD UP:   back cards go UP (negative Y), rotated CCW.
  // STACK:       all cards aligned, tiny rotation hint.
  const OFFSET_Y = 56;
  const dir = isSpreadUp ? -1 : 1; // -1 = up, 1 = down

  const card1Target = isStacked
    ? { x: 0, y: -8, rotate: -3, zIndex: 30, scale: 1 }
    : { x: 0, y: 0, rotate: -18, zIndex: 30, scale: 1 };

  const card2Target = isStacked
    ? { x: 0, y: 0, rotate: 0, zIndex: 20, scale: 1 }
    : { x: -30, y: OFFSET_Y * dir, rotate: -36, zIndex: 20, scale: 1 };

  const card3Target = isStacked
    ? { x: 0, y: 8, rotate: 3, zIndex: 10, scale: 1 }
    : { x: -60, y: OFFSET_Y * 2 * dir, rotate: -54, zIndex: 10, scale: 1 };

  const spring = { type: "spring" as const, stiffness: 140, damping: 18, mass: 0.9 };

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

      {/* Scroll-parallax wrapper */}
      <motion.div
        style={{ y: sceneY }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      >
        {/* Floating animation wrapper — continuous gentle hover */}
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Card container */}
          <div className="relative h-[460px] w-[640px] sm:h-[500px] sm:w-[700px]">
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

            {/* Card 1 — FRONT (Apple) with persistent badges */}
            <motion.div
              className="absolute left-1/2 top-1/2 cursor-pointer"
              onClick={() => setClickCount((c) => c + 1)}
              animate={card1Target}
              transition={spring}
              whileHover={{ scale: 1.04 }}
            >
              <div className="relative -translate-x-1/2 -translate-y-1/2">
                <AppleCard />

                {/* Persistent badges — ALWAYS visible on the front card,
                    whether stacked or spread. */}
                <div className="absolute -bottom-4 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[10px] font-bold text-[#0047AB] shadow-lg ring-1 ring-black/5">
                    <ShieldCheck className="h-3 w-3" />
                    100% Secure
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#C9A24B] px-3 py-1.5 text-[10px] font-bold text-white shadow-lg ring-1 ring-black/5">
                    <Zap className="h-3 w-3" />
                    Instant Pay
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
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
}

/**
 * CardShell — the shared card frame.
 *
 * Contains a MASSIVE transparent logo watermark using mix-blend-mode: screen.
 * Only the white parts of the logo show through; the transparent background
 * of the PNG is invisible. The watermark sits at z-index 0; the card content
 * (text, logos, badges) sits at z-index 10 so it's always on top.
 */
function CardShell({ children, background }: CardProps) {
  return (
    <div
      className="relative overflow-hidden rounded-3xl shadow-[0_40px_90px_-20px_rgba(0,0,0,0.6)] ring-1 ring-black/10"
      style={{ width: CARD_W, height: CARD_H, transformStyle: "preserve-3d" }}
    >
      {/* Background layer */}
      {background}

      {/* Massive transparent logo watermark.
          mix-blend-mode: screen → only the white logo pixels show;
          the transparent PNG background disappears entirely.
          opacity: 0.3 → subtle watermark, not overpowering.
          150% size + centered → fills the card massively. */}
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

      {/* Subtle top sheen (between watermark and content) */}
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
   AMAZON GIFT CARD — dark charcoal card, centered white "amazon" wordmark
   with orange smile/arrow.
   ========================================================================= */
function AmazonCard() {
  return (
    <CardShell
      background={
        <>
          <div className="absolute inset-0 bg-[#131921]" />
          <div
            className="absolute inset-0 opacity-40"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, rgba(255,153,0,0.08), transparent 60%)",
            }}
          />
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
        <AmazonWordmarkLarge />
        <p className="absolute bottom-7 left-1/2 -translate-x-1/2 text-[10px] font-medium uppercase tracking-[0.3em] text-white/40">
          Gift Card
        </p>
      </div>
    </CardShell>
  );
}

function AmazonWordmarkLarge() {
  return (
    <svg viewBox="0 0 200 80" className="w-[80%] max-w-[320px]" aria-hidden>
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
      <path
        d="M40 50 Q 100 68, 160 50"
        stroke="#FF9900"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />
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
   GOOGLE PLAY GIFT CARD — white card, multicolor triangle logo, "Google Play"
   text in grey.
   ========================================================================= */
function GooglePlayCard() {
  return (
    <CardShell
      background={
        <>
          <div className="absolute inset-0 bg-white" />
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
        <GooglePlayTriangleLarge className="h-24 w-24" />
        <div>
          <p
            className="font-display text-[28px] font-medium leading-tight text-[#5F6368]"
            style={{ letterSpacing: "-0.5px" }}
          >
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
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      <path d="M22 12 L 50 44 L 62 36 L 30 8 C 26.5 6, 23.5 8, 22 12 Z" fill="#4CAF50" />
      <path d="M22 12 C 21 16, 21 84, 22 88 L 50 56 L 50 44 Z" fill="#2196F3" />
      <path d="M22 88 C 23.5 92, 26.5 94, 30 92 L 62 64 L 50 56 Z" fill="#F44336" />
      <path
        d="M30 8 L 62 36 L 78 45 C 82 47, 82 53, 78 55 L 62 64 L 30 92 Z M50 44 L 50 56 L 62 50 Z"
        fill="#FFC107"
      />
      <path d="M50 44 L 62 50 L 50 56 Z" fill="rgba(0,0,0,0.08)" />
    </svg>
  );
}
