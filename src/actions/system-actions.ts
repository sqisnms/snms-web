"use server"

import { clickhouse } from "@/config/db"
import { ProcessMastType, ProcessMonitorListType, SystemMonitorListType } from "@/types/system"

export async function getSystemMonitorList() {
  const logResult = await clickhouse.query({
    query: `
    SELECT * FROM SMDB.VI_SM_SYSTEM_MONITOR_LIST
    ORDER BY server_id asc
    `,
    format: "JSONEachRow",
  })
  const logResultJson = await logResult.json()
  const logResults = logResultJson as SystemMonitorListType[]

  return logResults
}

export async function getProcessMonitorList() {
  const logResult = await clickhouse.query({
    query: `
    SELECT * FROM SMDB.VI_SM_PROCESS_MONITOR_LIST
    ORDER BY server_id asc
    `,
    format: "JSONEachRow",
  })
  const logResultJson = await logResult.json()
  const logResults = logResultJson as ProcessMonitorListType[]

  return logResults
}

export async function getProcessMast({
  serverId,
  processName,
}: {
  serverId: string
  processName: string
}) {
  const logResult = await clickhouse.query({
    query: `
    SELECT * FROM SMDB.TBD_SM_PROCESS_MAST
    WHERE server_id = {serverId: String} and process_name = {processName: String}
    `,
    format: "JSONEachRow",
    query_params: {
      serverId,
      processName,
    },
  })
  const logResultJson = await logResult.json()
  const logResults = logResultJson as ProcessMastType[]

  return logResults[0]
}

export async function insertProcessMast({
  server_id,
  process_name,
  process_kind,
  process_directory,
  execute_kind,
}: ProcessMastType) {
  try {
    const existingData = await getProcessMast({
      serverId: server_id,
      processName: process_name,
    })

    if (existingData) {
      throw new Error("해당 server_ID 와 프로세스명은 중복입니다.")
    }

    const logResult = await clickhouse.command({
      query: `
        INSERT INTO SMDB.TBD_SM_PROCESS_MAST (
          server_id,
          process_name,
          process_kind,
          process_directory,
          execute_kind
        )
        VALUES (
          {server_id: String},
          {process_name: String},
          {process_kind: String},
          {process_directory: String},
          {execute_kind: String}
        )
      `,
      query_params: {
        server_id,
        process_name,
        process_kind,
        process_directory,
        execute_kind,
      },
    })

    return logResult
  } catch (error) {
    console.error("Insert failed:", error)
    throw error
  }
}

export async function updateProcessMast({
  server_id,
  process_name,
  process_kind,
  process_directory,
  execute_kind,
}: ProcessMastType) {
  try {
    const existingData = await getProcessMast({
      serverId: server_id,
      processName: process_name,
    })

    if (!existingData) {
      throw new Error("존재하지 않는 데이터입니다.")
    }

    const logResult = await clickhouse.command({
      query: `
        ALTER TABLE SMDB.TBD_SM_PROCESS_MAST
        UPDATE
          process_kind = {process_kind: String},
          process_directory = {process_directory: String},
          execute_kind = {execute_kind: String}
        WHERE server_id = {server_id: String} AND process_name = {process_name: String}
      `,
      query_params: {
        server_id,
        process_name,
        process_kind,
        process_directory,
        execute_kind,
      },
    })

    return logResult
  } catch (error) {
    console.error("Update failed:", error)
    throw error
  }
}

export async function deleteProcessMast({
  serverId,
  processName,
}: {
  serverId: string
  processName: string
}) {
  const logResult = await clickhouse.command({
    query: `
      DELETE FROM SMDB.TBD_SM_PROCESS_MAST
      WHERE server_id = {serverId: String} AND process_name = {processName: String}
    `,
    query_params: {
      serverId,
      processName,
    },
  })

  return logResult
}

export async function getServerId() {
  const logResult = await clickhouse.query({
    query: `
    SELECT * FROM SMDB.VI_SM_PROCESS_MONITOR_SERVER_ID_COMBO
    ORDER BY equip_id asc
    `,
    format: "JSONEachRow",
  })
  const logResultJson = await logResult.json()
  const logResults = logResultJson as { equip_id: string }[]

  return logResults
}

export async function getProcessName({ serverId }: { serverId: string }) {
  const logResult = await clickhouse.query({
    query: `
    SELECT * FROM SMDB.VI_SM_PROCESS_MONITOR_PROCESS_NAME_COMBO
    WHERE server_id = {serverId: String}
    ORDER BY process_name asc
    `,
    format: "JSONEachRow",
    query_params: {
      serverId,
    },
  })
  const logResultJson = await logResult.json()
  console.log(logResultJson)
  const logResults = logResultJson as { server_id: string; process_name: string }[]

  return logResults
}
