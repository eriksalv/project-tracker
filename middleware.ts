import { NextRequest, NextResponse } from "next/server";

export default function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith("/settings")) {
    const response = new NextResponse();

    const { value, options } = response.cookies.getWithOptions("jwt");

    console.log(value);
    console.log(options);

    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("from", req.nextUrl.pathname);

    if (!value) return NextResponse.redirect(loginUrl);

    return NextResponse.next();
  }

  return NextResponse.next();
}
