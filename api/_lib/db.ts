/**
 * Shared database helpers for Vercel serverless functions.
 * Uses the Neon serverless driver — works in Edge and Node runtimes.
 */
import { neon, neonConfig } from "@neondatabase/serverless";

// Force HTTP transport (more reliable in serverless cold starts than WebSocket).
neonConfig.poolQueryViaFetch = true;

export const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  // We don't throw at module-load — some endpoints (login) may still want to
  // return a helpful error. Each route checks `sql` is defined before use.
  console.warn("[db] DATABASE_URL is not set. API routes will return 500.");
}

export const sql = DATABASE_URL ? neon(DATABASE_URL) : null;

/** Run a query and assert the database is configured. */
export async function query<T = unknown>(
  strings: TemplateStringsArray,
  ...values: unknown[]
): Promise<T[]> {
  if (!sql) throw new Error("DATABASE_URL is not configured.");
  return (await sql(strings, ...values)) as T[];
}

/** Run a query and return the first row, or null. */
export async function queryOne<T = unknown>(
  strings: TemplateStringsArray,
  ...values: unknown[]
): Promise<T | null> {
  const rows = await query<T>(strings, ...values);
  return rows[0] ?? null;
}
