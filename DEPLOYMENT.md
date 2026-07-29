# Bring Gift Card — Deployment Guide (Vercel + Supabase)

A premium Next.js 14 gift-card / crypto / remittance trading site with a 3D exploded
hero, a live rate calculator, and an admin panel to update rates & the WhatsApp number
without redeploying.

---

## 1. Prerequisites

- A [Vercel](https://vercel.com) account (free tier is fine).
- A [Supabase](https://supabase.com) project (free tier is fine).
- Node.js 18+ installed locally (only needed for local testing).

---

## 2. Set up Supabase (the database)

1. Create a project at **supabase.com** → note your **Project URL**.
2. Go to **Project Settings → API** and copy:
   - `Project URL`
   - `anon public` key
   - `service_role` key (keep this secret!)
3. Open **SQL Editor → New query**, paste the **entire** contents of
   [`supabase/schema.sql`](./supabase/schema.sql), and click **Run**.
   - This creates the `rates` and `settings` tables, seeds default values,
     and enables Row Level Security (public READ only).
4. Verify:
   ```sql
   select key, rate, active from public.rates order by rate desc;
   select * from public.settings;
   ```
   You should see 17 rate rows and 1 settings row.

---

## 3. Set environment variables

### Local dev
Copy `.env.example` → `.env.local` and fill in your real values:
```bash
cp .env.example .env.local
```

### Vercel (production)
In your Vercel project → **Settings → Environment Variables**, add **all 6**:

| Name | Value | Notes |
|------|-------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://YOUR-PROJECT.supabase.co` | from Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | your anon key | safe to expose |
| `SUPABASE_SERVICE_ROLE_KEY` | your service role key | **secret**, never `NEXT_PUBLIC_` |
| `ADMIN_USERNAME` | `bringgiftcard` | (or your own) |
| `ADMIN_PASSWORD` | `xuanjuanloki` | (or your own) |
| `ADMIN_JWT_SECRET` | any long random string | e.g. `openssl rand -hex 32` |

> The defaults for username/password are already `bringgiftcard` / `xuanjuanloki`,
> so you can deploy with just the 3 Supabase keys + a JWT secret. Setting them
> explicitly is recommended.

---

## 4. Deploy to Vercel

1. Push the `bring-gift-card` folder to a GitHub repo.
2. In Vercel → **Add New Project** → import the repo.
3. Vercel auto-detects Next.js — **Framework Preset = Next.js**, leave the rest default.
4. Make sure the environment variables (step 3) are set.
5. Click **Deploy**. Done — no build errors expected.

The site root is the public landing page. The admin panel is at **`/admin`**
(login at `/admin/login`).

---

## 5. Using the Admin Panel

1. Visit `https://YOUR-DOMAIN/admin` → you'll be redirected to `/admin/login`.
2. Sign in with `bringgiftcard` / `xuanjuanloki`.
3. **Exchange Rates** tab:
   - Each row is **payout units per $1 USD** face value.
   - Example: to set a $100 Steam card from ₦0.80 → ₦0.82 effective, change the
     Steam rate and Save. The public calculator updates immediately (within the
     cache window, ~60s).
   - Toggle **ON/OFF** to show/hide an asset.
4. **Site Settings** tab:
   - **WhatsApp Number** — digits only, with country code (e.g. `2348012345678`).
     This powers **every** "Trade" button. It is **never** shown as visible text.
   - Edit email & office address as needed.
   - Save. Changes are live instantly.

---

## 6. Local development

```bash
cd bring-gift-card
npm install
npm run dev
```
Open `http://localhost:3000`. Admin at `http://localhost:3000/admin`.

---

## 7. Architecture (how the pieces connect)

```
Admin Panel (/admin)  ──►  PUT /api/admin/rates   ──┐
  (login: JWT cookie) ──►  PUT /api/admin/settings ─┤
                                                     ▼
                                          Supabase (Postgres)
                                          ├─ table: rates
                                          └─ table: settings
                                                     │
Public site (/)  ◄──────── GET /api/config ─────────┘
  ├─ Live calculator reads rates from context
  └─ "Trade" buttons open WhatsApp modal → wa.me link (number hidden)
```

- **Public reads** use the anon key + RLS (READ-only).
- **Admin writes** use the service-role key inside authenticated API routes
  (guarded by the JWT session cookie), bypassing RLS safely.
- If Supabase is ever unreachable, the site falls back to the static defaults
  in `src/lib/data.ts` so it **never breaks**.

---

## 8. Replacing the CSS gift-card art with real images (later)

The hero and showcase cards are pure CSS/SVG gradients by design (so you can
deploy with zero image assets). To use real brand art later:

- Drop images into `public/images/cards/` (e.g. `steam.jpg`).
- In `src/lib/data.ts`, add an `image?: string` field to `Asset` and set it.
- In the showcase card (`src/components/sections/showcase.tsx`), render
  `<img>` instead of the gradient `div` when `asset.image` is present.

The hero 3D card faces (`src/components/gift-card-3d.tsx`) can take a
`background-image` on `.card-face` via inline style — no logic change needed.
