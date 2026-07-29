import { cn } from "@/lib/utils";

/* ============================================================
   Bring Gift Card — Brand Logo (pure SVG)
   A rounded "B" gift-card mark: blue gradient card with a white
   gift-ribbon + spark. Scales crisply at any size.
   ============================================================ */

export function LogoMark({
  className,
  size = 40,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Bring Gift Card logo"
    >
      <defs>
        <linearGradient id="bgc-blue" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2f86f5" />
          <stop offset="0.5" stopColor="#1864db" />
          <stop offset="1" stopColor="#0f2b5c" />
        </linearGradient>
        <linearGradient id="bgc-ribbon" x1="24" y1="6" x2="24" y2="42" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffffff" />
          <stop offset="1" stopColor="#dbeafe" />
        </linearGradient>
      </defs>

      {/* Card body */}
      <rect x="4" y="6" width="40" height="36" rx="9" fill="url(#bgc-blue)" />
      <rect x="4" y="6" width="40" height="36" rx="9" fill="#ffffff" fillOpacity="0.06" />

      {/* Magnetic-strip band */}
      <rect x="4" y="16" width="40" height="5" fill="#0a1a3d" fillOpacity="0.35" />

      {/* Gift ribbon (vertical + horizontal + bow knot) forming a "B" suggestion */}
      <path
        d="M24 21 V40 M24 28 H36 M24 28 H12"
        stroke="url(#bgc-ribbon)"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      {/* Bow loops above the knot */}
      <path
        d="M24 21 C19 18 17 13 20.5 12 C23 11.3 24 14 24 14 C24 14 25 11.3 27.5 12 C31 13 29 18 24 21 Z"
        fill="url(#bgc-ribbon)"
      />

      {/* Spark accent */}
      <circle cx="35.5" cy="12.5" r="1.6" fill="#fbbf24" />
      <circle cx="35.5" cy="12.5" r="3.2" fill="#fbbf24" fillOpacity="0.25" />
    </svg>
  );
}

/* Full lockup: mark + wordmark */
export function Logo({
  className,
  size = 40,
  variant = "dark", // "dark" = for light backgrounds, "light" = for dark backgrounds
}: {
  className?: string;
  size?: number;
  variant?: "dark" | "light";
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark size={size} className="shrink-0 drop-shadow-sm" />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "text-lg font-black tracking-tight",
            variant === "dark" ? "text-brand-900" : "text-white"
          )}
          style={{ fontFamily: "var(--font-outfit), sans-serif" }}
        >
          BRING{" "}
          <span className="text-brand-500">GIFTCARD</span>
        </span>
        <span
          className={cn(
            "text-[10px] font-semibold uppercase tracking-[0.2em]",
            variant === "dark" ? "text-brand-600/70" : "text-brand-200/80"
          )}
        >
          Global Trading Hub
        </span>
      </span>
    </span>
  );
}
