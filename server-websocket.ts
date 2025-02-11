import { Consumer, EachMessagePayload, Kafka } from "kafkajs"
import { WebSocket, WebSocketServer } from "ws"

// WebSocket 서버 포트
const WS_PORT = 4000
const wss = new WebSocketServer({ port: WS_PORT })

console.log(`✅ WebSocket 서버가 ${WS_PORT} 포트에서 실행 중...`)

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

// Kafka Consumer 설정
let kafkaConsumer: Consumer | null = null

/**
 * Kafka Consumer 시작
 */
async function startKafkaConsumer(): Promise<void> {
  const kafka = new Kafka({
    clientId: "nextjs-app",
    brokers: ["127.0.0.1:9092"], // Kafka 브로커 주소
  })

  kafkaConsumer = kafka.consumer({ groupId: `nextjs-group-${Date.now()}` })
  await kafkaConsumer.connect()
  await kafkaConsumer.subscribe({ topic: "test-topic", fromBeginning: true })

  console.log("✅ Kafka Consumer 연결 완료. 메시지 수신 대기 중...")

  await kafkaConsumer.run({
    eachMessage: async ({ topic, partition, message }: EachMessagePayload) => {
      const msg = message.value?.toString() || "" // 메시지 값이 null일 경우 빈 문자열 처리
      console.log(`🔔 Kafka 메시지 수신: ${msg}`)

      // WebSocket 클라이언트에 메시지 전송
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ message: msg }))
        }
      })
    },
  })
}

// Kafka Consumer 시작
startKafkaConsumer().catch((error) => {
  console.error("⚠️ Kafka Consumer 실행 중 오류 발생:", error)
})
