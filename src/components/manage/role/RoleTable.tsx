import { getRoleList, updateRole } from "@/actions/role-actions"
import { RoleEdit, RoleType } from "@/types/role"
import DeleteIcon from "@mui/icons-material/Delete"
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
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
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { v4 } from "uuid"

export function RoleTable() {
  const queryClient = useQueryClient()
  const [columns, setColumns] = useState<{ name: string; comment: string }[]>([])
  const [editDatas, setEditDatas] = useState<RoleEdit[]>([])

  const { data: list = [], isLoading } = useQuery({
    queryKey: ["roleList"],
    queryFn: () => getRoleList(),
  })

  const updateMutation = useMutation({
    mutationFn: updateRole,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["roleList"],
        exact: true,
        refetchType: "active",
      }),
  })

  useEffect(() => {
    if (list.length > 0) {
      setColumns([
        { name: "role_id", comment: "권한ID" },
        { name: "role_name", comment: "권한명" },
        { name: "role_desc", comment: "권한설명" },
      ])
    }
  }, [JSON.stringify(list)])

  useEffect(() => {
    if (list.length > 0 && editDatas.length === 0) {
      setEditDatas(
        list.map((item) => ({
          ...item,
          key: v4(),
        })),
      )
    }
  }, [list, editDatas.length])

  // 추가/수정/삭제 핸들러
  const handleAdd = (newCode: RoleEdit) => {
    setEditDatas([...editDatas, newCode])
  }

  const handleUpdate = (updatedCode: RoleEdit) => {
    setEditDatas((prevCodes) =>
      prevCodes.map((code) => (code.key === updatedCode.key ? updatedCode : code)),
    )
  }

  const handleDelete = (key: string) => {
    setEditDatas(editDatas.filter((item) => item.key !== key))
  }

  const handleSave = () => {
    const changes: RoleEdit[] = []
    // 새로 추가된 항목과 업데이트된 항목 찾기
    editDatas.forEach((editCode) => {
      const originalCode = list.find((code) => code.role_id === editCode.role_id)

      if (!originalCode) {
        // 새로 추가된 항목
        changes.push({ ...editCode, flag: "add" })
      } else if (
        originalCode.role_name !== editCode.role_name ||
        originalCode.role_desc !== editCode.role_desc
      ) {
        // 업데이트된 항목
        changes.push({ ...editCode, flag: "update" })
      }
    })

    // 삭제된 항목 찾기
    list.forEach((code) => {
      const stillExists = editDatas.some((editCode) => editCode.role_id === code.role_id)
      if (!stillExists) {
        changes.push({ ...code, flag: "del" })
      }
    })

    // 변경사항이 있는 경우에만 서버에 요청을 보냅니다.
    if (changes.length > 0) {
      updateMutation.mutate(changes, {
        onSuccess: () => {
          toast.success("저장되었습니다.")

          // 화면 초기화 후 재조회
          setEditDatas([])
          queryClient.invalidateQueries({ queryKey: ["roleList"] })
        },
        onError: (error) => {
          console.error("Error saving changes:", error)
        },
      })
    } else {
      toast.warning("변경사항이 없습니다.")
    }
  }

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
    <>
      {" "}
      <TableContainer component={Paper}>
        <Table
          aria-label="simple table"
          sx={[
            (theme) => ({
              background: "#fafafa",
              ...theme.applyStyles("dark", {
                background: "#000",
              }),
            }),
          ]}
        >
          <TableHead className="bg-gray-200 dark:bg-gray-800">
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.name}
                  className="whitespace-nowrap p-2 font-semibold text-gray-600 dark:text-white"
                >
                  {column.comment}
                </TableCell>
              ))}
              <TableCell
                key="actions"
                className="whitespace-nowrap p-2 font-semibold text-gray-600 dark:text-white"
              >
                삭제
              </TableCell>
              {/* <TableCell className="font-semibold text-gray-600">Column 2</TableCell>
            <TableCell className="font-semibold text-gray-600">Column 3</TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {editDatas.length === 0 ? (
              <TableRow>
                <TableCell
                  className="p-2 dark:bg-black dark:text-white"
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
                    데이터가 없습니다.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              editDatas.map((data) => (
                <TableRow key={data.key}>
                  {columns.map((column) => {
                    const value = data[column.name as keyof RoleType]

                    // 날짜 컬럼 처리
                    if (column.name.toLowerCase().includes("date")) {
                      return (
                        <TableCell
                          key={column.name}
                          className="whitespace-nowrap p-2 dark:bg-black dark:text-white"
                        >
                          {formatDate(String(value))}
                        </TableCell>
                      )
                    }

                    // 일반 값 처리
                    // if (value !== null && value !== undefined) {
                    return (
                      <TableCell className="p-2 dark:bg-black dark:text-white" key={column.name}>
                        <TextField
                          variant="outlined"
                          value={String(value ?? "")}
                          onChange={(e) =>
                            handleUpdate({
                              ...data,
                              [column.name]: e.target.value,
                            } as RoleEdit)
                          }
                          sx={{
                            height: "40px",
                          }}
                        />
                      </TableCell>
                    )
                    // }

                    // // 값이 null 또는 undefined인 경우
                    // return (
                    //   <TableCell className="dark:bg-black dark:text-white p-2 " key={column.name}>
                    //     N/A
                    //   </TableCell>
                    // )
                  })}
                  <TableCell className="p-2 dark:bg-black dark:text-white" key="edit">
                    <IconButton size="small" onClick={() => handleDelete(data.key ?? "")}>
                      <DeleteIcon className="dark:text-white" fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Box display="flex" gap={1} justifyContent="flex-end" mt={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={() =>
            handleAdd({
              role_id: "",
              role_name: "",
              role_desc: "",
              key: v4(),
            })
          }
          sx={[
            (theme) => ({
              width: "80px",
              background: theme.palette.primary.main,
              fontSize: "14px",
              lineHeight: "1.75rem",
              boxShadow: "none",
              color: theme.palette.primary.contrastText,
              "&:hover": {
                background: theme.palette.primary.dark,
                boxShadow: "none",
              },
            }),
          ]}
        >
          추가
        </Button>
        <Button
          variant="contained"
          onClick={() => handleSave()}
          sx={[
            (theme) => ({
              width: "80px",
              background: theme.palette.secondary.main,
              fontSize: "14px",
              lineHeight: "1.75rem",
              boxShadow: "none",
              color: theme.palette.secondary.contrastText,
              "&:hover": {
                background: theme.palette.secondary.dark,
                boxShadow: "none",
              },
            }),
          ]}
        >
          저장
        </Button>
      </Box>
    </>
  )
}
