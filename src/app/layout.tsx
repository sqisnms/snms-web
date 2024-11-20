import Providers from "@/config/Providers"
import { notoSansKR } from "@/styles/fonts"
import "@/styles/globals.css"
import type { Metadata } from "next"
import { cookies } from "next/headers"

export const metadata: Metadata = {
  title: "Smart NMS",
  description: "스마트 네트워크 관리 시스템",
  metadataBase: new URL("https://snms-web.vercel.app/"),
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // 다크모드 초기 flickering 방지
  const cookie = cookies()
  const theme = cookie.get("theme")?.value ?? "light"

  return (
    <html lang="ko" className={theme}>
      <body className={`${notoSansKR.className} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
