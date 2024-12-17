import { getUsersByTeamCode } from "@/actions/team-actions"
import { UserType } from "@/types/user"
import { Close } from "@mui/icons-material"
import {
  Chip,
  IconButton,
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

import { deleteUserRole, updateUserRole } from "@/actions/role-actions"
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-toastify"
import { RolePopup } from "../role/RolePopup"

type TableProps = {
  selectedCode: string
}

export function TeamTable({ selectedCode }: TableProps) {
  const queryClient = useQueryClient()
  const [datas, setDatas] = useState<Partial<UserType>[]>([])
  const [columns, setColumns] = useState<{ name: string; comment: string }[]>([])

  const [roleOpen, setRoleOpen] = useState(false)
  const [roleIds, setRoleIds] = useState<string[] | null>(null)
  const [selectedUser, setSelectedUser] = useState<string>("")

  const updateRoleMutation = useMutation({
    mutationFn: updateUserRole,
  })
  const deleteRoleMutation = useMutation({
    mutationFn: deleteUserRole,
  })

  const { data: users = [] } = useQuery({
    queryKey: ["getUsersByTeamCode", selectedCode],
    queryFn: () => getUsersByTeamCode({ code: selectedCode }),
  })

  useEffect(() => {
    if (users.length > 0) {
      setColumns([
        { name: "user_id", comment: "ID" },
        { name: "user_name", comment: "이름" },
        { name: "login_id", comment: "로그인ID" },
        { name: "title", comment: "직급" },
        { name: "duty_name", comment: "직책" },
        { name: "business", comment: "담당업무" },
        { name: "pcsphone", comment: "연락처" },
        { name: "role_ids", comment: "권한" },
      ])
    }
    setDatas(users)
  }, [JSON.stringify(users)])

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

  const handleRoleSave = (selectedRoleIds: string[] | null) => {
    updateRoleMutation.mutate(
      { user_id: selectedUser, role_ids: selectedRoleIds },
      {
        onSuccess: () => {
          toast.success("저장되었습니다.")
          queryClient.invalidateQueries({ queryKey: ["getUsersByTeamCode"] })
        },
        onError: (error) => {
          console.error("Error saving changes:", error)
        },
      },
    )
  }

  const handleRoleDelete = (user_id: string, role_id: string) => {
    deleteRoleMutation.mutate(
      { user_id, role_id },
      {
        onSuccess: () => {
          toast.success("저장되었습니다.")
          queryClient.invalidateQueries({ queryKey: ["getUsersByTeamCode"] })
        },
        onError: (error) => {
          console.error("Error saving changes:", error)
        },
      },
    )
  }

  return (
    <>
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

                    // 권한 컬럼 처리
                    if (column.name.toLowerCase() === "role_ids") {
                      return (
                        <TableCell
                          key={column.name}
                          className="whitespace-nowrap dark:bg-black dark:text-white"
                        >
                          {(value as string[]).map((v) => {
                            if (v) {
                              return (
                                <Chip
                                  key={v}
                                  label={(data.role_names ?? [])[data.role_ids?.indexOf(v) ?? 0]}
                                  color="secondary"
                                  size="small"
                                  variant="outlined"
                                  onDelete={() => handleRoleDelete(data.user_id ?? "", v)}
                                  deleteIcon={<Close />}
                                />
                              )
                            }
                            return undefined
                          })}
                          <IconButton
                            size="small"
                            onClick={() => {
                              setSelectedUser(data.user_id ?? "")
                              setRoleIds(data.role_ids ?? null)
                              setRoleOpen(true)
                            }}
                          >
                            <AddCircleOutlineIcon
                              className="dark:text-white"
                              fontSize="small"
                              color="secondary"
                            />
                          </IconButton>
                        </TableCell>
                      )
                    }

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
      <RolePopup
        open={roleOpen}
        handleClose={() => {
          setRoleOpen(false)
        }}
        handleSave={handleRoleSave}
        prevRoleIds={roleIds}
      />
    </>
  )
}
