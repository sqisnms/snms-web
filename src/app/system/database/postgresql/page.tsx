"use client"

import { grafanaServerProcessParamAtom } from "@/atom/dashboardAtom"
import { GrafanaIframe } from "@/components/dashboard/GrafanaIframe"
import { useAtom } from "jotai"

export default function Page() {
  const [selected] = useAtom(grafanaServerProcessParamAtom)
  return (
    <>
      {/* <div style={{ width: 50, height: 20 }} /> */}
      {/* <ProcessOption /> */}
      {/* <div style={{ width: 50, height: 20 }} /> */}
      <GrafanaIframe src="/grafana/d/000000039?kiosk" selected={selected} title="서버모니터링" />
    </>
  )
}
