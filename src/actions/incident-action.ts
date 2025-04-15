"use server"

import { clickhouse } from "@/config/db"
import { IncidentAlarmLogType, IncidentLogType, IncidentSysLogType } from "@/types/incident"
import { getCurrentUser } from "./account-actions"

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

export async function getIncidentSysList({
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
      , SUM(CASE WHEN log_level == 'emerg' then 1 else 0 end) as emerg
      , SUM(CASE WHEN log_level == 'alert' then 1 else 0 end) as alert
      , SUM(CASE WHEN log_level == 'crit' then 1 else 0 end) as crit
      , SUM(CASE WHEN log_level == 'err' then 1 else 0 end) as err
      , SUM(CASE WHEN log_level == 'warning' then 1 else 0 end) as warning
    FROM FMDB.TBR_FM_SYSLOG_MONITOR
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
    emerg: number
    alert: number
    crit: number
    err: number
    warning: number
  }

  const totalItems = totalResultFirst.total
  const totalPages = totalItems * 1 === 0 ? 1 : Math.ceil(totalItems / rowsPerPage)

  const offset = (page - 1) * rowsPerPage

  const logResult = await clickhouse.query({
    query: `
    SELECT
      event_time, server_id, log_message, log_level, log_time
    FROM FMDB.TBR_FM_SYSLOG_MONITOR
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
  const logResults = logResultJson as Partial<IncidentSysLogType>[]

  return {
    incidents: count ? logResults.splice(0, count) : logResults,
    currentPage: page,
    totalPages,
    totalCounts: totalItems,
    emerg: totalResultFirst.emerg,
    alert: totalResultFirst.alert,
    crit: totalResultFirst.crit,
    err: totalResultFirst.err,
    warning: totalResultFirst.warning,
  }
}

export async function updateTerminate({
  event_time,
  current_equip_id,
  alarmcode,
  severity,
}: Partial<IncidentAlarmLogType>) {
  try {
    const currentUser = await getCurrentUser() // 유저 정보
    const user_id = currentUser?.user_id

    const logResult = await clickhouse.command({
      query: `
        ALTER TABLE FMDB.TBR_FM_ALARM_OBJECT
        UPDATE
          terminationtimestamp = now64(6),
          terminationuserid = {user_id: String},
          state = 2,
          log_time = now64(6)
        WHERE formatDateTime(eventtime, '%Y-%m-%d %H:%i:%S') = {event_time: String}
          AND equip_id = {current_equip_id: String} AND alarmcode = {alarmcode: String}
          AND severity = {severity: String}
      `,
      query_params: {
        event_time,
        current_equip_id,
        alarmcode,
        severity,
        user_id,
      },
    })

    return logResult
  } catch (error) {
    console.error("Update failed:", error)
    throw error
  }
}
