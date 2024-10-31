/** @type {import('next').NextConfig} */
const nextConfig = {
  rewrites() {
    return [
      {
        source: "/grafana/:path*",
        destination: `${process.env.GRAFANA_URL}/grafana/:path*`,
      },
    ]
  },
}

export default nextConfig
