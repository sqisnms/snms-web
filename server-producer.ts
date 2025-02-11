import { createClient } from "@clickhouse/client"
import dotenv from "dotenv"
import { Kafka } from "kafkajs"

dotenv.config({ path: ".env.local" }) // .env 파일에서 설정 로드

const KAFKA_BROKER = process.env.KAFKA_BROKER || "127.0.0.1:9092"
const CLICKHOUSE_URL = process.env.CLICKHOUSE_URL || "http://localhost:8123"
const KAFKA_TOPIC = process.env.KAFKA_TOPIC || "test-topic"

// ClickHouse 클라이언트 생성
const clickhouse = createClient({ host: CLICKHOUSE_URL })

// Kafka Producer 설정
const kafka = new Kafka({
  clientId: "log-producer",
  brokers: [KAFKA_BROKER],
})

const producer = kafka.producer()

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

async function sendLogsToKafka() {
  await producer.connect()
  console.log("✅ Kafka Producer 연결 완료!")

  // 10초마다 실행 (원하는 간격으로 조정 가능)
  setInterval(async () => {
    console.log("📢 ClickHouse에서 로그 조회 중...")
    const logs = await fetchLogsFromClickHouse()

    if (logs.length === 0) {
      console.log("⚠️ 가져올 로그 데이터가 없습니다.")
    } else {
      console.log(`📦 ${logs.length}개의 로그를 Kafka로 전송 중...`)

      await producer.send({
        topic: KAFKA_TOPIC,
        messages: logs.map((log) => ({
          key: log.event_time,
          value: JSON.stringify(log),
        })),
      })

      console.log(`✅ ${logs.length}개의 로그가 Kafka에 전송됨.`)
    }
  }, 10000) // 10초마다 실행
}

// Kafka Producer 시작
sendLogsToKafka().catch((error) => {
  console.error("❌ Kafka Producer 실행 중 오류 발생:", error)
})
