import { deleteComment, getCommentList, updateComment } from "@/actions/board-action"
import { useUser } from "@/config/Providers"
import { CommentType } from "@/types/board"
import { Box, Button, CircularProgress, Divider, Pagination, Typography } from "@mui/material"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import dynamic from "next/dynamic"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"

const SnmsCKEditor = dynamic(() => import("./CKEditor"), {
  loading: () => <div>...loading</div>,
  ssr: false,
})

type CommentProps = {
  boardId: string
}

export function Comment({ boardId }: CommentProps) {
  const [oriComments, setOriComments] = useState<Partial<CommentType>[]>([])
  const [comments, setComments] = useState<Partial<CommentType>[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const queryClient = useQueryClient()
  const rowsPerPage = 10
  const [article, setArticle] = useState<Partial<CommentType>>({})

  const currentUser = useUser()
  const { data: commentsResult, isFetching: isLoading } = useQuery({
    queryKey: ["comment", boardId, "BoardDialog", page], // 캐시 키
    queryFn: () => getCommentList({ board_seq: boardId, page, rowsPerPage }),
  })

  const updateMutation = useMutation({
    mutationFn: ({
      board_seq,
      board_sub_seq,
      content,
    }: {
      board_seq: string
      board_sub_seq?: string
      content?: string
    }) =>
      updateComment({
        board_seq: board_seq ?? "",
        board_sub_seq: board_sub_seq ?? "",
        content: content ?? "",
      }),
  })
  const deleteMutation = useMutation({
    mutationFn: ({ board_sub_seq }: { board_sub_seq: string }) =>
      deleteComment({ board_seq: boardId, board_sub_seq }),
  })

  useEffect(() => {
    if (!commentsResult) {
      return
    }
    setComments(commentsResult.data)
    setOriComments(commentsResult.data)
    setPage(commentsResult.currentPage)
    setTotalPages(commentsResult.totalPages)
  }, [commentsResult])

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

  const handleGoEdit = ({ board_sub_seq }: { board_sub_seq?: string }) => {
    setComments(
      comments.map((c) => {
        if (c.board_sub_seq === board_sub_seq) {
          return { ...c, isEditable: true }
        }
        const ori = oriComments.find((oc) => oc.board_sub_seq === c.board_sub_seq)
        return { ...c, isEditable: false, content: ori?.content }
      }),
    )
  }

  const handleCancleEdit = () => {
    setComments(oriComments)
  }

  const handleSave = ({ board_sub_seq, content }: { board_sub_seq?: string; content?: string }) => {
    updateMutation.mutate(
      {
        board_seq: boardId,
        board_sub_seq,
        content,
      },
      {
        onSuccess: () => {
          toast.success("저장했습니다.")
          queryClient.invalidateQueries({ queryKey: ["comment"] })
          if (!board_sub_seq) {
            setArticle({})
          }
        },
        onError: (error) => {
          console.error("Error saving changes:", error)
        },
      },
    )
  }

  const handleDelete = ({ board_sub_seq }: { board_sub_seq?: string }) => {
    if (!board_sub_seq) {
      toast.info("선택된 게시물이 없습니다.")
      return
    }
    deleteMutation.mutate(
      { board_sub_seq },
      {
        onSuccess: () => {
          toast.success("삭제했습니다.")
          queryClient.invalidateQueries({ queryKey: ["comment"] })
        },
        onError: (error) => {
          console.error("Error saving changes:", error)
        },
      },
    )
  }

  const handlePageChange = (c: number) => {
    setPage(c)
  }

  if (isLoading) {
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
      <h3 className="mb-3 ml-1 text-lg font-bold dark:text-white">댓글</h3>

      <div className="flex gap-2">
        <div className="board_comment_input">
          <SnmsCKEditor
            content={article.content ?? ""}
            isEditable
            handleSave={(c) => {
              setArticle((prevArticle) => {
                if (prevArticle.content === c) return prevArticle // 상태가 동일하면 업데이트 방지
                return { ...prevArticle, content: c }
              })
            }}
          />
        </div>
        <div className="w-20">
          <Button
            fullWidth
            className="h-full"
            onClick={() => handleSave({ content: article.content })}
            variant="outlined"
            size="medium"
            sx={[
              (theme) => ({
                background: theme.palette.primary.main,
                color: "#fff",
              }),
            ]}
          >
            작성
          </Button>
        </div>
      </div>

      <Divider sx={{ my: 2 }} />

      {comments.map((cm) => {
        return (
          <>
            <div className="mb-2 flex items-end justify-between">
              <Typography
                variant="caption"
                className="text-sm text-gray-400 dark:text-gray-400"
              >{`${cm.create_user_name} / ${formatDate(cm.create_date ?? "")}`}</Typography>

              <Box className="dark:bg-black" display="flex" gap={1} flexWrap="wrap">
                {currentUser?.user_id === cm.create_user_id && cm.isEditable && (
                  <Button
                    onClick={() =>
                      handleSave({ board_sub_seq: cm.board_sub_seq, content: cm.content })
                    }
                    color="primary"
                    variant="outlined"
                    size="small"
                  >
                    저장
                  </Button>
                )}
                {currentUser?.user_id === cm.create_user_id && cm.isEditable && (
                  <Button
                    onClick={handleCancleEdit}
                    color="primary"
                    variant="outlined"
                    size="small"
                  >
                    취소
                  </Button>
                )}
                {currentUser?.user_id === cm.create_user_id && !cm.isEditable && (
                  <Button
                    onClick={() => handleGoEdit({ board_sub_seq: cm.board_sub_seq })}
                    color="primary"
                    variant="outlined"
                    size="small"
                  >
                    수정
                  </Button>
                )}
                {currentUser?.user_id === cm.create_user_id && !cm.isEditable && (
                  <Button
                    onClick={() => handleDelete({ board_sub_seq: cm.board_sub_seq })}
                    color="error"
                    variant="outlined"
                    size="small"
                  >
                    삭제
                  </Button>
                )}
              </Box>
            </div>
            <SnmsCKEditor
              key={cm.board_sub_seq + String(cm.isEditable)}
              content={cm.content ?? ""}
              isEditable={cm.isEditable ?? false}
              handleSave={(ct) => {
                setComments(
                  comments.map((c) => {
                    if (c.board_sub_seq === cm.board_sub_seq && c.content !== ct) {
                      return { ...c, content: ct }
                    }
                    return c
                  }),
                )
              }}
            />

            <Divider sx={{ my: 2 }} />
          </>
        )
      })}

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
    </Box>
  )
}
