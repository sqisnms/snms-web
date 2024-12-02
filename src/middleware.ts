import { auth } from "auth"
import NextAuth from "next-auth"
import { NextRequest, NextResponse } from "next/server"
import { authConfig } from "../auth.config"
import { NO_LOGIN_DEFAULT_PAGE, NO_LOGIN_PAGES } from "./config/const"

export default NextAuth(authConfig).auth

export async function middleware(request: NextRequest) {
  // Log the current request pathname
  // console.log("Current path:", request.nextUrl.pathname)
  const session = await auth()
  // console.log("session")
  // console.log(session)
  // console.log("session")
  const { pathname } = request.nextUrl
  const noLoginPage = NO_LOGIN_PAGES.includes(pathname)
  // pathname === "/" || pathname.startsWith("/login") || pathname.startsWith("/signup")

  if (!session && !noLoginPage) {
    return NextResponse.redirect(new URL(NO_LOGIN_DEFAULT_PAGE, request.url))
  }

  const headers = new Headers(request.headers)
  headers.set("x-current-path", request.nextUrl.pathname)
  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$|grafana/|qrScan/|token/).*)"],
}
