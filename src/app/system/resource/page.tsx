"use client"

import { grafanaServerResourceParamAtom } from "@/atom/dashboardAtom"
import { GrafanaIframe } from "@/components/dashboard/GrafanaIframe"
import { useAtom } from "jotai"

export default function Page() {
  const [selected] = useAtom(grafanaServerResourceParamAtom)
  return (
    <>
      {/* <div style={{ width: 50, height: 20 }} /> */}
      {/* <ResourceOption /> */}
      {/* <div style={{ width: 50, height: 20 }} /> */}
      <GrafanaIframe
        src="/grafana/d/ae0ijnes4j7cwe/snms-server-resource?orgId=1&refresh=auto&kiosk&autofitpanels=true"
        selected={selected}
        title="서버자원관리"
      />
    </>
  )
}
