import { getArticleById, getBoardList } from "@/actions/board-action"
import { BoardType } from "@/types/board"
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Pagination,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material"
import { useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"

type BoardDialogProps = {
  section: string
  label: string
  open: boolean
  handleClose: () => void
  miniId: string | null
}

export function BoardDialog({ section, label, open, handleClose, miniId }: BoardDialogProps) {
  const [boards, setBoards] = useState<Partial<BoardType>[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  // const queryClient = useQueryClient()
  const rowsPerPage = 10
  const [articleId, setArticleId] = useState<string | null>(miniId)
  const [article, setArticle] = useState<Partial<BoardType>>({})
  const { data: boardsResult } = useQuery({
    queryKey: ["board", section, "BoardDialog", page], // 캐시 키
    queryFn: () => getBoardList({ section, page, rowsPerPage }),
  })

  const { data: articleResult } = useQuery({
    queryKey: ["article", articleId],
    queryFn: () => getArticleById({ board_seq: articleId ?? "" }),
    enabled: !!articleId,
  })

  useEffect(() => {
    setArticleId(miniId)
  }, [miniId])

  useEffect(() => {
    if (!boardsResult) {
      return
    }
    setBoards(boardsResult.data)
    setPage(boardsResult.currentPage)
    setTotalPages(boardsResult.totalPages)
  }, [boardsResult])

  useEffect(() => {
    if (!articleResult) {
      return
    }
    setArticle(articleResult)
  }, [articleResult])

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

  // const handleAdd = () => {
  //   setArticleId("")
  // }

  const handleView = (id: string) => {
    setArticleId(id)
  }

  // const handleDelete = (id: string) => {
  //   deleteBoard({ id })
  //     .then((data) => {
  //       console.table(data)
  //       console.log(JSON.stringify(data))
  //       toast("삭제했습니다.")
  //     })
  //     .catch((error) => {
  //       console.error("삭제에 실패했습니다:", error)
  //     })
  // }
  // const updateMutation = useMutation({
  //   mutationFn: (id: string) => deleteBoard({ id }),
  // })

  // const handleDelete = (id: string) => {
  //   updateMutation.mutate(id, {
  //     onSuccess: () => {
  //       toast.success("삭제했습니다.")
  //       queryClient.invalidateQueries({ queryKey: ["board", section] })
  //     },
  //     onError: (error) => {
  //       console.error("Error saving changes:", error)
  //     },
  //   })
  // }

  const handlePageChange = (c: number) => {
    setPage(c)
  }

  const handleArticleBack = () => {
    setArticleId(null)
    setArticle({})
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      sx={{
        "& .MuiDialog-paper": {
          height: "635px",
          maxHeight: "635px",
        },
      }}
    >
      {articleId === null && (
        <>
          <DialogTitle className="dark:text-white">{label}</DialogTitle>
          <DialogContent
            sx={{
              display: "flex",
              flexDirection: "column",
              height: "100%", // 다이얼로그 전체 높이를 차지하게 설정
            }}
          >
            <TableContainer
              component={Paper}
              sx={{
                flexGrow: 1, // 테이블 컨텐츠가 가변적으로 크기를 차지하도록 설정
                overflowY: "auto", // 테이블 내용이 많을 경우 스크롤 가능하게 설정
              }}
              className="border dark:border-gray-700 dark:bg-black"
            >
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ height: "40px" }}>
                    <TableCell sx={{ paddingY: "0px" }} className="dark:text-white">
                      제목
                    </TableCell>
                    <TableCell align="right" sx={{ paddingY: "0px" }} className="dark:text-white">
                      날짜
                    </TableCell>
                    {/* <TableCell align="right" sx={{ paddingY: "0px" }} className="dark:text-white">
                      수정
                    </TableCell>
                    <TableCell align="right" sx={{ paddingY: "0px" }} className="dark:text-white">
                      삭제
                    </TableCell> */}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {boards.map((board) => (
                    <TableRow
                      key={board.board_seq}
                      onClick={() => handleView(board.board_seq ?? "")}
                      className="h-10 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <TableCell sx={{ paddingY: "0px" }}>
                        <Typography className="w-128 truncate dark:text-white">
                          {board.title}
                        </Typography>
                      </TableCell>
                      <TableCell align="right" sx={{ paddingY: "0px" }} className="dark:text-white">
                        {formatDate(board.create_date ?? "")}
                      </TableCell>
                      {/* <TableCell align="right" sx={{ paddingY: "0px" }}>
                        <IconButton onClick={() => handleEdit(board.id ?? "")}>
                          <Edit />
                        </IconButton>
                      </TableCell>
                      <TableCell align="right" sx={{ paddingY: "0px" }}>
                        <IconButton onClick={() => handleDelete(board.id ?? "")}>
                          <Delete />
                        </IconButton>
                      </TableCell> */}
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
                count={totalPages} // 전체 페이지 수
                page={page} // 현재 페이지
                onChange={(_, value) => handlePageChange(value)} // 페이지 변경 시 호출되는 함수
                color="primary"
                className="dark:text-white"
                shape="rounded"
              />
            </Box>
          </DialogContent>

          {/* Dialog Actions */}
          <DialogActions className="p-4 pt-0 dark:bg-black">
            {/* 일단 readOnly 로 조회만 할 수 있게 */}
            {/* <Button onClick={handleAdd} startIcon={<Add />}>
              추가
            </Button> */}
            <Button onClick={handleClose} color="primary" className="dark:text-white">
              닫기
            </Button>
          </DialogActions>
        </>
      )}
      {articleId !== null && (
        <>
          <DialogTitle className="dark:bg-black dark:text-white">{label}</DialogTitle>
          <DialogContent
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2, // 요소 간 간격 추가
              padding: "36px", // 내부 패딩 추가
            }}
            className="dark:bg-black dark:text-white"
          >
            {/* 제목 */}
            {articleId === "" ? (
              <TextField
                label="제목"
                variant="outlined"
                fullWidth
                value={article.title || ""}
                onChange={(e) => setArticle({ ...article, title: e.target.value })}
              />
            ) : (
              // <Typography variant="h6" component="h2" gutterBottom>
              //   {article.title || "제목 없음"}
              // </Typography>
              <TextField
                label="제목"
                variant="outlined"
                fullWidth
                value={article.title || ""}
                onChange={(e) => setArticle({ ...article, title: e.target.value })}
                slotProps={{
                  input: {
                    readOnly: true,
                  },
                }}
              />
            )}

            {/* 내용 */}
            {articleId === "" ? (
              <TextField
                label="내용"
                variant="outlined"
                fullWidth
                multiline
                rows={16}
                value={article.content || ""}
                onChange={(e) => setArticle({ ...article, content: e.target.value })}
              />
            ) : (
              // <Box
              //   sx={{
              //     flexGrow: 1,
              //     overflowY: "auto", // 내용이 길어질 경우 스크롤 가능하게 설정
              //     padding: 2,
              //     borderRadius: 1,
              //     backgroundColor: "#f5f5f5", // 배경색 추가
              //     minHeight: "200px", // 최소 높이 설정
              //   }}
              // >
              //   <Typography variant="body1">{article.content || "내용 없음"}</Typography>
              // </Box>
              <TextField
                label="내용"
                variant="outlined"
                fullWidth
                multiline
                rows={15}
                value={article.content || ""}
                onChange={(e) => setArticle({ ...article, content: e.target.value })}
                slotProps={{
                  input: {
                    readOnly: true,
                  },
                }}
              />
            )}
          </DialogContent>

          {/* Dialog Actions */}
          <DialogActions className="p-4 pt-0 dark:bg-black">
            {/* <Button onClick={handleAdd} startIcon={<Add />}>
              저장
            </Button> */}
            <Button onClick={handleArticleBack} color="primary" className="dark:text-white">
              뒤로
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  )
}
