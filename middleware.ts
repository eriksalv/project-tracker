import { NextRequest, NextResponse } from "next/server";

export default function middleware(req: NextRequest) {
  if (
    req.nextUrl.pathname.startsWith("/settings") ||
    req.nextUrl.pathname.startsWith("/new-project")
  ) {
    return requireAuth(req);
  }

  if (
    req.nextUrl.pathname.startsWith("/login") ||
    req.nextUrl.pathname.startsWith("/register")
  ) {
    return requireNoAuth(req);
  }

  return NextResponse.next();
}

function requireAuth(req: NextRequest) {
  const jwt = req.cookies.get("token");

  const loginUrl = new URL("/login", req.url);
  loginUrl.searchParams.set("from", req.nextUrl.pathname);

  if (!jwt) return NextResponse.redirect(loginUrl);

  return NextResponse.next();
}

function requireNoAuth(req: NextRequest) {
  const jwt = req.cookies.get("token");

  const baseUrl = new URL("/", req.url);
  baseUrl.searchParams.set("from", req.nextUrl.pathname);

  if (jwt) return NextResponse.redirect(baseUrl);

  return NextResponse.next();
}
