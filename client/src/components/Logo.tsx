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
 * - `onLight` (default): uses the blue logo tile → fits on white/light backgrounds.
 * - `onDark`: uses the white logo tile → fits on royal-blue / dark backgrounds.
 *
 * The tile is rendered as a rounded badge so it blends into either surface.
 */
export function Logo({
  variant = "onLight",
  size = 44,
  className,
  showWordmark = true,
  wordmarkClassName,
}: LogoProps) {
  const src = variant === "onDark" ? "/logo-white.png" : "/logo-blue.jpg";
  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <span
        className={cn(
          "relative inline-block overflow-hidden rounded-2xl ring-1 shadow-sm",
          variant === "onDark" ? "ring-white/15" : "ring-black/5"
        )}
        style={{ width: size, height: size }}
      >
        <img
          src={src}
          alt="Bring Gift Card logo"
          width={size}
          height={size}
          className="h-full w-full object-cover"
          draggable={false}
        />
      </span>
      {showWordmark && (
        <span
          className={cn(
            "font-display font-extrabold tracking-tight",
            variant === "onDark" ? "text-white" : "text-[#0047AB]",
            wordmarkClassName
          )}
          style={{ fontSize: size * 0.42 }}
        >
          Bring<span className="text-[#C9A24B]">Gift</span>Card
        </span>
      )}
    </span>
  );
}
