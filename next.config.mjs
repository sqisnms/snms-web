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
}

export default nextConfig
