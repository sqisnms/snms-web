import { createClient } from "@clickhouse/client"
import dotenv from "dotenv"
import fs from "fs"
import { WebSocket, WebSocketServer } from "ws"

if (fs.existsSync(".env")) {
  // 운영
  dotenv.config({ path: ".env" })
} else {
  // 로컬
  dotenv.config({ path: ".env.local" })
}

const { CLICKHOUSE_URL } = process.env
// WebSocket 서버 포트
const WS_PORT = 4000
const wss = new WebSocketServer({ port: WS_PORT })

console.log(`✅ WebSocket 서버가 ${WS_PORT} 포트에서 실행 중...`)

// ClickHouse 클라이언트 생성
const clickhouse = createClient({ host: CLICKHOUSE_URL })

// WebSocket 클라이언트 연결 처리
wss.on("connection", (ws: WebSocket) => {
  console.log("🟢 클라이언트가 WebSocket에 연결되었습니다.")

  ws.send(JSON.stringify({ message: "Connected to WebSocket server" }))

  ws.on("message", (data) => {
    console.log(`📩 클라이언트 메시지 수신: ${data}`)
  })

  ws.on("close", () => {
    console.log("🔴 클라이언트가 연결을 종료했습니다.")
  })
})

async function fetchLogsFromClickHouse() {
  try {
    const query = `
      SELECT event_time, log_file, log_message, log_level, log_time
      FROM FMDB.TBR_FM_LOG_MONITOR
      ORDER BY log_time DESC
      LIMIT 100
    `

    const result = await clickhouse.query({ query, format: "JSONEachRow" })
    const logs = await result.json()

    return logs as {
      event_time: string
      log_file: string
      log_message: string
      log_level: string
      log_time: string
    }[]
  } catch (error) {
    console.error("❌ ClickHouse 데이터 조회 실패:", error)
    return []
  }
}

async function sendLogsToWS() {
  console.log("✅ sendLogsToWS 시작!")

  // 10초마다 실행 (원하는 간격으로 조정 가능)
  setInterval(async () => {
    console.log("📢 ClickHouse에서 로그 조회 중...")
    const logs = await fetchLogsFromClickHouse()

    if (logs.length === 0) {
      console.log("⚠️ 가져올 로그 데이터가 없습니다.")
    } else {
      console.log(`📦 ${logs.length}개의 로그를 ws로 전송 중...`)

      logs.forEach((log) => {
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(
              JSON.stringify({
                message: JSON.stringify(log), // 로그 데이터를 문자열로 변환하여 전송
              }),
            )
          }
        })
      })

      console.log(`✅ ${logs.length}개의 로그가 ws에 전송됨.`)
    }
  }, 10000) // 10초마다 실행
}

sendLogsToWS().catch((error) => {
  console.error("❌ sendLogsToWS 실행 중 오류 발생:", error)
})
