import { getUsersByTeamCode } from "@/actions/team-actions"
import { UserType } from "@/types/user"
import {
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

type TableProps = {
  selectedCode: string
}

export function TeamTable({ selectedCode }: TableProps) {
  const [datas, setDatas] = useState<Partial<UserType>[]>([])
  const [columns, setColumns] = useState<{ name: string; comment: string }[]>([])

  useEffect(() => {
    getUsersByTeamCode({ code: selectedCode })
      .then((data) => {
        // console.table(data)
        // console.log(JSON.stringify(data))
        if (data.length > 0) {
          setColumns([
            { name: "user_id", comment: "ID" },
            { name: "user_name", comment: "이름" },
            { name: "login_id", comment: "로그인ID" },
            { name: "title", comment: "직급" },
            { name: "duty_name", comment: "직책" },
            { name: "business", comment: "담당업무" },
            { name: "pcsphone", comment: "연락처" },
          ])
        }
        setDatas(data)
      })
      .catch((error) => {
        console.error("데이터를 불러오는 데 실패했습니다:", error)
      })
  }, [selectedCode])

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
    <TableContainer component={Paper}>
      <Table
        aria-label="simple table"
        sx={{
          minHeight: "30vh",
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
                  팀에 소속된 인원이 없습니다
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            datas.map((data) => (
              <TableRow key={data.user_id}>
                {columns.map((column) => {
                  const value = data[column.name as keyof UserType]

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
