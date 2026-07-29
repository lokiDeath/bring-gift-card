import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser-side Supabase client. Only reads PUBLIC data (rates/settings),
 * so it uses the anon key and is safe to expose to the client.
 */
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Fallback to empty-string envs so the client never throws at import time.
  // Data-access callers detect missing config and fall back to static defaults.
  return createBrowserClient(url ?? "", anon ?? "");
}
