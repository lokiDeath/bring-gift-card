import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Bring Gift Card brand palette — premium fintech / global trust
        brand: {
          // Royal blue family (primary)
          50: "#eef6ff",
          100: "#d9eaff",
          200: "#bcdcff",
          300: "#8ec6ff",
          400: "#59a6ff",
          500: "#2f86f5",
          600: "#1864db",
          700: "#144fb0",
          800: "#163f8a",
          900: "#0f2b5c",
          950: "#0a1a3d",
        },
        // Gold accent (value / premium)
        gold: {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
        },
        // Emerald (WhatsApp / payout / live)
        emerald: {
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
        },
        ink: {
          950: "#04060f",
          900: "#060913",
          800: "#0a1020",
          700: "#0f172a",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-outfit)", "var(--font-inter)", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      borderRadius: {
        "4xl": "2rem",
      },
      boxShadow: {
        glow: "0 0 60px -10px rgba(47,134,245,0.45)",
        "glow-gold": "0 0 60px -10px rgba(245,158,11,0.45)",
        "glow-emerald": "0 0 40px -8px rgba(16,185,129,0.5)",
        card3d: "0 40px 80px -30px rgba(0,0,0,0.85), 0 0 0 1px rgba(255,255,255,0.06) inset",
      },
      keyframes: {
        floaty: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        drift: {
          "0%": { transform: "translate(0,0)" },
          "50%": { transform: "translate(14px,-18px)" },
          "100%": { transform: "translate(0,0)" },
        },
        "pulse-soft": {
          "0%,100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.75", transform: "scale(1.04)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "spin-slow": {
          to: { transform: "rotate(360deg)" },
        },
      },
      animation: {
        floaty: "floaty 6s ease-in-out infinite",
        drift: "drift 9s ease-in-out infinite",
        "pulse-soft": "pulse-soft 3s ease-in-out infinite",
        shimmer: "shimmer 3s linear infinite",
        "spin-slow": "spin-slow 18s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
