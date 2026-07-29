import { SignJWT, jwtVerify } from "jose";

/**
 * Lightweight admin session.
 *
 * We use a signed JWT in an httpOnly cookie rather than Supabase Auth so the
 * admin login is decoupled from Supabase users. The admin panel reads/writes
 * Supabase data via RLS-allowed operations on a singleton settings row and the
 * `rates` table (RLS allows the service role / anon to upsert — see SQL).
 *
 * Credentials are compared with a constant-time check. Override via env vars
 * ADMIN_USERNAME / ADMIN_PASSWORD if you ever want to change them.
 */

const COOKIE_NAME = "bgc_admin_session";
const SESSION_TTL = 60 * 60 * 24 * 7; // 7 days (seconds)

function getSecret(): Uint8Array {
  const raw = process.env.ADMIN_JWT_SECRET;
  if (!raw) {
    // Deterministic dev fallback. In production set ADMIN_JWT_SECRET in Vercel.
    return new TextEncoder().encode("bring-gift-card-dev-secret-change-me");
  }
  return new TextEncoder().encode(raw);
}

export function getCredentials() {
  return {
    username: process.env.ADMIN_USERNAME || "bringgiftcard",
    password: process.env.ADMIN_PASSWORD || "xuanjuanloki",
  };
}

/** Constant-time string compare to avoid timing leaks. */
function safeEqual(a: string, b: string): boolean {
  const ea = new TextEncoder().encode(a);
  const eb = new TextEncoder().encode(b);
  if (ea.length !== eb.length) return false;
  let diff = 0;
  for (let i = 0; i < ea.length; i++) diff |= ea[i] ^ eb[i];
  return diff === 0;
}

export function verifyCredentials(username: string, password: string): boolean {
  const c = getCredentials();
  return safeEqual(username, c.username) && safeEqual(password, c.password);
}

export async function createSessionToken(): Promise<string> {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL}s`)
    .sign(getSecret());
}

export async function verifySession(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload.role === "admin";
  } catch {
    return false;
  }
}

export const SESSION_COOKIE = COOKIE_NAME;
export const SESSION_TTL_SECONDS = SESSION_TTL;
