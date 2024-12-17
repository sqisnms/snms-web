import { getRoleList } from "@/actions/role-actions"
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material"
import { useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"

type RolePopupProps = {
  open: boolean
  handleClose: () => void
  handleSave: (selectedRoleIds: string[] | null) => void
  prevRoleIds: string[] | null
}

export function RolePopup({ open, handleClose, handleSave, prevRoleIds }: RolePopupProps) {
  const [roleIds, setRoleIds] = useState<string[] | null>(null)
  const { data: list = [] } = useQuery({
    queryKey: ["roleList"],
    queryFn: () => getRoleList(),
  })

  useEffect(() => {
    setRoleIds(prevRoleIds)
  }, [prevRoleIds, open])

  const toggleSelectRole = (roleId: string) => {
    setRoleIds(
      (prev) =>
        prev?.includes(roleId)
          ? prev?.filter((id) => id !== roleId) // 이미 선택된 경우 제거
          : [...(prev ?? []), roleId], // 선택되지 않은 경우 추가
    )
  }

  const handleSavePopup = () => {
    handleSave(roleIds?.filter((r) => r) ?? null)
    handleClose()
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
      <DialogTitle className="dark:text-white">권한 선택</DialogTitle>
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
                  ID
                </TableCell>
                <TableCell sx={{ paddingY: "0px" }} className="dark:text-white">
                  이름
                </TableCell>
                <TableCell sx={{ paddingY: "0px" }} className="dark:text-white">
                  설명
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {list.map((role) => (
                <TableRow
                  key={role.role_id}
                  // onClick={() => handleView(board.id ?? "")}
                  onClick={() => toggleSelectRole(role.role_id)}
                  className={`h-10 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 ${
                    (roleIds ?? []).includes(role.role_id) ? "bg-gray-200 dark:bg-gray-700" : ""
                  }`}
                >
                  <TableCell sx={{ paddingY: "0px" }}>
                    <Typography className="w-48 truncate dark:text-white">
                      {role.role_id}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ paddingY: "0px" }}>
                    <Typography className="w-48 truncate dark:text-white">
                      {role.role_name}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ paddingY: "0px" }}>
                    <Typography className="w-48 truncate dark:text-white">
                      {role.role_desc}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>

      {/* Dialog Actions */}
      <DialogActions className="p-4 pt-0 dark:bg-black">
        <Button onClick={handleSavePopup}>저장</Button>
        <Button onClick={handleClose} color="primary" className="dark:text-white">
          닫기
        </Button>
      </DialogActions>
    </Dialog>
  )
}
