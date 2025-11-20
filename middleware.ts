import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // L’admin-login doit rester accessible
  if (pathname.startsWith("/admin/login")) {
    return NextResponse.next();
  }

  // Vérifie le cookie admin
  const cookie = req.cookies.get("homixia_admin");

  // Pas de cookie → redirection vers login
  if (!cookie) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }

  // Cookie ok → continuer
  return NextResponse.next();
}

// On protège tout le /admin sauf /admin/login
export const config = {
  matcher: ["/admin/:path*"],
};
