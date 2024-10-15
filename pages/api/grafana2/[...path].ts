import { createProxyMiddleware } from "http-proxy-middleware"
import { NextApiRequest, NextApiResponse } from "next"

const API_KEY = process.env.GRAFANA_API_KEY ?? ""
const GRAFANA_URL = process.env.GRAFANA_URL ?? ""

const proxy = createProxyMiddleware({
  target: GRAFANA_URL,
  changeOrigin: true,
  pathRewrite: { "^/api/grafana2": "" },
  // onProxyReq: (proxyReq) => {
  //   proxyReq.setHeader("Authorization", `Bearer ${API_KEY}`)
  // },
  auth: `api-key:${API_KEY}`,
})

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // eslint-disable-next-line no-console
  console.log("!!!!!!!!!!!!!!!!!handler")
  // eslint-disable-next-line no-console
  console.log(req.url)
  proxy(req, res, (result: unknown) => {
    // eslint-disable-next-line no-console
    console.log("!!!!!!!!!!!!!!!!!handler22222")
    // eslint-disable-next-line no-console
    console.log(result)
    if (result instanceof Error) {
      throw result
    }
  })
}

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
}
