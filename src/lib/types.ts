/* ============================================================
   Bring Gift Card — Shared domain types
   ============================================================ */

/** A tradeable asset: a gift card brand or a crypto token. */
export type AssetKey =
  // Gift cards
  | "steam"
  | "apple"
  | "amazon"
  | "google"
  | "xbox"
  | "playstation"
  | "visa"
  | "vanilla"
  | "walmart"
  | "sephora"
  | "nike"
  | "netflix"
  | "ebay"
  | "spotify"
  // Crypto
  | "usdt"
  | "btc"
  | "eth";

export type AssetCategory = "giftcard" | "crypto";

export type Asset = {
  key: AssetKey;
  name: string;
  category: AssetCategory;
  /** Lucide icon name for fallback rendering (CSS/SVG only). */
  icon: string;
  /** Tailwind gradient classes for the card face. */
  gradient: string;
  /** Short tag shown on cards. */
  tag: string;
  /** Showcase filter group. */
  group: "Gaming" | "Shopping" | "Entertainment" | "Food" | "Crypto";
  /** Example denomination used in the hero mockups. */
  sample: string;
};

/**
 * Rate row as stored in Supabase. `rate` is units of payout currency
 * per 1 USD of face value (e.g. 1285 = ₦1285 per $1 for Steam).
 */
export type RateRow = {
  key: AssetKey;
  rate: number;
  /** Whether this asset is currently tradeable. */
  active: boolean;
  /** ISO timestamp of last update (from DB). */
  updated_at?: string;
};

export type PayoutCurrency = "NGN" | "USD" | "GHS";

export type SiteSettings = {
  /** Digits only incl. country code, no "+". Powers wa.me links, never shown as text. */
  whatsappNumber: string;
  /** Generic support email. */
  email: string;
  /** Office address line. */
  address: string;
};

/** Public payload returned by /api/rates and /api/settings. */
export type PublicConfig = {
  rates: RateRow[];
  settings: SiteSettings;
};
