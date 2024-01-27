import { NextRequest, NextResponse } from "next/server";

export default function middleware(req) { 

}


export const config = {
    matcher: [
      "/((?!resetPassword).*)",
       "/:path*",
      
    ],
  };