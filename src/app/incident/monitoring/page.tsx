"use client"

import { IncidentLogType } from "@/types/incident"
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material"
import { useEffect, useState } from "react"
import { DisconnectReason } from "socket.io"
// @ts-expect-error Module '"socket.io-client"' has no exported member 'io'.
import { io } from "socket.io-client"
import { v4 } from "uuid"

export default function SocketClient() {
  const [incidents, setIncidents] = useState<IncidentLogType[]>([])
  const [columnKeys, setColumnKeys] = useState<(keyof IncidentLogType)[]>([])

  useEffect(() => {
    const socketInstance = io({
      path: "/api/socket",
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    })

    socketInstance.on("incident", (msg: IncidentLogType) => {
      // console.log("incident 인입", msg)
      setIncidents((prev) => [msg, ...prev].slice(0, 100))
    })

    socketInstance.on("disconnect", (reason: DisconnectReason) => {
      console.warn("WebSocket disconnected:", reason)
    })

    return () => {
      socketInstance.disconnect()
    }
  }, [])

  useEffect(() => {
    if (!incidents || columnKeys.length !== 0) {
      return
    }
    setColumnKeys(Object.keys(incidents?.[0] ?? {}) as (keyof IncidentLogType)[])
  }, [incidents, columnKeys.length])

  return (
    <Box className="p-0">
      <Paper className="mb-6 w-full p-0 shadow-md dark:bg-black">
        <TableContainer className="mt-5 rounded-md">
          <Table
            aria-label="simple table"
            sx={[
              (theme) => ({
                "& .MuiTableCell-root": { padding: "4px 16px", height: "40px" },
                backgroundColor: "#fafafa",
                ...theme.applyStyles("dark", {
                  backgroundColor: "#000",
                }),
              }),
            ]}
          >
            <TableHead
              sx={[
                (theme) => ({
                  height: "40px",
                  background: "#e5e7eb",
                  ...theme.applyStyles("dark", {
                    backgroundColor: "#191919",
                  }),
                }),
              ]}
            >
              <TableRow>
                {/* <TableCell className="font-semibold text-gray-600 dark:text-white">
                  Column 1
                </TableCell>
                <TableCell className="font-semibold text-gray-600 dark:text-white">
                  Column 2
                </TableCell>
                <TableCell className="font-semibold text-gray-600 dark:text-white">
                  Column 3
                </TableCell> */}
                {columnKeys.map((key) => (
                  <TableCell
                    key={`${key}header`}
                    className="font-semibold text-gray-600 dark:text-white"
                  >
                    {key}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {incidents?.map((d) => (
                <TableRow key={v4()}>
                  {columnKeys.map((key) => (
                    <TableCell key={`${key}body`}>{d[key]}</TableCell>
                  ))}
                  {/* <TableCell>{d.event_time}</TableCell>
                  <TableCell>{d.log_file}</TableCell>
                  <TableCell>{d.log_time}</TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  )
}
