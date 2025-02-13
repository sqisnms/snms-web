import { sendIncidentToSocket } from "@/batch/socket/incident"
import { Server as NetServer } from "http"
import { NextApiRequest, NextApiResponse } from "next"
import { Server as SocketIOServer } from "socket.io"

type NextApiResponseWithSocket = NextApiResponse & {
  socket: {
    server: NetServer & {
      io?: SocketIOServer
    }
  }
}
let globalIo: SocketIOServer

const startSocketBatch = () => {
  console.log("Starting startSocketBatch...")
  sendIncidentToSocket(globalIo, 10000).catch((error) => {
    console.error("❌ sendLogsToWS 실행 중 오류 발생:", error)
  })
}

export default function handler(req: NextApiRequest, res: NextApiResponseWithSocket) {
  if (!res.socket.server.io) {
    console.log("🔌 Starting Socket.IO server...")
    globalIo = new SocketIOServer(res.socket.server, {
      path: "/api/socket",
      cors: {
        origin: "*",
      },
    })

    globalIo.on("connection", (socket) => {
      console.log(`✅ Client connected: ${socket.id}`)

      socket.on("disconnect", () => {
        console.log(`❌ Client disconnected: ${socket.id}`)
      })
    })

    res.socket.server.io = globalIo

    startSocketBatch()
  } else {
    // console.log("✅ Socket.IO server already running.")
  }

  res.end()
}
