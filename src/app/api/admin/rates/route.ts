import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import { createAdminClient, adminConfigured } from "@/lib/supabase-admin";
import { DEFAULT_RATES } from "@/lib/data";
import type { AssetKey } from "@/lib/types";

export const dynamic = "force-dynamic";

const VALID_KEYS = new Set(DEFAULT_RATES.map((r) => r.key));

/** Verify the admin session cookie on this request. */
async function isAdmin(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get("bgc_admin_session")?.value;
  return verifySession(token);
}

/**
 * PUT /api/admin/rates
 * Body: { rates: [{ key, rate, active }] }
 * Upserts each row. Requires admin session + Supabase service role.
 */
export async function PUT(req: NextRequest) {
  if (!(await isAdmin(req))) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  if (!adminConfigured()) {
    return NextResponse.json(
      { error: "Supabase is not configured on the server." },
      { status: 503 }
    );
  }

  let body: { rates?: Array<{ key: string; rate: number; active: boolean }> };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const incoming = body.rates;
  if (!Array.isArray(incoming) || incoming.length === 0) {
    return NextResponse.json({ error: "No rates provided." }, { status: 400 });
  }

  // Validate + normalize.
  const rows = incoming
    .filter((r) => r && VALID_KEYS.has(r.key as AssetKey))
    .map((r) => ({
      key: r.key,
      rate: Math.max(0, Math.min(1_000_000, Number(r.rate) || 0)),
      active: !!r.active,
    }));

  if (rows.length === 0) {
    return NextResponse.json({ error: "No valid rate rows." }, { status: 400 });
  }

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("rates")
      .upsert(rows, { onConflict: "key" })
      .select("key, rate, active, updated_at");

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true, rates: data });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Server error." },
      { status: 500 }
    );
  }
}
