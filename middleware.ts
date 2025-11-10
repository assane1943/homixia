import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const session = req.cookies.get("homixia_session");

  // 🔐 Bloque l’accès à /admin sans session
  if (req.nextUrl.pathname.startsWith("/admin") && !session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

// ✅ Middleware actif sur toutes les routes /admin/*
export const config = {
  matcher: ["/admin/:path*"],
};
