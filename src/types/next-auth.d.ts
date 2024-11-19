// session 속성 재정의
// src/types/next-auth.d.ts

import "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      name: string
      email: string
    } & DefaultSession["user"]
    accessToken: string
    refreshToken: string
    expireAccess: number
  }

  interface User extends DefaultUser {
    user: {
      name: string
      email: string
    }
    accessToken: string
    refreshToken: string
    expireAccess: number
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    user: {
      name: string
      email: string
    }
    accessToken: string
    refreshToken: string
    expireAccess: number
  }
}
