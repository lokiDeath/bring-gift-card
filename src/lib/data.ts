import type { Asset, AssetKey, RateRow, SiteSettings } from "./types";

/* ============================================================
   Bring Gift Card — Static catalogue & defaults
   These are STATIC fallbacks. The live source of truth is Supabase
   (table `rates` + singleton row in `settings`). If Supabase is
   unreachable, these defaults keep the site fully functional.
   ============================================================ */

export const ASSETS: Asset[] = [
  // ── Gift cards ──
  { key: "steam", name: "Steam Wallet", category: "giftcard", icon: "Gamepad2", gradient: "from-slate-700 via-slate-800 to-slate-950", tag: "Top Rate · US/UK/EU", group: "Gaming", sample: "$100" },
  { key: "apple", name: "Apple / iTunes", category: "giftcard", icon: "Apple", gradient: "from-sky-500 via-indigo-600 to-purple-700", tag: "High Demand", group: "Entertainment", sample: "$100" },
  { key: "amazon", name: "Amazon", category: "giftcard", icon: "ShoppingBag", gradient: "from-amber-400 via-orange-500 to-amber-700", tag: "Cash / E-Code", group: "Shopping", sample: "$100" },
  { key: "google", name: "Google Play", category: "giftcard", icon: "Smartphone", gradient: "from-emerald-400 via-green-500 to-teal-700", tag: "Fast Payout", group: "Entertainment", sample: "$100" },
  { key: "xbox", name: "Xbox & Game Pass", category: "giftcard", icon: "Gamepad2", gradient: "from-emerald-600 via-green-700 to-green-950", tag: "Digital Codes", group: "Gaming", sample: "$50" },
  { key: "playstation", name: "PlayStation Store", category: "giftcard", icon: "Gamepad2", gradient: "from-blue-500 via-blue-700 to-indigo-950", tag: "PSN Vouchers", group: "Gaming", sample: "$50" },
  { key: "visa", name: "Visa Prepaid", category: "giftcard", icon: "CreditCard", gradient: "from-blue-500 via-blue-600 to-blue-900", tag: "Visa / Vanilla", group: "Shopping", sample: "$200" },
  { key: "vanilla", name: "Vanilla Prepaid", category: "giftcard", icon: "CreditCard", gradient: "from-zinc-300 via-zinc-400 to-zinc-700", tag: "Prepaid Voucher", group: "Shopping", sample: "$200" },
  { key: "walmart", name: "Walmart", category: "giftcard", icon: "ShoppingCart", gradient: "from-blue-500 via-blue-600 to-blue-800", tag: "Retail", group: "Shopping", sample: "$100" },
  { key: "sephora", name: "Sephora", category: "giftcard", icon: "Sparkles", gradient: "from-pink-400 via-rose-500 to-fuchsia-700", tag: "Beauty", group: "Shopping", sample: "$100" },
  { key: "nike", name: "Nike", category: "giftcard", icon: "Footprints", gradient: "from-zinc-700 via-zinc-800 to-black", tag: "Sportswear", group: "Shopping", sample: "$100" },
  { key: "netflix", name: "Netflix", category: "giftcard", icon: "Clapperboard", gradient: "from-red-500 via-red-600 to-red-900", tag: "Streaming", group: "Entertainment", sample: "$50" },
  { key: "ebay", name: "eBay", category: "giftcard", icon: "ShoppingBag", gradient: "from-red-400 via-rose-500 to-blue-700", tag: "Marketplace", group: "Shopping", sample: "$100" },
  { key: "spotify", name: "Spotify", category: "giftcard", icon: "Music", gradient: "from-emerald-400 via-green-500 to-emerald-800", tag: "Music Premium", group: "Entertainment", sample: "$30" },

  // ── Crypto ──
  { key: "usdt", name: "Tether (USDT)", category: "crypto", icon: "Coins", gradient: "from-emerald-400 via-teal-500 to-green-700", tag: "TRC20 / ERC20", group: "Crypto", sample: "$500" },
  { key: "btc", name: "Bitcoin (BTC)", category: "crypto", icon: "Bitcoin", gradient: "from-amber-400 via-orange-500 to-yellow-700", tag: "Crypto OTC", group: "Crypto", sample: "$500" },
  { key: "eth", name: "Ethereum (ETH)", category: "crypto", icon: "Hexagon", gradient: "from-indigo-400 via-purple-500 to-violet-800", tag: "Instant Settlement", group: "Crypto", sample: "$500" },
];

export const ASSET_MAP: Record<AssetKey, Asset> = ASSETS.reduce(
  (acc, a) => ((acc[a.key] = a), acc),
  {} as Record<AssetKey, Asset>
);

