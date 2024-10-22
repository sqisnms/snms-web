"use server"

import { clickhouse, mariadb, postgres } from "@/config/db"

export async function sampleClickHouse() {
  const result = await clickhouse.query({
    query: "select count(1) as cnt from TBR_SM_SYSTEM_INFO",
    format: "JSONEachRow",
  })
  const rows = await result.json()
  return rows[0] as { cnt: string }
}

export async function sampleMariaDB() {
  const result = await mariadb.execute("select count(1) as cnt from TBD_DC_CMD_PARAMETER")
  const [rows] = result as unknown as [{ cnt: string }[]]
  return rows[0]
}

export async function samplePostgres() {
  const { rows } = await postgres.query<{ cnt: string }>("SELECT count(1)::text as cnt FROM users")

  return rows[0]
}
