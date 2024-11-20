import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
// eslint-disable-next-line import/no-cycle
import { AES } from "crypto-js"
import Utf8 from "crypto-js/enc-utf8"
import { authConfig } from "./auth.config"

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  providers: [
    // 로컬 DB 로그인
    // Credentials({
    //   async authorize(credentials) {
    //     const parsedCredentials = z
    //       .object({ email: z.string().email(), password: z.string().min(6) })
    //       .safeParse(credentials)

    //     if (parsedCredentials.success) {
    //       const { email, password } = parsedCredentials.data
    //       const user = await getUser(email)
    //       if (!user) return null
    //       const passwordsMatch = await bcrypt.compare(password, user.password)

    //       if (passwordsMatch) return user
    //     }

    //     // eslint-disable-next-line no-console
    //     console.log("Invalid credentials")
    //     return null
    //   },
    // }),
    Credentials({
      async authorize(credentials, request) {
        if (credentials.qrInfo) {
          const bytes = AES.decrypt(
            credentials.qrInfo as string,
            process.env.AUTH_SERVER_API_KEY ?? "",
          )
          const decrypted = JSON.parse(bytes.toString(Utf8))
          return decrypted
        }
        if (credentials.email && credentials.password) {
          const response = await fetch(new URL("/token/genToken", request.url), {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: credentials.email,
              userPwd: credentials.password,
            }),
          })
          if (!response.ok) {
            console.log("인증에 실패했습니다.")
            return null
          }
          const data = await response.json()
          // console.log("await response.json()")
          // console.log(data)
          if (data.code !== "0000") return null
          return data.data
        }

        return null
      },
    }),
  ],
})
