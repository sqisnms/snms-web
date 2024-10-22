import { notoSansKR } from "@/components/styles/fonts"
import "@/components/styles/globals.css"
import ReactQueryProvider from "@/config/ReactQueryProvider"
import type { Metadata } from "next"

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
  return (
    <html lang="ko">
      <body className={`${notoSansKR.className} antialiased`}>
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </body>
    </html>
  )
}
