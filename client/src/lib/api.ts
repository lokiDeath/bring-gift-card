/**
 * API client — typed fetch wrapper for the Vercel serverless backend.
 * Reads JWT from localStorage and attaches it as a Bearer token.
 */
import type { AuthSession, GiftCard, User, UserRole } from "./types";

const TOKEN_KEY = "bgc_token";
const USER_KEY = "bgc_user";

export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setSession(session: AuthSession) {
  try {
    localStorage.setItem(TOKEN_KEY, session.token);
    localStorage.setItem(USER_KEY, JSON.stringify(session.user));
  } catch {
    /* ignore */
  }
}

export function clearSession() {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  } catch {
    /* ignore */
  }
}

export function getStoredUser(): User | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(path, {
    ...options,
    headers,
    cache: "no-store",
  });

  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      message = body.error || body.details || message;
    } catch {
      /* ignore */
    }
    throw new Error(message);
  }
  return res.json() as Promise<T>;
}

/* ============ Public endpoints ============ */

export function fetchGiftCards(): Promise<GiftCard[]> {
  return request<GiftCard[]>("/api/cards");
}

/* ============ Auth ============ */

export function login(username: string, password: string): Promise<AuthSession> {
  return request<AuthSession>("/api/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

export function fetchMe(): Promise<{ user: User }> {
  return request<{ user: User }>("/api/me");
}

/* ============ Admin: rate management ============ */

export function updateRate(id: number, baseRate: number): Promise<{ card: GiftCard }> {
  return request<{ card: GiftCard }>(`/api/rates`, {
    method: "POST",
    body: JSON.stringify({ id, baseRate }),
  });
}

export function toggleCardActive(id: number, isActive: boolean): Promise<{ card: GiftCard }> {
  return request<{ card: GiftCard }>(`/api/rates`, {
    method: "PATCH",
    body: JSON.stringify({ id, isActive }),
  });
}

/* ============ Admin: user management (master only) ============ */

export function listUsers(): Promise<{ users: User[] }> {
  return request<{ users: User[] }>("/api/users");
}

export function createUser(
  username: string,
  password: string,
  role: UserRole
): Promise<{ user: User }> {
  return request<{ user: User }>("/api/users", {
    method: "POST",
    body: JSON.stringify({ username, password, role }),
  });
}

export function deleteUser(id: number): Promise<{ ok: true }> {
  return request<{ ok: true }>(`/api/users?id=${id}`, { method: "DELETE" });
}
