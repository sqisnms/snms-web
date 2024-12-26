import { getBoardList } from "@/actions/board-action"
import { BoardType } from "@/types/board"
import AddIcon from "@mui/icons-material/Add"
import { Box, Button, CircularProgress, Typography } from "@mui/material"
import { useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { BoardDialog } from "./BoardDialog"

export function MiniBoard({ section, label }: { section: string; label: string }) {
  const [boards, setBoards] = useState<Partial<BoardType>[]>([])
  const [openDialog, setOpenDialog] = useState(false)
  const [miniId, setMiniId] = useState<string | null>(null)

  // useEffect(() => {
  //   getBoardList({ section, page: 1, rowsPerPage: 10, count: 3 })
  //     .then((data) => {
  //       console.table(data)
  //       console.log(JSON.stringify(data))
  //       setBoards(data.data)
  //     })
  //     .catch((error) => {
  //       console.error("데이터를 불러오는 데 실패했습니다:", error)
  //     })
  // }, [section])

  // useQuery({
  //   queryKey: ["board", section, 1], // 캐시 키
  //   queryFn: () =>
  //     getBoardList({ section, page: 1, rowsPerPage: 10, count: 3 })
  //       .then((data) => {
  //         console.table(data)
  //         console.log(JSON.stringify(data))
  //         setBoards(data.data)
  //       })
  //       .catch((error) => {
  //         console.error("데이터를 불러오는 데 실패했습니다:", error)
  //       }),
  // })

  const { data: boardsResult, isLoading } = useQuery({
    queryKey: ["board", section, "MiniBoard"], // 캐시 키
    queryFn: () => getBoardList({ section, page: 1, rowsPerPage: 10, count: 3 }),
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

  const handleOpenDialog = () => {
    setMiniId(null)
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setMiniId(null)
    setOpenDialog(false)
  }

  const handleClick = (id: string) => {
    setMiniId(id)
    setOpenDialog(true)
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
          <Box className="flex items-center" onClick={handleOpenDialog}>
            <AddIcon fontSize="small" />
            <span className="text-base">More</span>
          </Box>
        </Button>
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
              <Box
                className="flex cursor-pointer justify-between hover:text-primary dark:hover:text-primary-light"
                onClick={() => handleClick(notice.board_seq ?? "")}
              >
                <span className="w-9/12 truncate">{notice.title}</span>
                <span className="min-w-min whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {formatDate(notice.create_date ?? "")}
                </span>
              </Box>
            </li>
          ))
        )}
      </ul>
      <BoardDialog
        open={openDialog}
        handleClose={handleCloseDialog}
        label={label}
        section={section}
        miniId={miniId}
      />
    </>
  )
}
