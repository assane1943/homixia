import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ❌ Ne jamais toucher les API
  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  // 🎯 Admin login reste accessible
  if (pathname.startsWith("/admin/login")) {
    return NextResponse.next();
  }

  // 🔐 Vérifie le cookie admin pour /admin
  if (pathname.startsWith("/admin")) {
    const cookie = req.cookies.get("homixia_admin");

    if (!cookie) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",   // protéger pages admin
    "/api/:path*",     // ⚠️ matcher nécessaire mais on le laisse passer dans le code
  ],
};
