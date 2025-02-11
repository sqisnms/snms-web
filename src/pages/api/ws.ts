import { startKafkaConsumer } from "@/utils/kafka/consumer"
import { Server as HttpServer } from "http"
import { Socket } from "net"
import { NextApiRequest, NextApiResponse } from "next"
import { WebSocketServer } from "ws"
// import { Server as WebSocketServer } from "ws"

// 사용자 정의 타입 확장
interface CustomSocket extends Socket {
  server: HttpServer
}

interface CustomNextApiRequest extends NextApiRequest {
  socket: CustomSocket
}

let webSocketServer: WebSocketServer | null = null

export default function handler(req: CustomNextApiRequest, res: NextApiResponse): void {
  console.log("!!!!!!!!!!!!!WebSocket handler")
  const { server } = req.socket

  if (!webSocketServer) {
    webSocketServer = new WebSocketServer({ noServer: true })

    server.on("upgrade", (request, socket, head) => {
      if (request.url === "/api/ws") {
        webSocketServer?.handleUpgrade(request, socket, head, (ws) => {
          webSocketServer?.emit("connection", ws, request)
        })
      }
    })

    // WebSocket 클라이언트 연결 처리
    webSocketServer.on("connection", (socket) => {
      console.log("WebSocket client connected.")
      socket.send(JSON.stringify({ message: "Connected to WebSocket server" }))

      // 클라이언트가 연결 종료 시
      socket.on("close", () => {
        console.log("WebSocket client disconnected.")
      })
    })

    // Kafka Consumer 시작 및 메시지 전달
    startKafkaConsumer((message: string) => {
      console.log(`Kafka message received: ${message}`)
      webSocketServer?.clients.forEach((client) => {
        if (client.readyState === client.OPEN) {
          client.send(JSON.stringify({ message }))
        }
      })
    }).catch((error) => {
      console.error("Error starting Kafka consumer:", error)
    })
  }

  res.status(200).end()
}

export const config = {
  api: {
    bodyParser: false,
  },
}
