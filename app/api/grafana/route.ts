import { createProxyMiddleware, Options } from 'http-proxy-middleware';
import { NextApiRequest, NextApiResponse } from 'next';

const API_KEY = process.env.GRAFANA_API_KEY ?? '';
const GRAFANA_URL = process.env.GRAFANA_URL ?? ''; // Grafana 서버의 URL

export const config = {
  api: {
    bodyParser: false, // Request body 파싱 비활성화
  },
};

const proxyOptions: Options = {
  target: GRAFANA_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/api/grafana': '/', // /api/grafana 경로를 Grafana 기본 경로로 변경
  },
  onProxyReq: (proxyReq) => {
    proxyReq.setHeader('Authorization', `Bearer ${API_KEY}`);
  },
};

const proxy = createProxyMiddleware(proxyOptions);

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  return proxy(req, res, (result) => {
    if (result instanceof Error) {
      throw result;
    }
    return result;
  });
}
