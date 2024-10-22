"use client"

import { useClickHouseSample, useMariaDBSample, usePostgresSample } from "@/hooks/useSample"

// interface ClickHouseData {
//   cnt: string
// }

// async function getClickHouseData() {
//   const result = await clickhouse.query({
//     query: "select count(1) as cnt from TBR_SM_SYSTEM_INFO",
//     format: "JSONEachRow",
//   })

//   const rows = await result.json()
//   return (rows[0] as ClickHouseData) || { cnt: -1 }
// }

export function ClickHouseQuerySample() {
  const { data, isLoading, error } = useClickHouseSample(undefined, {
    // refetchInterval: 5000,
  })

  if (isLoading) return <div>로딩 중...</div>
  if (error) return <div>에러 발생: {error.message}</div>

  return (
    <div>
      <h3>ClickHouse 통계</h3>
      <p>TBR_SM_SYSTEM_INFO 수: {data.cnt}</p>
      <p>query: select count(1) as cnt from TBR_SM_SYSTEM_INFO</p>
    </div>
  )
}

export function MariaDBQuerySample() {
  const { data, isLoading, error } = useMariaDBSample(undefined, {
    // refetchInterval: 5000,
  })

  if (isLoading) return <div>로딩 중...</div>
  if (error) return <div>에러 발생: {error.message}</div>

  return (
    <div>
      <h3>MariaDB 통계</h3>
      <p>TBD_DC_CMD_PARAMETER 수: {data.cnt}</p>
      <p>query: select count(1) as cnt from TBD_DC_CMD_PARAMETER </p>
    </div>
  )
}

export function PostgresQuerySample() {
  // const { data, isLoading, error } = useQuery({
  //   queryKey: ["samplePostgres"],
  //   queryFn: () => samplePostgres(),
  //   refetchInterval: 5000,
  // })
  const { data, isLoading, error } = usePostgresSample(undefined, {
    // refetchInterval: 5000,
  })

  if (isLoading) return <div>로딩 중...</div>
  if (error) return <div>에러 발생: {error.message}</div>
  return (
    <div>
      <h3>PostgreSQL 통계</h3>
      <p>users 수: {data?.cnt ?? 0}</p>
      <p>query: SELECT count(1)::text as cnt FROM users</p>
    </div>
  )
}
