import { IncidentSysLogType } from "@/types/incident"
import { createClient } from "@clickhouse/client"
import dotenv from "dotenv"
import fs from "fs"
import { Server as SocketIOServer } from "socket.io"

if (fs.existsSync(".env")) {
  // 운영
  dotenv.config({ path: ".env" })
} else {
  // 로컬
  dotenv.config({ path: ".env.local" })
}

const { CLICKHOUSE_URL } = process.env

// ClickHouse 클라이언트 생성
const clickhouse = createClient({ host: CLICKHOUSE_URL })

async function fetchSysLogsFromClickHouse() {
  // console.log(new Date().toTimeString())
  try {
    const query = `
      SELECT event_time, server_id, log_message, log_level, log_time
      FROM FMDB.TBR_FM_SYSLOG_MONITOR
      ORDER BY log_time DESC
      LIMIT 100
    `

    const result = await clickhouse.query({ query, format: "JSONEachRow" })
    const logs = await result.json()

    return logs as IncidentSysLogType[]
  } catch (error) {
    console.error("❌ ClickHouse 데이터 조회 실패:", error)
    return []
  }
}

export async function sendIncidentSysToSocket(io: SocketIOServer, intervalMs: number) {
  console.log("✅ sendLogsToWS 시작!")

  // 10초마다 실행 (원하는 간격으로 조정 가능)
  setInterval(async () => {
    // console.log("📢 ClickHouse에서 로그 조회 중...")
    const logs = await fetchSysLogsFromClickHouse()

    if (logs.length === 0 || !io) {
      console.log("⚠️ 가져올 로그 데이터가 없거나 소켓서버가 생성되지 않았습니다.")
    } else {
      // console.log(`📦 ${logs.length}개의 로그를 ws로 전송 중...sendIncidentSysToSocket`)
      console.log(`sendIncidentSysToSocket ${logs.length}`)

      logs.reverse().forEach((log) => {
        io.emit("incidentSys", log)
      })

      // console.log(`✅ ${logs.length}개의 로그가 ws에 전송됨.`)
    }
  }, intervalMs)
}
