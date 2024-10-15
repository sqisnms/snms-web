import { NextAuthConfig } from "next-auth"

export const authConfig = {
  pages: {
    signIn: "/login", // 로그인 페이지 경로 설정
  },
  callbacks: {
    // 요청이 인증되었는지 확인하는 콜백 함수
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user // 사용자가 로그인했는지 여부 확인 !!는 boolean형으로 확실히 명시하기 위하여

      // sample: 대시보드는 로그인한 사용자만 접근 가능
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard")
      if (isOnDashboard) {
        return isLoggedIn // 대시보드는 로그인한 사용자만 접근 가능
      }
      if (isLoggedIn) {
        return Response.redirect(new URL("/dashboard", nextUrl)) // 로그인한 사용자를 대시보드로 리다이렉트
      }

      return true // 그 외에는 페이지 접근 허용
    },
  },
  providers: [], // 인증 제공자는 초기에 빈 배열로 설정
} satisfies NextAuthConfig
