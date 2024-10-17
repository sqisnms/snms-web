import { clickhouse } from "@/utils/db"

interface ClickHouseData {
  cnt: string
}

async function getClickHouseData() {
  const result = await clickhouse.query({
    query: "select count(1) as cnt from TBR_SM_SYSTEM_INFO",
    format: "JSONEachRow",
  })

  const rows = await result.json()
  return (rows[0] as ClickHouseData) || { cnt: -1 }
}

export async function ClickHouseSample() {
  const data = await getClickHouseData()

  return (
    <div>
      <h3>ClickHouse 통계</h3>
      <p>TBR_SM_SYSTEM_INFO 수: {data.cnt}</p>
      <p>query: select count(1) as cnt from TBR_SM_SYSTEM_INFO</p>
    </div>
  )
}
