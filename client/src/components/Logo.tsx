import { cn } from "@/lib/utils";

type Variant = "onLight" | "onDark";

interface LogoProps {
  variant?: Variant;
  size?: number;
  className?: string;
  showWordmark?: boolean;
  wordmarkClassName?: string;
}

/**
 * Brand logo for Bring Gift Card.
 *
 * Uses the transparent white-globe PNG (`logo-transparent.png`) — no
 * background box, no rounded tile, no colored backing. Just the white
 * logo shape placed directly on the page background.
 *
 * - `onDark` (default for hero): white logo shows directly on the dark
 *   royal-blue background — perfect contrast, no filter needed.
 *
 * - `onLight` (when scrolled): the white logo wouldn't show on white,
 *   so we apply a CSS filter to recolor it royal blue.
 *   (`invert + hue-rotate` turns white → royal blue while keeping transparency.)
 *
 * Implementation: just an `<img>` with no surrounding box. The wordmark
 * text sits next to it.
 */
export function Logo({
  variant = "onLight",
  size = 44,
  className,
  showWordmark = true,
  wordmarkClassName,
}: LogoProps) {
  // On dark backgrounds: white logo shows as-is.
  // On light backgrounds: filter the white logo to royal blue.
  //   `invert(1)` → makes the white logo black, transparent stays transparent.
  //   But we want royal blue, not black. So we use a combination:
  //   `brightness(0) invert(1) sepia(1) saturate(5) hue-rotate(200deg)`
  //   → turns white into a saturated royal blue.
  const filterStyle =
    variant === "onDark"
      ? undefined
      : "brightness(0) invert(1) sepia(1) saturate(5) hue-rotate(200deg) brightness(0.85)";

  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <img
        src="/logo-transparent.png"
        alt="Bring Gift Card logo"
        width={size}
        height={size}
        className="object-contain"
        style={{
          width: size,
          height: size,
          filter: filterStyle,
        }}
        draggable={false}
      />
      {showWordmark && (
        <span
          className={cn(
            "font-display font-extrabold tracking-tight",
            variant === "onDark" ? "text-white" : "text-[#0047AB]",
            wordmarkClassName
          )}
          style={{ fontSize: size * 0.42 }}
        >
          Bring<span className="opacity-70">Gift</span>Card
        </span>
      )}
    </span>
  );
}
