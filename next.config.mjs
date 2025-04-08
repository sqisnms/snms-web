// eslint-disable-next-line import/extensions
// import { updateResource } from "@/batch/init/updateResource"
// eslint-disable-next-line import/extensions
// import { PHASE_DEVELOPMENT_SERVER, PHASE_PRODUCTION_SERVER } from "next/constants.js"

const nextConfig = {
  output: "standalone",
  rewrites() {
    return [
      {
        source: "/grafana/:path*",
        destination: `${process.env.GRAFANA_URL}/grafana/:path*`,
      },
      {
        source: "/qrScan/:path*",
        destination: `${process.env.AUTH_SERVER_URL}/api/qrScan/:path*`,
      },
      {
        source: "/token/:path*",
        destination: `${process.env.AUTH_SERVER_URL}/api/token/:path*`,
      },
      {
        source: "/_superset/:path*",
        destination: `${process.env.SUPERSET_URL}/:path*`,
      },
      {
        source: "/superset/:path*",
        destination: `${process.env.SUPERSET_URL}/superset/:path*/`,
      },
    ]
  },
  webpack(config) {
    config.module.rules.push({
      test: /jest\.config\.ts$/, // jest.config.ts를 타겟으로 설정
      use: "null-loader", // 해당 파일을 무시
    })

    return config
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "30mb", // 요청 바디 크기 제한을 30MB로 설정
    },
  },
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const init = false
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default async (phase) => {
  // 서버 기동 직전에 처리해야할 작업이 있다면 여기서 하면 됨
  // if (!init && (phase === PHASE_DEVELOPMENT_SERVER || phase === PHASE_PRODUCTION_SERVER)) {
  //   init = true
  //   await updateResource()
  // }
  return nextConfig
}
