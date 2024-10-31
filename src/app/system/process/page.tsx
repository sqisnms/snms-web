"use client"

import { grafanaServerProcessParamAtom } from "@/atom/dashboardAtom"
import { ProcessOption } from "@/components/dashboard/ProcessOption"
import { useContextPath } from "@/config/Providers"
import { useAtom } from "jotai"

export default function Page() {
  const [selected] = useAtom(grafanaServerProcessParamAtom)
  const contextPath = useContextPath()
  console.log(selected)
  return (
    <div>
      <h1>서버프로세스관리</h1>
      <div style={{ width: 50, height: 20 }} />
      <ProcessOption />
      <div style={{ width: 50, height: 20 }} />
      <iframe
        width="100%"
        height="600"
        title="서버자원 모니터링"
        src={`${
          contextPath
        }/grafana/d/be1q2wlewne9sc/snms-server-process?orgId=1&refresh=auto&kiosk${selected}`}
        // src={`${contextPath}/grafana/d/ae0ijnes4j7cwe/snms-server-resource?orgId=1&refresh=auto&kiosk${selected}`}
        /// grafana/d/ae0yw793f2800a/new-dashboard?orgId=1&from=1729567451243&to=1729589051243&refresh=auto&kiosk
        // grafana/d/ae0ijnes4j7cwe/server-resource?orgId=1&kiosk${selected}
        // &var-server_id=sqinms_m01&var-server_id=sqinms_m03
      />
    </div>
  )
}
