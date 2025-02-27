"use client"

import { getIncidentSysList } from "@/actions/incident-action"
import { IncidentSysPopup } from "@/components/incident/IncidentSysPopup"
import {
  IncidentSysLogColumnType,
  IncidentSysLogType,
  IncidentSysLogTypeKor,
} from "@/types/incident"
import {
  Box,
  Button,
  CircularProgress,
  MenuItem,
  Pagination,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material"
import { DateTimePicker } from "@mui/x-date-pickers"
import { useQuery } from "@tanstack/react-query"
import dayjs from "dayjs"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"

// eslint-disable-next-line react/function-component-definition
export default function IncidentList() {
  const [page, setPage] = useState(1)
  const [incidentInfo, setIncidentInfo] = useState<{
    incidents: Partial<IncidentSysLogType>[]
    currentPage: number
    totalPages: number
    totalCounts: number
    emerg: number
    alert: number
    crit: number
    err: number
    warning: number
  } | null>(null)
  const rowsPerPage = 10
  const [startDate, setStartDate] = useState<string>("")
  const [endDate, setEndDate] = useState<string>("")
  const [logLevel, setLogLevel] = useState<string>("")
  const [searchParams, setSearchParams] = useState({
    startDate: "",
    endDate: "",
    logLevel: "",
    searchTime: 0, // 조회 버튼 여러번 눌러도 계속 조회되도록 하는 임시 인자값. 조회조건에는 포함안됨
  })
  const [openDialog, setOpenDialog] = useState(false)
  const [incidentForPopup, setIncidentForPopup] = useState<Partial<IncidentSysLogType> | null>(null)

  const { data: incidentResult, isFetching } = useQuery({
    queryKey: ["incidentSysList", page, searchParams], // 캐시 키
    queryFn: () =>
      getIncidentSysList({
        page,
        rowsPerPage,
        startDate: searchParams.startDate,
        endDate: searchParams.endDate,
        logLevel: searchParams.logLevel,
      }),
    // refetchInterval: 1000,
  })

  useEffect(() => {
    if (!incidentResult) {
      return
    }
    setIncidentInfo(incidentResult)
  }, [incidentResult])

  const handlePageChange = (c: number) => {
    setPage(c)
  }

  const getColor = (obj: IncidentSysLogColumnType, row: Partial<IncidentSysLogType>) => {
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

  const handleInit = () => {
    setStartDate("")
    setEndDate("")
    setLogLevel("")

    setPage(1)
    setSearchParams({
      startDate: "",
      endDate: "",
      logLevel: "",
      searchTime: Date.now(),
    })
  }

  const handleSearch = () => {
    const sd = startDate === "Invalid Date" ? "" : startDate
    const ed = endDate === "Invalid Date" ? "" : endDate
    if (sd && ed && sd > ed) {
      toast.error("시작일자가 종료일자보다 큽니다.")
      return
    }
    setPage(1)
    setSearchParams({
      startDate: startDate === "Invalid Date" ? "" : startDate,
      endDate: endDate === "Invalid Date" ? "" : endDate,
      logLevel,
      searchTime: Date.now(),
    })
  }

  const handleOpenDialog = (incident: Partial<IncidentSysLogType>) => {
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
        <Box display="flex" alignItems="center" justifyContent="space-between" className="w-full">
          <Box display="flex" alignItems="center" />

          <Box display="flex" alignItems="center" justifyContent="flex-end">
            <Typography
              variant="body1"
              className="flex items-center text-sm text-gray-700 dark:text-white"
            >
              총 <span className="mx-2 font-bold">{incidentInfo?.totalCounts}건</span>
            </Typography>

            <Box display="flex" alignItems="center" className="ml-4">
              <Box display="flex" alignItems="center" className="mr-4">
                <div
                  style={{
                    width: "12px",
                    height: "12px",
                    backgroundColor: "red",
                    marginRight: "8px",
                  }}
                />
                <span className="text-sm text-gray-800 dark:text-gray-300">
                  {incidentInfo?.emerg}건
                </span>
              </Box>
              <Box display="flex" alignItems="center" className="mr-4">
                <div
                  style={{
                    width: "12px",
                    height: "12px",
                    backgroundColor: "orange",
                    marginRight: "8px",
                  }}
                />
                <span className="text-sm text-gray-800 dark:text-gray-300">
                  {incidentInfo?.alert}건
                </span>
              </Box>
              <Box display="flex" alignItems="center" className="mr-4">
                <div
                  style={{
                    width: "12px",
                    height: "12px",
                    backgroundColor: "red",
                    marginRight: "8px",
                  }}
                />
                <span className="text-sm text-gray-800 dark:text-gray-300">
                  {incidentInfo?.crit}건
                </span>
              </Box>
              <Box display="flex" alignItems="center" className="mr-4">
                <div
                  style={{
                    width: "12px",
                    height: "12px",
                    backgroundColor: "orange",
                    marginRight: "8px",
                  }}
                />
                <span className="text-sm text-gray-800 dark:text-gray-300">
                  {incidentInfo?.err}건
                </span>
              </Box>
              <Box display="flex" alignItems="center" className="mr-4">
                <div
                  style={{
                    width: "12px",
                    height: "12px",
                    backgroundColor: "blue",
                    marginRight: "8px",
                  }}
                />
                <span className="text-sm text-gray-800 dark:text-gray-300">
                  {incidentInfo?.warning}건
                </span>
              </Box>
            </Box>
          </Box>
        </Box>

        <div className="mb-4 mt-4 rounded-sm border border-gray-300 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-950">
          <div className="mb-4 grid grid-cols-3 gap-x-4 gap-y-2">
            <div>
              <label
                htmlFor="select1"
                className="mb-1 block text-sm font-medium text-gray-700 dark:text-white"
              >
                일시
              </label>
              <Box display="flex" alignItems="center" gap={1}>
                {/* 시작일시 */}
                <Box flex={1}>
                  <DateTimePicker
                    label="시작일시"
                    value={startDate ? dayjs(startDate) : null}
                    onChange={(newValue) => {
                      const d = dayjs(newValue).format("YYYY-MM-DD HH:mm:ss")
                      if (d === "Invalid Date") {
                        return setStartDate("")
                      }
                      return setStartDate(dayjs(newValue).format("YYYY-MM-DD HH:mm:ss"))
                    }}
                    slotProps={{
                      field: {
                        format: "YYYY-MM-DD HH:mm",
                      },
                      actionBar: {
                        actions: ["clear"], // Clear 버튼만 표시
                      },
                    }}
                  />
                </Box>

                {/* "to" 텍스트 */}
                <Box display="flex" alignItems="center" justifyContent="center">
                  <span style={{ margin: "0 0px", color: "#666" }}>-</span>
                </Box>

                {/* 종료일시 */}
                <Box flex={1}>
                  <DateTimePicker
                    label="종료일시"
                    value={endDate ? dayjs(endDate) : null}
                    onChange={(newValue) => {
                      const d = dayjs(newValue).format("YYYY-MM-DD HH:mm:ss")
                      if (d === "Invalid Date") {
                        return setEndDate("")
                      }
                      return setEndDate(dayjs(newValue).format("YYYY-MM-DD HH:mm:ss"))
                    }}
                    slotProps={{
                      field: {
                        format: "YYYY-MM-DD HH:mm",
                      },
                      actionBar: {
                        actions: ["clear"], // Clear 버튼만 표시
                      },
                    }}
                  />
                </Box>
              </Box>
            </div>

            <div>
              <label
                htmlFor="select2"
                className="mb-1 block text-sm font-medium text-gray-700 dark:text-white"
              >
                등급
              </label>
              <Select
                id="select2"
                value={logLevel}
                onChange={(e) => setLogLevel(e.target.value)}
                variant="outlined"
                size="small"
                fullWidth
                className="bg-white text-sm"
                displayEmpty
              >
                <MenuItem value="" className="text-sm">
                  전체
                </MenuItem>
                <MenuItem value="emerg" className="text-sm">
                  emerg
                </MenuItem>
                <MenuItem value="alert" className="text-sm">
                  alert
                </MenuItem>
                <MenuItem value="crit" className="text-sm">
                  crit
                </MenuItem>
                <MenuItem value="err" className="text-sm">
                  err
                </MenuItem>
                <MenuItem value="warning" className="text-sm">
                  warning
                </MenuItem>
              </Select>
            </div>
          </div>

          {/* 하단 버튼 */}
          <div className="flex w-full items-center justify-end">
            <div className="space-x-2">
              <Button
                variant="contained"
                size="small"
                sx={[
                  (theme) => ({
                    background: theme.palette.secondary.main,
                    width: "6rem",
                    fontSize: "16px",
                    lineHeight: "2rem",
                    boxShadow: "none",
                    color: theme.palette.secondary.contrastText,
                    "&:hover": {
                      background: theme.palette.secondary.dark,
                      boxShadow: "none",
                    },
                  }),
                ]}
                onClick={handleInit}
              >
                초기화
              </Button>
              <Button
                variant="contained"
                size="small"
                sx={[
                  (theme) => ({
                    background: theme.palette.primary.main,
                    width: "6rem",
                    fontSize: "16px",
                    lineHeight: "2rem",
                    boxShadow: "none",
                    color: theme.palette.primary.contrastText,
                    "&:hover": {
                      background: theme.palette.primary.dark,
                      boxShadow: "none",
                    },
                  }),
                ]}
                onClick={handleSearch}
              >
                조회
              </Button>
            </div>
          </div>
        </div>
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
                {IncidentSysLogTypeKor.map((obj) => (
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
              {!incidentInfo && isFetching ? (
                <TableRow
                  sx={{
                    height: "10rem",
                  }}
                >
                  <TableCell
                    colSpan={IncidentSysLogTypeKor.length}
                    sx={{
                      textAlign: "center",
                    }}
                  >
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : (
                incidentInfo?.incidents?.map((d) => (
                  <TableRow key={d.log_time} onClick={() => handleOpenDialog(d)}>
                    {IncidentSysLogTypeKor.map((obj) => (
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
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 2,
          }}
        >
          <Pagination
            count={incidentInfo?.totalPages}
            page={page}
            onChange={(_, value) => handlePageChange(value)}
            color="primary"
            className="dark:text-white"
            shape="rounded"
          />
        </Box>
      </Paper>
      {incidentForPopup && (
        <IncidentSysPopup
          open={openDialog}
          handleClose={handleCloseDialog}
          incident={incidentForPopup}
        />
      )}
    </Box>
  )
}
