import { deleteBoard, getArticleById, getBoardList, updateBoard } from "@/actions/board-action"
import { useUser } from "@/config/Providers"
import { BoardType } from "@/types/board"
import {
  Box,
  Button,
  CircularProgress,
  Divider,
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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import dynamic from "next/dynamic"
import { useEffect, useMemo, useState } from "react"
import { toast } from "react-toastify"
import { Comment } from "./Comment"

const SnmsCKEditor = dynamic(() => import("./CKEditor"), {
  loading: () => <div>...loading</div>,
  ssr: false,
})

type BoardDialogProps = {
  section: string
  miniId: string | null
}

export function Board({ section, miniId }: BoardDialogProps) {
  const [boards, setBoards] = useState<Partial<BoardType>[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const queryClient = useQueryClient()
  const rowsPerPage = 10
  const [articleId, setArticleId] = useState<string | null>(miniId)
  const [article, setArticle] = useState<Partial<BoardType>>({})
  const [oriArticle, setOriArticle] = useState<Partial<BoardType>>({})
  const [isEditable, setIsEditable] = useState<boolean>(false)

  const currentUser = useUser()
  const { data: boardsResult, isFetching: isLoadingBoards } = useQuery({
    queryKey: ["board", section, "BoardDialog", page], // 캐시 키
    queryFn: () => getBoardList({ section, page, rowsPerPage }),
  })

  const { data: articleResult, isFetching: isLoadingArticle } = useQuery({
    queryKey: ["article", articleId],
    queryFn: () => getArticleById({ board_seq: articleId ?? "" }),
    enabled: !!articleId,
  })
  const updateMutation = useMutation({
    mutationFn: () =>
      updateBoard({
        board_seq: articleId ?? "",
        section,
        title: article.title ?? "",
        content: article.content ?? "",
      }),
  })
  const deleteMutation = useMutation({
    mutationFn: (board_seq: string) => deleteBoard({ board_seq }),
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
    setOriArticle(articleResult)
  }, [articleResult])

  const hasAuth = useMemo(() => {
    return currentUser?.role_ids?.some((r) => r.toLowerCase() === "admin") ?? false
  }, [currentUser])

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
    const seconds = String(date.getSeconds()).padStart(2, "0")

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
  }

  const handleAdd = () => {
    setArticleId("")
    setIsEditable(true)
  }

  const handleView = (id: string) => {
    setArticleId(id)
  }

  const handleArticleBack = () => {
    if (!isEditable || !articleId) {
      setArticleId(null)
      setArticle({})
    } else {
      setArticle(oriArticle)
    }
    setIsEditable(false)
  }

  const handleGoEdit = () => {
    setIsEditable(true)
  }

  const handleSave = () => {
    updateMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success("저장했습니다.")
        queryClient.invalidateQueries({ queryKey: ["board", section] })
        queryClient.invalidateQueries({ queryKey: ["article", articleId] })
        handleArticleBack()
      },
      onError: (error) => {
        console.error("Error saving changes:", error)
      },
    })
  }

  const handleDelete = () => {
    if (!articleId) {
      toast.info("선택된 게시물이 없습니다.")
      return
    }
    deleteMutation.mutate(articleId, {
      onSuccess: () => {
        toast.success("삭제했습니다.")
        queryClient.invalidateQueries({ queryKey: ["board", section] })
        handleArticleBack()
      },
      onError: (error) => {
        console.error("Error saving changes:", error)
      },
    })
  }

  const handlePageChange = (c: number) => {
    setPage(c)
  }

  if (isLoadingBoards || isLoadingArticle) {
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
    <Box
      sx={{
        "& .MuiDialog-paper": {
          height: "635px",
          maxHeight: "635px",
        },
      }}
    >
      {articleId === null && (
        <>
          <Box className="dark:text-white">목록</Box>
          <Box
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
                    <TableCell sx={{ paddingY: "0px", width: "70%" }} className="dark:text-white">
                      제목
                    </TableCell>
                    <TableCell sx={{ paddingY: "0px", width: "15%" }} className="dark:text-white">
                      작성자
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{ paddingY: "0px", width: "15%" }}
                      className="dark:text-white"
                    >
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
                      <TableCell sx={{ paddingY: "0px" }}>
                        <Typography className="truncate dark:text-white">
                          {board.create_user_name}
                        </Typography>
                      </TableCell>
                      <TableCell align="right" sx={{ paddingY: "0px" }} className="dark:text-white">
                        {formatDate(board.create_date ?? "")}
                      </TableCell>
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
            {hasAuth && (
              <Box className="p-4 pt-0 dark:bg-black">
                <Button onClick={handleAdd}>추가</Button>
              </Box>
            )}
          </Box>
        </>
      )}
      {articleId !== null && (
        <>
          <Box className="dark:bg-black dark:text-white">수정</Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2, // 요소 간 간격 추가
              // padding: "36px", // 내부 패딩 추가
            }}
            className="dark:bg-black dark:text-white"
          >
            <Typography variant="caption">{`${article.create_user_name} / ${formatDate(article.create_date ?? "")}`}</Typography>

            {/* 제목 */}
            <TextField
              label="제목"
              variant="outlined"
              fullWidth
              value={article.title || ""}
              onChange={(e) => setArticle({ ...article, title: e.target.value })}
              slotProps={{
                input: {
                  readOnly: !isEditable,
                },
              }}
            />

            {/* 내용 */}
            <SnmsCKEditor
              key={String(isEditable)}
              content={article.content ?? ""}
              isEditable={isEditable}
              handleSave={(c) => {
                setArticle((prevArticle) => {
                  if (prevArticle.content === c) return prevArticle // 상태가 동일하면 업데이트 방지
                  return { ...prevArticle, content: c }
                })
              }}
            />
          </Box>

          {/* Dialog Actions */}
          <Box className="p-4 pt-0 dark:bg-black" display="flex" gap={1} flexWrap="wrap">
            {isEditable && (
              <Button onClick={handleSave} color="primary" variant="outlined">
                저장
              </Button>
            )}
            {articleId !== "" && hasAuth && !isEditable && (
              <Button onClick={handleGoEdit} color="primary" variant="outlined">
                수정
              </Button>
            )}
            {articleId !== "" && hasAuth && !isEditable && (
              <Button onClick={handleDelete} color="error" variant="outlined">
                삭제
              </Button>
            )}
            <Button
              onClick={handleArticleBack}
              color="warning"
              variant="outlined"
              className="dark:text-white"
            >
              뒤로
            </Button>
          </Box>

          {!isEditable && (
            <>
              <Divider sx={{ my: 2 }} />
              <Comment boardId={articleId} />
            </>
          )}
        </>
      )}
    </Box>
  )
}
