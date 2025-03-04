"use server"

import { clickhouse } from "@/config/db"
import { SystemMonitorListType } from "@/types/system"

export async function getSystemMonitorList() {
  const logResult = await clickhouse.query({
    query: `
    SELECT * FROM SMDB.VI_SM_SYSTEM_MONITOR_LIST
    `,
    format: "JSONEachRow",
  })
  const logResultJson = await logResult.json()
  const logResults = logResultJson as SystemMonitorListType[]

  return logResults
}
