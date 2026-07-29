import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";

export const dynamic = "force-dynamic";

/** GET /api/auth/session → { authenticated: boolean } */
export async function GET(req: NextRequest) {
  const token = req.cookies.get("bgc_admin_session")?.value;
  const authenticated = await verifySession(token);
  return NextResponse.json({ authenticated });
}
