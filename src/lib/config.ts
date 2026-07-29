import { DEFAULT_RATES, DEFAULT_SETTINGS } from "./data";
import type { RateRow, SiteSettings, AssetKey } from "./types";
import { buildWhatsAppLink } from "./utils";
import { createServerSupabaseClient } from "./supabase-server";

export { buildWhatsAppLink };

/**
 * Centralized data access for public config (rates + settings).
 *
 * - Always returns a value (never throws) so the public site stays up even
 *   if Supabase env vars are missing or the DB is unreachable.
 * - On any failure it merges DB data over static defaults so unknown keys
 *   still resolve to a sane number.
 */
export async function getPublicConfig(): Promise<{
  rates: RateRow[];
  settings: SiteSettings;
  source: "supabase" | "fallback";
}> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // No Supabase configured → use static defaults (e.g. local dev without env).
  if (!url || !anon) {
    return { rates: DEFAULT_RATES, settings: DEFAULT_SETTINGS, source: "fallback" };
  }

  try {
    const supabase = createServerSupabaseClient();

    const [ratesRes, settingsRes] = await Promise.all([
      supabase.from("rates").select("key, rate, active, updated_at"),
      supabase.from("settings").select("whatsapp_number, email, address").limit(1).single(),
    ]);

    const rates: RateRow[] = DEFAULT_RATES.map((d) => {
      const row = (ratesRes.data ?? []).find((r) => r.key === d.key);
      return row
        ? { key: row.key as AssetKey, rate: Number(row.rate), active: !!row.active, updated_at: row.updated_at }
        : d;
    });

    const settings: SiteSettings = settingsRes.data
      ? {
          whatsappNumber: String(settingsRes.data.whatsapp_number ?? DEFAULT_SETTINGS.whatsappNumber),
          email: String(settingsRes.data.email ?? DEFAULT_SETTINGS.email),
          address: String(settingsRes.data.address ?? DEFAULT_SETTINGS.address),
        }
      : DEFAULT_SETTINGS;

    return { rates, settings, source: "supabase" };
  } catch {
    return { rates: DEFAULT_RATES, settings: DEFAULT_SETTINGS, source: "fallback" };
  }
}
