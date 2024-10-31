import { NextAuthConfig } from "next-auth"
// eslint-disable-next-line import/no-cycle
export const authConfig = {
  pages: {
    signIn: "/login", // 로그인 페이지 경로 설정
  },
  callbacks: {
    // 요청이 인증되었는지 확인하는 콜백 함수
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user // 사용자가 로그인했는지 여부 확인 !!는 boolean형으로 확실히 명시하기 위하여
      const isLoginPage =
        nextUrl.pathname === "/" ||
        nextUrl.pathname.startsWith("/login") ||
        nextUrl.pathname.startsWith("/signup")
      if (isLoginPage) {
        // 로그인 페이지는 누구나 접근 가능
        return true
      }

      // 로그인 페이지가 아닌 경우, 로그인한 사용자만 접근 가능
      return isLoggedIn
    },
    session({ session }) {
      // , token, user
      // 세션에 사용자 정보를 추가

      return session
    },
  },
  providers: [], // 인증 제공자는 초기에 빈 배열로 설정
} satisfies NextAuthConfig
