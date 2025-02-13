"use client"

import { getIncidentList } from "@/actions/incident-action"
import { IncidentLogType } from "@/types/incident"
import {
  Box,
  CircularProgress,
  Pagination,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material"
import { useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { v4 } from "uuid"

// eslint-disable-next-line react/function-component-definition
export default function IncidentList() {
  const [incidents, setIncidents] = useState<Partial<IncidentLogType>[]>([])
  const [columnKeys, setColumnKeys] = useState<(keyof IncidentLogType)[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [totalCounts, setTotalCounts] = useState(0)
  const rowsPerPage = 10

  const { data: incidentResult, isFetching: isLoadingBoards } = useQuery({
    queryKey: ["incidentList", page], // 캐시 키
    queryFn: () => getIncidentList({ page, rowsPerPage }),
    // refetchInterval: 1000,
  })

  useEffect(() => {
    if (!incidentResult) {
      return
    }
    setIncidents(incidentResult.data)
    setTotalPages(incidentResult.totalPages)
    setPage(incidentResult.currentPage)
    setTotalCounts(incidentResult.totalCounts)
    setColumnKeys(Object.keys(incidentResult?.data[0] ?? {}) as (keyof IncidentLogType)[])
  }, [incidentResult])

  const handlePageChange = (c: number) => {
    setPage(c)
  }

  if (totalCounts === 0 && isLoadingBoards) {
    return (
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
    )
  }

  return (
    <Box className="p-0">
      <Paper className="mb-6 w-full p-0 shadow-md dark:bg-black">
        <Box display="flex" alignItems="center" justifyContent="space-between" className="w-full">
          <Box display="flex" alignItems="center">
            <Typography variant="body1" className="ml-6 text-sm text-gray-700 dark:text-white">
              조회건수 <span className="font-bold"> {totalCounts}건</span>
            </Typography>
          </Box>
        </Box>

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
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 2,
          }}
        >
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, value) => handlePageChange(value)}
            color="primary"
            className="dark:text-white"
            shape="rounded"
          />
        </Box>
      </Paper>
    </Box>
  )
}
