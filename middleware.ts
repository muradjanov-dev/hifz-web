import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, verifySession } from "@/lib/admin-session";

// Gate /admin/* (except /admin/login) behind the signed session cookie.
// All admin API routes verify independently — this middleware just
// keeps the unauthenticated user out of the UI pages.
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (!pathname.startsWith("/admin")) return NextResponse.next();
  if (pathname === "/admin/login") return NextResponse.next();

  const cookie = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  if (verifySession(cookie)) return NextResponse.next();

  const loginUrl = req.nextUrl.clone();
  loginUrl.pathname = "/admin/login";
  loginUrl.searchParams.set("from", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*"],
};
