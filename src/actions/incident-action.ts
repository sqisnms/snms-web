"use server"

import { clickhouse } from "@/config/db"
import { IncidentLogType } from "@/types/incident"

export async function getIncidentList({
  rowsPerPage,
  page,
  count,
}: {
  rowsPerPage: number
  page: number
  count?: number
}) {
  const totalResult = await clickhouse.query({
    query: `
    SELECT COUNT(*) as count
    FROM FMDB.TBR_FM_LOG_MONITOR
    `,
    format: "JSONEachRow",
  })
  const totalResultJson = await totalResult.json()
  const totalResultFirst = totalResultJson[0] as { count: string }

  const totalItems = Number(totalResultFirst.count)
  const totalPages = totalItems * 1 === 0 ? 1 : Math.ceil(totalItems / rowsPerPage)

  const offset = (page - 1) * rowsPerPage

  const logResult = await clickhouse.query({
    query: `
    SELECT
      event_time, log_file, log_message, log_level, log_time
    FROM FMDB.TBR_FM_LOG_MONITOR
    ORDER BY log_time DESC
    LIMIT {rowsPerPage: Int32} OFFSET {offset: Int32}
    `,
    format: "JSONEachRow",
    query_params: { rowsPerPage, offset },
  })
  const logResultJson = await logResult.json()
  const logResults = logResultJson as Partial<IncidentLogType>[]

  return {
    data: count ? logResults.splice(0, count) : logResults,
    currentPage: page,
    totalPages,
    totalCounts: totalItems,
  }
}
