import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import { createAdminClient, adminConfigured } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

async function isAdmin(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get("bgc_admin_session")?.value;
  return verifySession(token);
}

/**
 * PUT /api/admin/settings
 * Body: { whatsapp_number, email, address }
 * Updates the singleton settings row (id = 1).
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

  let body: { whatsapp_number?: string; email?: string; address?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const whatsapp = (body.whatsapp_number ?? "").replace(/\D/g, "");
  if (whatsapp.length < 6 || whatsapp.length > 15) {
    return NextResponse.json(
      { error: "WhatsApp number must be 6–15 digits (include country code, no '+')." },
      { status: 400 }
    );
  }
  const email = (body.email ?? "").trim().slice(0, 160);
  const address = (body.address ?? "").trim().slice(0, 300);

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("settings")
      .upsert({ id: 1, whatsapp_number: whatsapp, email, address }, { onConflict: "id" })
      .select("whatsapp_number, email, address")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true, settings: data });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Server error." },
      { status: 500 }
    );
  }
}
