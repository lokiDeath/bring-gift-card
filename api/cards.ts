/**
 * GET /api/cards
 * Returns all active gift cards (public endpoint).
 * If `?includeInactive=1` and the caller is master, returns all cards.
 */
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { query } from "./_lib/db";
import { withCors, json, getAuth } from "./_lib/http";

interface CardRow {
  id: number;
  brand: string;
  slug: string;
  image_url: string;
  base_rate: string;       // Postgres numeric → string
  is_active: boolean;
  updated_at: string;
}

export default withCors(async (req: VercelRequest, res: VercelResponse) => {
  if (req.method !== "GET") {
    return json(res, { error: "Method not allowed." }, 405);
  }

  const auth = getAuth(req);
  const includeInactive = req.query.includeInactive === "1" && auth?.role === "master";

  const rows = includeInactive
    ? await query<CardRow>`SELECT id, brand, slug, image_url, base_rate, is_active, updated_at FROM gift_cards ORDER BY id ASC`
    : await query<CardRow>`SELECT id, brand, slug, image_url, base_rate, is_active, updated_at FROM gift_cards WHERE is_active = true ORDER BY id ASC`;

  const cards = rows.map((r) => ({
    id: r.id,
    brand: r.brand,
    slug: r.slug,
    imageUrl: r.image_url,
    baseRate: parseFloat(r.base_rate),
    isActive: r.is_active,
    updatedAt: r.updated_at,
  }));

  return json(res, cards);
});