/** Default payout rate per 1 USD face value. Editable live from the Admin panel. */
export const DEFAULT_RATES: RateRow[] = [
  { key: "steam", rate: 1285, active: true },
  { key: "apple", rate: 1210, active: true },
  { key: "amazon", rate: 1150, active: true },
  { key: "google", rate: 1120, active: true },
  { key: "xbox", rate: 1100, active: true },
  { key: "playstation", rate: 1095, active: true },
  { key: "visa", rate: 1080, active: true },
  { key: "vanilla", rate: 1070, active: true },
  { key: "walmart", rate: 1110, active: true },
  { key: "sephora", rate: 1135, active: true },
  { key: "nike", rate: 1140, active: true },
  { key: "netflix", rate: 1075, active: true },
  { key: "ebay", rate: 1125, active: true },
  { key: "spotify", rate: 1060, active: true },
  { key: "usdt", rate: 1540, active: true },
  { key: "btc", rate: 1530, active: true },
  { key: "eth", rate: 1510, active: true },
];

/** Default site settings. WhatsApp number is a PLACEHOLDER — set the real one in Admin. */
export const DEFAULT_SETTINGS: SiteSettings = {
  whatsappNumber: "2348000000000", // ← replace via Admin panel (never shown as visible text)
  email: "support@bringgiftcard.com",
  address: "13B Ikosi Road, Ketu, Lagos, Nigeria",
};

/* ─── Founders (display-only, no contact numbers ever printed) ─── */
export type Founder = {
  name: string;
  role: string;
  bio: string;
  initials: string;
  gradient: string;
  accent: string;
};

export const FOUNDERS: Founder[] = [
  {
    name: "Boss Mandy",
    role: "Co-Founder & CEO",
    bio: "Leads global operations with a passion for connecting people through seamless, honest, and instant trading services across every continent.",
    initials: "BM",
    gradient: "from-sky-500 via-indigo-500 to-purple-600",
    accent: "text-sky-400",
  },
  {
    name: "Boss Kevin",
    role: "Co-Founder & Director",
    bio: "Drives strategic growth and ensures top-tier reliability, transparency, and lightning-fast payouts for customers worldwide.",
    initials: "BK",
    gradient: "from-indigo-500 via-emerald-500 to-teal-600",
    accent: "text-emerald-400",
  },
];

/* ─── Services ─── */
export type Service = {
  id: "cards" | "crypto" | "transfers";
  title: string;
  desc: string;
  tags: string[];
  icon: string;
  gradient: string;
  accent: string;
  glow: string;
};

export const SERVICES: Service[] = [
  {
    id: "cards",
    title: "Gift Card Trading",
    desc: "We buy and sell all physical gift cards and e-codes worldwide. Best-rate guarantees on Apple, Steam, Amazon, Google Play, Xbox, Visa, Walmart, Sephora and many more.",
    tags: ["Apple", "Steam", "Amazon", "Google Play", "Visa", "Walmart"],
    icon: "Gift",
    gradient: "from-brand-50 to-white",
    accent: "text-brand-600",
    glow: "shadow-lg shadow-brand-500/20",
  },
  {
    id: "crypto",
    title: "Crypto Exchange",
    desc: "Instant buy and sell for Bitcoin, Ethereum, Tether (USDT) and major altcoins. Competitive OTC rates with immediate fiat settlement.",
    tags: ["Bitcoin", "USDT", "Ethereum", "Crypto OTC"],
    icon: "Bitcoin",
    gradient: "from-gold-50 to-white",
    accent: "text-gold-600",
    glow: "shadow-lg shadow-gold-500/20",
  },
  {
    id: "transfers",
    title: "Global Remittance",
    desc: "Seamless cross-border funds transfers across Africa, Asia, Europe and the Americas. Fast, reliable and secure wires with top-tier FX conversion.",
    tags: ["Cross-Border", "USD Wires", "Naira Payouts", "Same-Day"],
    icon: "ArrowLeftRight",
    gradient: "from-emerald-50 to-white",
    accent: "text-emerald-600",
    glow: "shadow-lg shadow-emerald-500/20",
  },
];

/* ─── Stats strip ─── */
export const STATS = [
  { value: "24/7", label: "Available Non-Stop", color: "text-brand-900" },
  { value: "Global", label: "Worldwide Transfers", color: "text-emerald-600" },
  { value: "100+", label: "Gift Card Brands", color: "text-gold-600" },
  { value: "< 5 Mins", label: "Lightning Payouts", color: "text-brand-500" },
];

/* ─── Trust badges (hero) ─── */
export const TRUST = [
  { icon: "Zap", title: "5 Mins Avg.", sub: "Payout Time", accent: "text-brand-600" },
  { icon: "ShieldCheck", title: "100% Safe", sub: "Protected Trade", accent: "text-emerald-600" },
  { icon: "Globe", title: "Global", sub: "Money Transfers", accent: "text-brand-500" },
];
