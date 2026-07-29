import { NextResponse, type NextRequest } from "next/server";
import { verifySession } from "@/lib/auth";

/**
 * Protect /admin routes. /admin/login is public so the owner can sign in.
 * Everything else under /admin requires a valid session cookie.
 *
 * Note: jose's jwtVerify works in the Edge runtime (no Node APIs needed),
 * so this middleware is Edge-compatible for Vercel.
 */
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow the login page itself.
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  const token = req.cookies.get("bgc_admin_session")?.value;
  const ok = await verifySession(token);

  if (!ok) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/admin/login";
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
