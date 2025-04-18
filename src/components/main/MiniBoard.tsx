import { getBoardList } from "@/actions/board-action"
import { BoardType } from "@/types/board"
import AddIcon from "@mui/icons-material/Add"
import { Box, Button, CircularProgress, Typography } from "@mui/material"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import { useEffect, useState } from "react"

export function MiniBoard({ section, label }: { section: string; label: string }) {
  const [boards, setBoards] = useState<Partial<BoardType>[]>([])

  const { data: boardsResult, isLoading } = useQuery({
    queryKey: ["board", section, "MiniBoard"], // 캐시 키
    queryFn: () =>
      getBoardList({ section: section.toUpperCase(), page: 1, rowsPerPage: 10, count: 3 }),
  })

  useEffect(() => {
    if (!boardsResult) {
      return
    }
    setBoards(boardsResult.data)
  }, [boardsResult])

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A"

    const date = new Date(dateString)

    // 날짜가 유효한지 확인
    if (Number.isNaN(date.getTime())) return "N/A"

    // YYYY-MM-DD HH:MM 형식으로 변환
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0") // 월은 0부터 시작하므로 +1 필요
    const day = String(date.getDate()).padStart(2, "0")
    // const hours = String(date.getHours()).padStart(2, "0")
    // const minutes = String(date.getMinutes()).padStart(2, "0")

    return `${year}-${month}-${day}`
  }

  return (
    <>
      <Box className="mb-3 flex items-center justify-between">
        <Typography
          variant="h6"
          // className="font-bold"
          sx={{ fontWeight: 700 }}
        >
          {label}
        </Typography>
        <Link href={`/board/${section}`}>
          <Button
            size="small"
            variant="text"
            // className="text-primary dark:text-primary-light"
            sx={[
              (theme) => ({
                color: "rgb(20, 56, 150)",
                ...theme.applyStyles("dark", {
                  color: "rgb(125, 160, 255)",
                }),
              }),
            ]}
          >
            <Box className="flex items-center">
              <AddIcon fontSize="small" />
              <span className="text-base">More</span>
            </Box>
          </Button>
        </Link>
      </Box>
      <ul className="space-y-2">
        {isLoading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "88px",
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          boards.map((notice) => (
            <li key={notice.board_seq}>
              <Link href={`/board/${section}?id=${notice.board_seq}`}>
                <Box className="flex cursor-pointer justify-between hover:text-primary dark:hover:text-primary-light">
                  <span className="w-9/12 truncate">{notice.title}</span>
                  <span className="min-w-min whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {formatDate(notice.create_date ?? "")}
                  </span>
                </Box>
              </Link>
            </li>
          ))
        )}
      </ul>
    </>
  )
}
