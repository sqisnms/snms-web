import NextAuth from "next-auth"
import { NextRequest, NextResponse } from "next/server"
import { authConfig } from "../auth.config"

export default NextAuth(authConfig).auth

export function middleware(request: NextRequest) {
  // Log the current request pathname
  // console.log("Current path:", request.nextUrl.pathname)

  const headers = new Headers(request.headers)
  headers.set("x-current-path", request.nextUrl.pathname)
  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
}
