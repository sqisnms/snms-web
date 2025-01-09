/** @type {import('next').NextConfig} */
const nextConfig = {
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
    ]
  },
  webpack(config) {
    config.module.rules.push({
      test: /jest\.config\.ts$/, // jest.config.ts를 타겟으로 설정
      use: "null-loader", // 해당 파일을 무시
    })

    return config
  },
}

export default nextConfig
