import { NextRequest, NextResponse } from "next/server";

export default function middleware(req) {
  const path = req.nextUrl.pathname;
  const isPublicPath =  path === "/login" ;
  const token = req?.cookies?._parsed?.get("authToken")?.value;
  


  if (req.nextUrl.pathname.startsWith("/_next/")) {
    return NextResponse.next();
  }
  if (req.nextUrl.pathname.startsWith("/.next/")) {
    return NextResponse.next();
  }
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }
 
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/home", req.nextUrl));
  }

}


export const config = {
  matcher: [
     "/:path*",
  ],
};