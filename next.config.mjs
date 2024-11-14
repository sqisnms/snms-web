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
    ]
  },
}

export default nextConfig
