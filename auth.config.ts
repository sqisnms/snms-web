import { NextAuthConfig, User } from "next-auth"

// eslint-disable-next-line import/no-cycle
export const authConfig = {
  pages: {
    signIn: "/login", // 로그인 페이지 경로 설정
  },
  // 로컬 DB 로그인
  // callbacks: {
  //   // 요청이 인증되었는지 확인하는 콜백 함수
  //   authorized({ auth, request: { nextUrl } }) {
  //     const isLoggedIn = !!auth?.user // 사용자가 로그인했는지 여부 확인 !!는 boolean형으로 확실히 명시하기 위하여
  //     const isLoginPage =
  //       nextUrl.pathname === "/" ||
  //       nextUrl.pathname.startsWith("/login") ||
  //       nextUrl.pathname.startsWith("/signup")
  //     if (isLoginPage) {
  //       // 로그인 페이지는 누구나 접근 가능
  //       return true
  //     }

  //     // 로그인 페이지가 아닌 경우, 로그인한 사용자만 접근 가능
  //     return isLoggedIn
  //   },
  //   session({ session }) {
  //     // , token, user
  //     // 세션에 사용자 정보를 추가

  //     return session
  //   },
  // },
  callbacks: {
    async jwt({ token, user }) {
      // console.log("Jwt Callback()")
      // console.log(token)
      // console.log(user)
      // console.log(token.expireAccess)
      // authorize 함수의 반환값이 user에 담겨서 넘어온다.
      // user 객체가 있다는 것은 signin이 성공한 직후의 요청
      if (user) {
        // console.log(user)
        const extendedUser = user
        return {
          ...token,
          accessToken: extendedUser.accessToken,
          refreshToken: extendedUser.refreshToken,
          user: user.user as User,
          expireAccess: new Date().getTime() + 30 * 60 * 1000,
        }
      }
      if (new Date().getTime() < (token.expireAccess as number)) {
        // user 객체가 없다는 것은 단순 세션 조회를 위한 요청
        // console.log("valid accessToken")
        // console.log(token)
        return token
      }

      // console.log("go refreshToken")
      // console.log(token)
      if (!token.refreshToken) {
        // console.log("!token.refreshToken")
        return token
      }
      const response = await fetch(
        // 현재 URL을 이 위치에서는 받아올 수 없어서 직접 호출
        new URL("/api/token/genRefreshToken", process.env.AUTH_SERVER_URL),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.AUTH_SERVER_API_KEY ?? "",
          },
          body: JSON.stringify({
            refreshToken: token.refreshToken,
          }),
        },
      )
      if (!response.ok) {
        // console.log("토큰 갱신에 실패했습니다.")
        // console.log(response)
        return null
      }
      const data = await response.json()
      // console.log("await response.json()")
      // console.log(data)
      if (data.code !== "0000") return null
      // console.log(new Date().getTime() + 1*5*1000)
      const newExp = new Date().getTime() + 30 * 60 * 1000
      // console.log(`finish refreshToken : ${newExp}`)
      return {
        ...token,
        accessToken: data.data.accessToken,
        refreshToken: data.data.refreshToken,
        expireAccess: newExp,
      }
    },

    async session({ session, token }) {
      // console.log("Session Callback()")
      // console.log(session)
      // console.log("token.expireAccess : " + token.expireAccess)
      // 4.Jwt Callback으로부터 반환받은 token값을 기존 세션에 추가한다
      if (token) {
        // eslint-disable-next-line no-param-reassign
        session.accessToken = token.accessToken as string
        // eslint-disable-next-line no-param-reassign
        session.refreshToken = token.refreshToken as string
        // eslint-disable-next-line no-param-reassign
        session.user.name = (token.user as { name: string; email: string }).name
        // eslint-disable-next-line no-param-reassign
        session.user.email = (token.user as { name: string; email: string }).email
        // eslint-disable-next-line no-param-reassign
        session.expireAccess = token.expireAccess as number
      }
      // console.log(session)
      return session
    },
  },
  providers: [], // 인증 제공자는 초기에 빈 배열로 설정
  // session: {strategy: "jwt"}
} satisfies NextAuthConfig
