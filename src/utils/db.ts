import { createClient } from "@clickhouse/client"
import mysql from "mysql2/promise"
import { Pool } from "pg"

// PostgreSQL 연결 설정
const postgres = new Pool({
  connectionString: process.env.POSTGRES_URL,
})

// ClickHouse 연결 설정
const clickhouse = createClient({
  url: process.env.CLICKHOUSE_URL,
})

// MariaDB 연결 설정
const mariadb = mysql.createPool(process.env.MARIADB_URL ?? "")

export { clickhouse, mariadb, postgres }
