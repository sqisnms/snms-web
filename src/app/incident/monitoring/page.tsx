"use client"

import { IncidentPopup } from "@/components/incident/IncidentPopup"
import { IncidentLogColumnType, IncidentLogType, IncidentLogTypeKor } from "@/types/incident"
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
  const [incidents, setIncidents] = useState<IncidentLogType[]>([])
  const [openDialog, setOpenDialog] = useState(false)
  const [incidentForPopup, setIncidentForPopup] = useState<Partial<IncidentLogType> | null>(null)

  useEffect(() => {
    const socketInstance = io({
      path: "/api/socket",
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    })

    socketInstance.on("incident", (msg: IncidentLogType) => {
      setIncidents((prev) => [msg, ...prev].slice(0, 100))
    })

    socketInstance.on("disconnect", (reason: DisconnectReason) => {
      console.warn("WebSocket disconnected:", reason)
    })

    return () => {
      socketInstance.disconnect()
    }
  }, [])

  const getColor = (obj: IncidentLogColumnType, row: Partial<IncidentLogType>) => {
    if (obj.key === "log_level") {
      if (row.log_level === "CRITICAL") {
        return "red"
      }
      if (row.log_level === "ERROR") {
        return "orange"
      }
      if (row.log_level === "WARNING") {
        return "blue"
      }
      return "inherit"
    }
    return "inherit"
  }

  const handleOpenDialog = (incident: Partial<IncidentLogType>) => {
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
                {IncidentLogTypeKor.map((obj) => (
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
                    colSpan={IncidentLogTypeKor.length}
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
                    {IncidentLogTypeKor.map((obj) => (
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
        <IncidentPopup
          open={openDialog}
          handleClose={handleCloseDialog}
          incident={incidentForPopup}
        />
      )}
    </Box>
  )
}
