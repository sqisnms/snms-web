// import { IncomingMessage, ServerResponse } from "http"
// import { createProxyMiddleware } from "http-proxy-middleware"
// import { NextApiRequest, NextApiResponse } from "next"
// import { NextRequest, NextResponse } from "next/server"

// const API_KEY = process.env.GRAFANA_API_KEY ?? ""
// const GRAFANA_URL = process.env.GRAFANA_URL ?? "" // Grafana 서버의 URL

// // const proxy = httpProxy.createProxyServer({})

// export async function GET(request: NextRequest) {
//   return handleProxy331(request)
// }

// export async function POST(request: NextRequest) {
//   return handleProxy(request)
// }

// const proxyOptions: Options = {
//   target: GRAFANA_URL, // 외부 사이트 URL
//   changeOrigin: true, // 외부 사이트의 호스트 헤더 변경
//   pathRewrite: { "^/api/grafana": "" }, // '/api/proxy' 경로를 외부 사이트의 기본 경로로 변환
//   onProxyReq: (proxyReq: IncomingMessage, req: NextApiRequest, res: ServerResponse) => {
//     // 외부 API로 요청 시 API Key 추가
//     proxyReq.setHeader("Authorization", `Bearer ${API_KEY}`)
//     console.log(`프록시 요청: ${req.method} ${req.url}`)
//   },
// }

// // 프록시 미들웨어 사용
// const proxy = createProxyMiddleware(proxyOptions)

// async function handleProxy(req: NextApiRequest, res: NextApiResponse) {
//   return new Promise((resolve, reject) => {
//     proxy(req, res, (result) => {
//       if (result instanceof Error) {
//         return reject(result)
//       }
//       resolve(result)
//     })
//   })
// }

// async function handleProxy331(request: NextRequest): Promise<NextResponse> {
//   const { method, headers: requestHeaders, url } = request
//   const requestUrl = new URL(url)
//   const path = requestUrl.pathname.replace(/^\/api\/grafana/, "")
//   const targetUrl = new URL(path + requestUrl.search, GRAFANA_URL)

//   const headers = new Headers(requestHeaders)
//   headers.set("Authorization", `Bearer ${API_KEY}`)
//   headers.set("Host", new URL(GRAFANA_URL).host)

//   console.log("#333")
//   console.log(targetUrl)

//   try {
//     const response = await fetch(targetUrl.toString(), {
//       method,
//       headers,
//       body: method !== "GET" && method !== "HEAD" ? request.body : undefined,
//     })

//     const responseHeaders = new Headers(response.headers)
//     responseHeaders.delete("content-encoding") // 압축된 응답을 처리하지 않도록 합니다

//     return new NextResponse(response.body, {
//       status: response.status,
//       statusText: response.statusText,
//       headers: responseHeaders,
//     })
//   } catch (error) {
//     console.error("프록시 오류:", error)
//     return new NextResponse("Internal Server Error", { status: 500 })
//   }
// }

import { NextResponse } from "next/server"

export async function GET() {
  // eslint-disable-next-line no-console
  console.error("22221")
  return NextResponse.json({ message: "GET 요청" })
}

export async function POST() {
  // eslint-disable-next-line no-console
  console.error("22223")
  return NextResponse.json({ message: "POST 요청" })
}
