"use client"

import { grafanaServerProcessParamAtom } from "@/atom/dashboardAtom"
import { GrafanaIframe } from "@/components/dashboard/GrafanaIframe"
import { ProcessOption } from "@/components/dashboard/ProcessOption"
import { useAtom } from "jotai"

export default function Page() {
  const [selected] = useAtom(grafanaServerProcessParamAtom)
  return (
    <div>
      <h1>서버프로세스관리</h1>
      <div style={{ width: 50, height: 20 }} />
      <ProcessOption />
      <div style={{ width: 50, height: 20 }} />
      <GrafanaIframe
        src="/grafana/d/be1q2wlewne9sc/snms-server-process?orgId=1&refresh=auto&kiosk"
        selected={selected}
        title="서버프로세스관리"
      />
    </div>
  )
}
