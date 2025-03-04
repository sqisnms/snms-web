import {
  Box,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material"
import { useEffect, useState } from "react"

import { getSystemMonitorList } from "@/actions/system-actions"
import { SystemMonitorListType } from "@/types/system"
import { useQuery } from "@tanstack/react-query"

type TableProps = {
  selectedCode: string
  setSelectedCode: (c: string) => void
}

export function SystemMonitorServerTable({ selectedCode, setSelectedCode }: TableProps) {
  const [datas, setDatas] = useState<SystemMonitorListType[]>([])
  const [columns, setColumns] = useState<{ name: string; comment: string; width: string }[]>([])
  const [selectedRow, setSelectedRow] = useState<string>("")

  const { data = [], isLoading } = useQuery({
    queryKey: ["getSystemMonitorList"],
    queryFn: () => getSystemMonitorList(),
  })

  useEffect(() => {
    if (data.length > 0) {
      setColumns([
        { name: "server_id", comment: "Server_ID", width: "150px" },
        { name: "server_ip", comment: "Server_IP", width: "150px" },
        { name: "boot_time", comment: "부팅시간", width: "200px" },
        { name: "physical_cpu_cores", comment: "CPU Core 갯수", width: "150px" },
        { name: "cpu", comment: "CPU 사용률", width: "200px" },
        { name: "mem", comment: "MEM(사용률/전체메모리)", width: "200px" },
        { name: "disk", comment: "Disk(사용률/전체공간)", width: "200px" },
        { name: "load", comment: "부하율(1분/5분/15분)", width: "200px" },
        { name: "network_io", comment: "네트워크 I/O", width: "250px" },
        { name: "collect_time", comment: "수집시간", width: "200px" },
      ])

      setSelectedRow(data[0].server_id)
    } else {
      setSelectedRow("")
    }
    setDatas(data)
  }, [JSON.stringify(data)])

  useEffect(() => {
    setSelectedCode(selectedRow)
  }, [selectedRow, setSelectedCode])

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A"

    const date = new Date(dateString)

    // 날짜가 유효한지 확인
    if (Number.isNaN(date.getTime())) return "N/A"

    // YYYY-MM-DD HH:MM 형식으로 변환
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0") // 월은 0부터 시작하므로 +1 필요
    const day = String(date.getDate()).padStart(2, "0")
    const hours = String(date.getHours()).padStart(2, "0")
    const minutes = String(date.getMinutes()).padStart(2, "0")

    return `${year}-${month}-${day} ${hours}:${minutes}`
  }

  return (
    <TableContainer
      className="mt-5 rounded-md"
      sx={{
        maxHeight: "400px",
        overflow: "auto",
        mb: "1rem",
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
            {columns.map((column) => (
              <TableCell
                key={column.name}
                className="font-semibold text-gray-600 dark:text-white"
                sx={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  width: column.width,
                }}
              >
                {column.comment}
              </TableCell>
            ))}
            {/* <TableCell className="font-semibold text-gray-600">Column 1</TableCell>
            <TableCell className="font-semibold text-gray-600">Column 2</TableCell>
            <TableCell className="font-semibold text-gray-600">Column 3</TableCell> */}
          </TableRow>
        </TableHead>
        <TableBody>
          {!selectedCode || datas.length === 0 ? (
            <TableRow
              sx={{
                height: "10rem",
              }}
            >
              <TableCell
                className="dark:bg-black dark:text-white"
                colSpan={columns.length}
                align="center"
                sx={{
                  borderBottom: "none",
                }}
              >
                {isLoading && (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "10rem",
                    }}
                  >
                    <CircularProgress />
                  </Box>
                )}
                {!isLoading && (
                  <Typography
                    variant="body1"
                    sx={{
                      color: "#9b9b9b",
                    }}
                  >
                    데이터가 없습니다
                  </Typography>
                )}
              </TableCell>
            </TableRow>
          ) : (
            datas.map((d) => (
              <TableRow
                key={d.server_id}
                onClick={() => setSelectedRow(d.server_id)}
                sx={{
                  cursor: "pointer",
                  backgroundColor: selectedRow === d.server_id ? "#e0f7fa" : undefined,
                }}
              >
                {columns.map((column) => {
                  const value = d[column.name as keyof SystemMonitorListType]

                  // 날짜 컬럼 처리
                  if (column.name.toLowerCase().includes("date")) {
                    return (
                      <TableCell
                        key={column.name}
                        className="dark:bg-black dark:text-white"
                        sx={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          width: column.width,
                        }}
                      >
                        <Tooltip title={formatDate(String(value))} arrow>
                          <span>{formatDate(String(value))}</span>
                        </Tooltip>
                      </TableCell>
                    )
                  }

                  // 일반 값 처리
                  if (value !== null && value !== undefined) {
                    return (
                      <TableCell
                        className="dark:bg-black dark:text-white"
                        key={column.name}
                        sx={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          width: column.width,
                        }}
                      >
                        <Tooltip title={String(value)} arrow>
                          <span>{String(value)}</span>
                        </Tooltip>
                      </TableCell>
                    )
                  }

                  // 값이 null 또는 undefined인 경우
                  return (
                    <TableCell className="dark:bg-black dark:text-white" key={column.name}>
                      N/A
                    </TableCell>
                  )
                })}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
