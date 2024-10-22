"use client"

import {
  ClickHouseQuerySample,
  MariaDBQuerySample,
  PostgresQuerySample,
} from "@/components/sample/Sample"

export default function Page() {
  return (
    <div>
      <h1>Grafana Dashboard</h1>
      <iframe
        width="100%"
        height="600"
        title="서버자원 모니터링"
        src="grafana/public-dashboards/e3c44e0241b045f79980576d0e2d9229?orgId=1"
      />
      <div>
        <h2>데이터베이스 통계</h2>
        <PostgresQuerySample />
        <ClickHouseQuerySample />
        <MariaDBQuerySample />
      </div>
    </div>
  )
}
