import { NextAuthConfig } from "next-auth"

export const authConfig = {
  pages: {
    signIn: "/login", // 로그인 페이지 경로 설정
  },
  callbacks: {
    // 요청이 인증되었는지 확인하는 콜백 함수
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user // 사용자가 로그인했는지 여부 확인 !!는 boolean형으로 확실히 명시하기 위하여
      const isLoginPage = nextUrl.pathname.startsWith("/login")
      if (isLoginPage) {
        // 로그인 페이지는 누구나 접근 가능
        return true
      }

      // 로그인 페이지가 아닌 경우, 로그인한 사용자만 접근 가능
      return isLoggedIn
    },
  },
  providers: [], // 인증 제공자는 초기에 빈 배열로 설정
} satisfies NextAuthConfig
