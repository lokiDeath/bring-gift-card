import { NextResponse } from "next/server";
import { getPublicConfig } from "@/lib/config";

/**
 * GET /api/config
 * Public endpoint returning live rates + site settings.
 * The number is included so the client can build wa.me links, but the
 * frontend is instructed (by design) to never print it as visible text.
 *
 * Revalidate every 60s at the edge so the calculator stays snappy, yet the
 * admin's edits propagate quickly. (Note: `dynamic` is intentionally left
 * unset so that `revalidate` is respected — setting both errors in Next 14.)
 */
export const revalidate = 60;

export async function GET() {
  const config = await getPublicConfig();
  return NextResponse.json(config, {
    headers: {
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
    },
  });
}
