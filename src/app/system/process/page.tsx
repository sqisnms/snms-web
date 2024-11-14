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
      <GrafanaIframe
        src="/grafana/d/be1q2wlewne9sc/snms-server-process?orgId=1&refresh=auto&kiosk&autofitpanels=true"
        selected={selected}
        title="서버프로세스관리"
      />
    </>
  )
}
