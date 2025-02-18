"use server"

import { clickhouse } from "@/config/db"
import { IncidentLogType } from "@/types/incident"

export async function getIncidentList({
  rowsPerPage,
  page,
  startDate,
  endDate,
  logLevel,
  count,
}: {
  rowsPerPage: number
  page: number
  startDate: string
  endDate: string
  logLevel: string
  count?: number
}) {
  const totalResult = await clickhouse.query({
    query: `
    SELECT
      COUNT(*) as total
      , SUM(CASE WHEN log_level == 'CRITICAL' then 1 else 0 end) as crit
      , SUM(CASE WHEN log_level == 'ERROR' then 1 else 0 end) as err
      , SUM(CASE WHEN log_level == 'WARNING' then 1 else 0 end) as warn
    FROM FMDB.TBR_FM_LOG_MONITOR
    WHERE 1 = 1
      AND (log_time >= {startDate: String} OR {startDate: String} = '')
      AND (log_time <= {endDate: String} OR {endDate: String} = '')
      AND (log_level = {logLevel: String} OR {logLevel: String} = '')
    `,
    format: "JSONEachRow",
    query_params: {
      startDate,
      endDate,
      logLevel,
    },
  })
  const totalResultJson = await totalResult.json()
  const totalResultFirst = totalResultJson[0] as {
    total: number
    crit: number
    err: number
    warn: number
  }

  const totalItems = totalResultFirst.total
  const totalPages = totalItems * 1 === 0 ? 1 : Math.ceil(totalItems / rowsPerPage)

  const offset = (page - 1) * rowsPerPage

  const logResult = await clickhouse.query({
    query: `
    SELECT
      event_time, log_file, log_message, log_level, log_time
    FROM FMDB.TBR_FM_LOG_MONITOR
    WHERE 1 = 1
      AND (log_time >= {startDate: String} OR {startDate: String} = '')
      AND (log_time <= {endDate: String} OR {endDate: String} = '')
      AND (log_level = {logLevel: String} OR {logLevel: String} = '')
    ORDER BY log_time DESC
    LIMIT {rowsPerPage: Int32} OFFSET {offset: Int32}
    `,
    format: "JSONEachRow",
    query_params: { rowsPerPage, offset, startDate, endDate, logLevel },
  })
  const logResultJson = await logResult.json()
  const logResults = logResultJson as Partial<IncidentLogType>[]

  return {
    incidents: count ? logResults.splice(0, count) : logResults,
    currentPage: page,
    totalPages,
    totalCounts: totalItems,
    crit: totalResultFirst.crit,
    err: totalResultFirst.err,
    warn: totalResultFirst.warn,
  }
}
