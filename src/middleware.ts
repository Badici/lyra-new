import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Light gate for /admin — full ADMIN authorization still runs in admin layout via requireAdmin().
 * Avoids shipping admin shells to anonymous users when possible.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const sessionCookie =
    request.cookies.get("better-auth.session_token") ??
    request.cookies.get("__Secure-better-auth.session_token");

  if (!sessionCookie?.value) {
    const url = request.nextUrl.clone();
    url.pathname = "/cont";
    url.searchParams.set("mode", "login");
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
