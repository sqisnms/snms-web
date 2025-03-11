import {
  Box,
  Button,
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

import { deleteProcessMast, getProcessMonitorList } from "@/actions/system-actions"
import { ProcessMonitorListType } from "@/types/system"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-toastify"
import ConfirmDialog from "../common/ConfirmDialog"
import { ProcessMastEditPopup } from "./ProcessMastEditPopup"

type TableProps = {
  selectedCode: string
  setSelectedCode: (c: string) => void
}

export function SystemMonitorProcessTable({ selectedCode, setSelectedCode }: TableProps) {
  const queryClient = useQueryClient()
  const [datas, setDatas] = useState<ProcessMonitorListType[]>([])
  const [columns, setColumns] = useState<{ name: string; comment: string; width: string }[]>([])
  const [selectedRow1, setSelectedRow1] = useState<string>("")
  const [selectedRow2, setSelectedRow2] = useState<string>("")

  const [editOpen, setEditOpen] = useState(false)
  const [editParam, setEditParam] = useState<{ serverId: string; processName: string } | null>(null)
  const [editType, setEditType] = useState<"add" | "mod">("add")
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)

  const { data = [], isLoading } = useQuery({
    queryKey: ["getProcessMonitorList"],
    queryFn: () => getProcessMonitorList(),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteProcessMast,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getProcessMonitorList"],
      })

      toast.success("삭제되었습니다")
    },
  })

  useEffect(() => {
    if (data.length > 0) {
      setColumns([
        { name: "server_id", comment: "Server_ID", width: "150px" },
        { name: "process_name", comment: "프로세스명", width: "200px" },
        { name: "process_kind", comment: "종류", width: "100px" },
        { name: "process_directory", comment: "실행 위치", width: "250px" },
        { name: "execute_kind", comment: "실행방법", width: "150px" },
        { name: "create_time", comment: "가동시간", width: "150px" },
        { name: "sum_cpu", comment: "CPU 사용률", width: "150px" },
        { name: "sum_memory_usage", comment: "MEM 사용률", width: "150px" },
        { name: "sum_rss", comment: "Real MEM", width: "150px" },
      ])

      setSelectedRow1(data[0].server_id)
      setSelectedRow2(data[0].process_name)
      setEditParam({ serverId: data[0].server_id, processName: data[0].process_name })
    } else {
      setSelectedRow1("")
      setSelectedRow2("")
      setEditParam(null)
    }
    setDatas(data)
  }, [JSON.stringify(data)])

  useEffect(() => {
    setSelectedCode(`&var-server_id=${selectedRow1}&var-process_name=${selectedRow2}`)
  }, [selectedRow1, selectedRow2, setSelectedCode])

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

  const handleAdd = () => {
    setEditType("add")
    setEditOpen(true)
  }

  const handleEdit = () => {
    setEditType("mod")
    setEditOpen(true)
  }

  const handleDelete = () => {
    setOpenDeleteDialog(true)
  }

  const handleDeleteClose = () => {
    setOpenDeleteDialog(false)
  }

  const handleDeleteConfirm = () => {
    deleteMutation.mutate({ serverId: selectedRow1, processName: selectedRow2 })
    setOpenDeleteDialog(false)
  }

  return (
    <>
      <TableContainer
        className="mt-5 rounded-md"
        sx={{
          maxHeight: "200px",
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
                  onClick={() => {
                    setSelectedRow1(d.server_id)
                    setSelectedRow2(d.process_name)
                    setEditParam({ serverId: d.server_id, processName: d.process_name })
                  }}
                  sx={{
                    cursor: "pointer",
                    backgroundColor:
                      selectedRow1 === d.server_id && selectedRow2 === d.process_name
                        ? "#e0f7fa"
                        : undefined,
                  }}
                >
                  {columns.map((column) => {
                    const value = d[column.name as keyof ProcessMonitorListType]

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
            onClick={handleAdd}
          >
            등록
          </Button>
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
            onClick={handleEdit}
          >
            수정
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
            onClick={handleDelete}
          >
            삭제
          </Button>
        </div>
      </div>
      <ProcessMastEditPopup
        open={editOpen}
        handleClose={() => {
          setEditOpen(false)
        }}
        param={editParam}
        type={editType}
      />
      <ConfirmDialog
        open={openDeleteDialog}
        title="프로세스 삭제"
        message="정말 이 프로세스를 삭제하시겠습니까?"
        handleClose={handleDeleteClose}
        handleConfirm={handleDeleteConfirm}
      />
    </>
  )
}
