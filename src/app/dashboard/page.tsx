"use client"

import { dashboardSelectedAtom } from "@/atom/dashboardAtom"
import { TopTable } from "@/components/dashboard/TopTable"
import { ClickHouseQuerySample, PostgresQuerySample } from "@/components/sample/Sample"
import { useAtom } from "jotai"

export default function Page() {
  const [selected] = useAtom(dashboardSelectedAtom)
  return (
    <div>
      <h1>Grafana Dashboard</h1>
      <TopTable />
      <iframe
        width="100%"
        height="600"
        title="서버자원 모니터링"
        src={`grafana/d/ae0ijnes4j7cwe/server-resource?orgId=1&kiosk${selected}`}
        // &var-server_id=sqinms_m01&var-server_id=sqinms_m03
      />
      <div>
        <h2>데이터베이스 통계</h2>
        <PostgresQuerySample />
        <ClickHouseQuerySample />
        {/* <MariaDBQuerySample /> */}
      </div>
    </div>
  )
}
