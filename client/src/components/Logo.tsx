import { cn } from "@/lib/utils";

type Variant = "onLight" | "onDark";

interface LogoProps {
  variant?: Variant;
  size?: number;
  className?: string;
  showWordmark?: boolean;
  wordmarkClassName?: string;
  /** When true, the "Bring Gift Card" wordmark animates: letters drop down
   * one-by-one and settle into place on every reload + scroll-back-to-top. */
  animateWordmark?: boolean;
}

/**
 * Brand logo for Bring Gift Card.
 *
 * - `onLight` (default): transparent white-globe logo + blue-wordmark text.
 *   Fits on white/light backgrounds. Wordmark colors: bring=blue, gift=white, card=blue.
 *   (The "gift" word is rendered as a soft white outlined text — a subtle
 *   blue-white-blue pattern that blends on light backgrounds.)
 *
 * - `onDark`: transparent white-globe logo + white-wordmark text.
 *   Fits on royal-blue / dark backgrounds. Wordmark colors: bring=white, gift=blue, card=white.
 *   (Inverse pattern — blends on dark backgrounds.)
 *
 * The logo tile uses the transparent PNG so it blends on ANY background
 * (no white/blue card background — just the globe silhouette).
 */
export function Logo({
  variant = "onLight",
  size = 44,
  className,
  showWordmark = true,
  wordmarkClassName,
  animateWordmark = false,
}: LogoProps) {
  // Always use the transparent white-globe logo — it blends on any background.
  const src = "/logo-transparent.png";

  // Wordmark color tokens per variant.
  // onLight:  bring=royal blue, gift=white (outlined), card=royal blue
  // onDark:   bring=white,      gift=royal blue (filled), card=white
  const bringCardColor = variant === "onDark" ? "text-white" : "text-[#0047AB]";
  const giftColor = variant === "onDark" ? "text-[#1E5BD6]" : "text-white";

  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <span
        className="relative inline-block overflow-hidden rounded-2xl ring-1 shadow-sm"
        style={{
          width: size,
          height: size,
          // The transparent PNG has a white globe on transparent background.
          // On a light page, we want the white globe visible — so we put a
          // subtle royal-blue tint behind it via background-color. On dark
          // pages, the white globe shows directly with no backing needed.
          backgroundColor: variant === "onDark" ? "transparent" : "#0047AB",
          // Soft ring color matches the variant.
          // (ring color is set via className below)
        }}
      >
        <img
          src={src}
          alt="Bring Gift Card logo"
          width={size}
          height={size}
          className="h-full w-full object-contain"
          draggable={false}
        />
      </span>
      {showWordmark && (
        <Wordmark
          size={size}
          bringCardColor={bringCardColor}
          giftColor={giftColor}
          giftVariant={variant}
          animate={animateWordmark}
          className={wordmarkClassName}
        />
      )}
    </span>
  );
}

/**
 * "BringGiftCard" wordmark with alternating colors.
 * - On light backgrounds: bring=blue, gift=white (outlined), card=blue
 * - On dark backgrounds:  bring=white, gift=blue (filled), card=white
 *
 * The "Gift" word is styled differently from "Bring" and "Card" to create
 * the alternating pattern. On light, it's a white-fill with blue outline
 * (so it reads against the white page). On dark, it's a blue fill.
 *
 * When `animate` is true, each letter drops down from above with a spring
 * bounce on initial mount AND when the user scrolls back to the top.
 */
function Wordmark({
  size,
  bringCardColor,
  giftColor,
  giftVariant,
  animate,
  className,
}: {
  size: number;
  bringCardColor: string;
  giftColor: string;
  giftVariant: Variant;
  animate: boolean;
  className?: string;
}) {
  const text = "BringGiftCard";
  const fontSize = size * 0.42;

  // Split into the 3 words for color styling.
  // Bring (5) + Gift (4) + Card (4) = 13 chars
  const bring = "Bring";
  const gift = "Gift";
  const card = "Card";

  if (!animate) {
    // Static wordmark.
    return (
      <span
        className={cn(
          "font-display font-extrabold tracking-tight",
          bringCardColor,
          className
        )}
        style={{ fontSize }}
      >
        {bring}
        <span
          className={cn(
            giftVariant === "onDark" ? giftColor : "text-white",
            giftVariant === "onLight" && "drop-shadow-[0_0_1px_rgba(0,71,171,0.6)]"
          )}
          style={
            giftVariant === "onLight"
              ? { WebkitTextStroke: "0.5px #0047AB" }
              : undefined
          }
        >
          {gift}
        </span>
        <span className={bringCardColor}>{card}</span>
      </span>
    );
  }

  // Animated wordmark — letters drop one-by-one.
  // We use Framer Motion via dynamic import to keep the static path clean.
  return (
    <AnimatedWordmark
      text={text}
      fontSize={fontSize}
      bringCardColor={bringCardColor}
      giftColor={giftColor}
      giftVariant={giftVariant}
      className={className}
    />
  );
}

/**
 * Animated wordmark — each letter drops down from above with a spring bounce.
 * Triggers on mount and when the user scrolls back to top (re-fires whenever
 * the element re-enters the viewport from above).
 */
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

function AnimatedWordmark({
  text,
  fontSize,
  bringCardColor,
  giftColor,
  giftVariant,
  className,
}: {
  text: string;
  fontSize: number;
  bringCardColor: string;
  giftColor: string;
  giftVariant: Variant;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { amount: 0.6 });

  // Word boundaries: Bring(0-5) + Gift(5-9) + Card(9-13)
  const bring = text.slice(0, 5);
  const gift = text.slice(5, 9);
  const card = text.slice(9, 13);

  // Render each letter with its color and drop animation.
  const renderLetter = (ch: string, i: number, colorClass: string) => (
    <span
      key={`${ch}-${i}`}
      className="inline-block overflow-hidden align-bottom"
      style={{ whiteSpace: "pre" }}
    >
      <motion.span
        className={cn("inline-block", colorClass)}
        initial={{ y: "-120%", opacity: 0 }}
        animate={
          isInView
            ? { y: 0, opacity: 1 }
            : { y: "-120%", opacity: 0 }
        }
        transition={{
          type: "spring",
          stiffness: 220,
          damping: 18,
          mass: 0.7,
          delay: i * 0.05,
        }}
      >
        {ch}
      </motion.span>
    </span>
  );

  return (
    <span
      ref={ref}
      className={cn(
        "font-display font-extrabold tracking-tight",
        bringCardColor,
        className
      )}
      style={{ fontSize }}
      aria-label={text}
    >
      {bring.split("").map((ch, i) =>
        renderLetter(ch, i, bringCardColor)
      )}
      {gift.split("").map((ch, i) =>
        renderLetter(
          ch,
          i + 5,
          cn(
            giftVariant === "onDark" ? giftColor : "text-white",
            giftVariant === "onLight" && "drop-shadow-[0_0_1px_rgba(0,71,171,0.6)]"
          )
        )
      )}
      {card.split("").map((ch, i) =>
        renderLetter(ch, i + 9, bringCardColor)
      )}
    </span>
  );
}
