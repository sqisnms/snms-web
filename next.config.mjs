/** @type {import('next').NextConfig} */
const nextConfig = {
  // rewrites() {
  //   return [
  //     {
  //       source: "/grafana/:path*",
  //       destination: `${process.env.GRAFANA_URL}/grafana/:path*`,
  //     },
  //     // {
  //     //   source: "/grafana/:path*",
  //     //   destination: `${process.env.GRAFANA_URL}/grafana/:path*`,
  //     //   has: [
  //     //     {
  //     //       type: "header",
  //     //       key: "connection",
  //     //       value: "upgrade",
  //     //     },
  //     //   ],
  //     // },
  //   ]
  // },
}

export default nextConfig
