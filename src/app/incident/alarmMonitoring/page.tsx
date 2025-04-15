"use client"

import { IncidentAlarmPopup } from "@/components/incident/IncidentAlarmPopup"
import {
  IncidentAlarmLogColumnType,
  IncidentAlarmLogType,
  IncidentAlarmLogTypeKor,
} from "@/types/incident"
import {
  Box,
  CircularProgress,
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

export default function SocketClient() {
  const [incidents, setIncidents] = useState<IncidentAlarmLogType[]>([])
  const [openDialog, setOpenDialog] = useState(false)
  const [incidentForPopup, setIncidentForPopup] = useState<Partial<IncidentAlarmLogType> | null>(
    null,
  )

  useEffect(() => {
    const socketInstance = io({
      path: "/api/socket",
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    })

    socketInstance.on("incidentAlarm", (msg: IncidentAlarmLogType) => {
      setIncidents((prev) => {
        // 같은 데이터
        const index = prev.findIndex(
          (incident) =>
            incident.event_time === msg.event_time &&
            incident.current_equip_id === msg.current_equip_id &&
            incident.alarmcode === msg.alarmcode &&
            incident.severity === msg.severity,
        )
        if (index !== -1) {
          // 내용이 변한게 없는지
          if (JSON.stringify(prev[index]) === JSON.stringify(msg)) {
            return prev
          }
          const updatedPrev = [...prev]
          updatedPrev[index] = msg
          return updatedPrev.slice(0, 100)
        }
        return [msg, ...prev].slice(0, 100)
      })
    })

    socketInstance.on("disconnect", (reason: DisconnectReason) => {
      console.warn("WebSocket disconnected:", reason)
    })

    return () => {
      socketInstance.disconnect()
    }
  }, [])

  const getColor = (obj: IncidentAlarmLogColumnType, row: Partial<IncidentAlarmLogType>) => {
    if (obj.key === "severity") {
      if (row.severity === "critical") {
        return "red"
      }
      if (row.severity === "major") {
        return "orange"
      }
      if (row.severity === "minor") {
        return "blue"
      }
      return "inherit"
    }
    return "inherit"
  }

  const handleOpenDialog = (incident: Partial<IncidentAlarmLogType>) => {
    setIncidentForPopup(incident)
    setOpenDialog(true)
  }
  const handleCloseDialog = () => {
    setIncidentForPopup(null)
    setOpenDialog(false)
  }

  return (
    <Box className="p-0">
      <Paper className="mb-6 w-full p-0 shadow-md dark:bg-black">
        <TableContainer
          className="mt-5 rounded-md"
          sx={{
            maxHeight: "calc(100vh - 200px)", // 최대 높이 설정, 화면 크기에 맞게 조절
            overflowX: "auto", // 가로 스크롤 추가
            overflowY: "auto", // 세로 스크롤 추가
          }}
        >
          <Table
            aria-label="simple table"
            sx={[
              (theme) => ({
                "& .MuiTableCell-root": { padding: "4px 16px", height: "40px" },
                backgroundColor: "#fafafa",
                ...theme.applyStyles("dark", {
                  backgroundColor: "#000",
                }),
                tableLayout: "fixed",
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
                {IncidentAlarmLogTypeKor.map((obj) => (
                  <TableCell
                    key={`${obj.key}header`}
                    className="font-semibold text-gray-600 dark:text-white"
                    sx={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      width: obj.width,
                    }}
                  >
                    {obj.name}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {!incidents || incidents.length === 0 ? (
                <TableRow
                  sx={{
                    height: "10rem",
                  }}
                >
                  <TableCell
                    colSpan={IncidentAlarmLogTypeKor.length}
                    sx={{
                      textAlign: "center",
                    }}
                  >
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : (
                incidents?.map((d) => (
                  <TableRow key={d.log_time} onClick={() => handleOpenDialog(d)}>
                    {IncidentAlarmLogTypeKor.map((obj) => (
                      <TableCell
                        key={`${d.log_time}${obj.key}`}
                        sx={{
                          color: getColor(obj, d),
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          width: obj.width,
                        }}
                      >
                        {d[obj.key]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      {incidentForPopup && (
        <IncidentAlarmPopup
          open={openDialog}
          handleClose={handleCloseDialog}
          incident={incidentForPopup}
        />
      )}
    </Box>
  )
}
