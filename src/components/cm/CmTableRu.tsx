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
  Typography,
} from "@mui/material"
import { useEffect, useState } from "react"

import { getCMRuDetail } from "@/actions/cm-actions"
import { CMRuDetailType } from "@/types/cm"
import { useQuery } from "@tanstack/react-query"

type TableProps = {
  selectedCode: string
}

export function CmTableRu({ selectedCode }: TableProps) {
  const [datas, setDatas] = useState<CMRuDetailType[]>([])
  const [columns, setColumns] = useState<{ name: string; comment: string }[]>([])

  const {
    data = [],
    isFetching,
    isLoading,
  } = useQuery({
    queryKey: ["getCMRuDetail", selectedCode],
    queryFn: () => getCMRuDetail({ code: selectedCode }),
    enabled: !!selectedCode,
  })

  useEffect(() => {
    if (data.length > 0) {
      setColumns([
        { name: "du_id", comment: "EMS ID" },
        { name: "ru_id", comment: "장비ID" },
        { name: "equip_name", comment: "장비명" },
        { name: "vendor_code", comment: "제조사명" },
        { name: "generation_code", comment: "세대구분" },
        { name: "cell_no", comment: "CELL NUM" },
        { name: "cell_fdd_id", comment: "FDD ID" },
        { name: "global_cell_id", comment: "GCI" },
        { name: "upper_team_name", comment: "상위부서명" },
        { name: "team_name", comment: "팀명" },
        { name: "open_date", comment: "개통일" },
        { name: "ip_address", comment: "IP ADDRESS" },
        { name: "address", comment: "주소명" },
        { name: "user_name", comment: "정관리자" },
        { name: "pcsphone", comment: "PHONE" },
      ])
      // setSelectedRow(data[0].ru_id)
    } else {
      // setSelectedRow("")
    }
    setDatas(data)
  }, [JSON.stringify(data)])

  // useEffect(() => {
  //   setSelectedCode(selectedRow)
  // }, [selectedRow, setSelectedCode])

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

  if (!selectedCode || datas.length === 0) {
    return undefined
  }

  if (isFetching || isLoading) {
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
    <TableContainer
      component={Paper}
      sx={{
        maxHeight: "400px",
        overflow: "auto",
        mb: "1rem",
      }}
    >
      <Table
        aria-label="simple table"
        sx={{
          // minHeight: "30vh",
          borderBottom: "none",
          background: "#fafafa",
        }}
      >
        <TableHead className="bg-gray-200 dark:bg-gray-800">
          <TableRow>
            {columns.map((column) => (
              <TableCell
                key={column.name}
                className="whitespace-nowrap font-semibold text-gray-600 dark:text-white"
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
          {datas.length === 0 ? (
            <TableRow>
              <TableCell
                className="dark:bg-black dark:text-white"
                colSpan={columns.length}
                align="center"
                sx={{
                  borderBottom: "none",
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    color: "#9b9b9b",
                  }}
                >
                  데이터가 없습니다
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            datas.map((d) => (
              <TableRow
                key={d.global_cell_id + d.ru_id}
                // onClick={() => setSelectedRow(d.global_cell_id)}
                // sx={{
                //   cursor: "pointer",
                //   backgroundColor: selectedRow === d.global_cell_id ? "#e0f7fa" : undefined,
                // }}
              >
                {columns.map((column) => {
                  const value = d[column.name as keyof CMRuDetailType]

                  // 날짜 컬럼 처리
                  if (column.name.toLowerCase().includes("date")) {
                    return (
                      <TableCell
                        key={column.name}
                        className="whitespace-nowrap dark:bg-black dark:text-white"
                      >
                        {formatDate(String(value))}
                      </TableCell>
                    )
                  }

                  // 일반 값 처리
                  if (value !== null && value !== undefined) {
                    return (
                      <TableCell className="dark:bg-black dark:text-white" key={column.name}>
                        {String(value)}
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
