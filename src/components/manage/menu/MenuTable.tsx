import { deleteMenu, getMenuByMenuId, updateMenu } from "@/actions/menu-actions"
import { deleteMenuRole, updateMenuRole } from "@/actions/role-actions"
import { MenuEdit, MenuType } from "@/types/menu"
import { Close } from "@mui/icons-material"
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline"
import { Box, Button, Chip, IconButton, List, TextField, Typography } from "@mui/material"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { v4 } from "uuid"
import { RolePopup } from "../role/RolePopup"

type TableProps = {
  selectedCode: string
  setTempMenu: (tempMenu: Partial<MenuType> | undefined) => void
  tempMenu?: Partial<MenuType>
}

export function MenuTable({ selectedCode, tempMenu, setTempMenu }: TableProps) {
  const queryClient = useQueryClient()
  const [datas, setDatas] = useState<Partial<MenuType> | undefined>(undefined)
  const [editDatas, setEditDatas] = useState<MenuEdit | undefined>(undefined)
  const [columns, setColumns] = useState<{ name: string; comment: string }[]>([])

  const [roleOpen, setRoleOpen] = useState(false)
  const [roleIds, setRoleIds] = useState<string[] | null>(null)
  const [selectedMenu, setSelectedMenu] = useState<string>("")

  const updateMutation = useMutation({
    mutationFn: updateMenu,
  })

  const deleteMutation = useMutation({
    mutationFn: deleteMenu,
  })

  const updateRoleMutation = useMutation({
    mutationFn: updateMenuRole,
  })
  const deleteRoleMutation = useMutation({
    mutationFn: deleteMenuRole,
  })

  const { data: menuData } = useQuery({
    queryKey: ["getMenu", selectedCode],
    queryFn: () => getMenuByMenuId({ menu_id: selectedCode }),
    enabled: !!selectedCode,
  })

  useEffect(() => {
    if (!tempMenu && !menuData) return
    setColumns([
      { name: "menu_id", comment: "메뉴ID" },
      { name: "upper_menu_id", comment: "상위메뉴ID" },
      { name: "menu_name", comment: "메뉴이름" },
      { name: "url", comment: "URL" },
      { name: "menu_order", comment: "메뉴순서" },
      { name: "leaf_node_yn_code", comment: "LEAF노드여부" },
      { name: "pop_up_yn_code", comment: "팝업여부" },
      { name: "screen_width", comment: "화면넓이" },
      { name: "screen_height", comment: "화면높이" },
      { name: "use_yn_code", comment: "사용여부" },
    ])
    setDatas(tempMenu || menuData)

    setEditDatas(
      tempMenu
        ? {
            ...(tempMenu as MenuType),
            key: v4(),
          }
        : {
            ...(menuData as MenuType),
            key: v4(),
          },
    )
  }, [menuData, tempMenu])

  const handleSave = () => {
    updateMutation.mutate(editDatas as MenuEdit, {
      onSuccess: () => {
        toast.success("저장되었습니다.")

        // 화면 초기화 후 재조회
        setTempMenu(undefined)
        setEditDatas(undefined)
        queryClient.invalidateQueries({ queryKey: ["getMenu"] })
        queryClient.invalidateQueries({ queryKey: ["menuList"] })
      },
      onError: (error) => {
        console.error("Error saving changes:", error)
      },
    })
  }

  const handleDelete = () => {
    deleteMutation.mutate(editDatas as MenuEdit, {
      onSuccess: () => {
        toast.success("저장되었습니다.")

        // 화면 초기화 후 재조회
        setTempMenu(undefined)
        setEditDatas(undefined)
        queryClient.invalidateQueries({ queryKey: ["getMenu"] })
        queryClient.invalidateQueries({ queryKey: ["menuList"] })
      },
      onError: (error) => {
        console.error("Error saving changes:", error)
      },
    })
  }

  const handleUpdate = (updatedCode: MenuEdit) => {
    setEditDatas(updatedCode)
  }

  const handleRoleSave = (selectedRoleIds: string[] | null) => {
    updateRoleMutation.mutate(
      { menu_id: selectedMenu, role_ids: selectedRoleIds },
      {
        onSuccess: () => {
          toast.success("저장되었습니다.")
          queryClient.invalidateQueries({ queryKey: ["getMenu"] })
        },
        onError: (error) => {
          console.error("Error saving changes:", error)
        },
      },
    )
  }

  const handleRoleDelete = (menu_id: string, role_id: string) => {
    deleteRoleMutation.mutate(
      { menu_id, role_id },
      {
        onSuccess: () => {
          toast.success("저장되었습니다.")
          queryClient.invalidateQueries({ queryKey: ["getMenu"] })
        },
        onError: (error) => {
          console.error("Error saving changes:", error)
        },
      },
    )
  }

  return (
    <Box>
      {!datas ? (
        <Box>메뉴를 선택해주세요</Box>
      ) : (
        <>
          <Box display="flex" flexWrap="wrap" gap={1}>
            {columns.map((column) => {
              const value = editDatas?.[column.name as keyof MenuType]
              return (
                <TextField
                  key={column.name}
                  variant="outlined"
                  value={String(value ?? "")}
                  label={column.comment}
                  onChange={(e) =>
                    handleUpdate({
                      ...editDatas,
                      [column.name]: e.target.value,
                    } as MenuEdit)
                  }
                  sx={{
                    height: "40px",
                    width: "45%",
                  }}
                />
              )
            })}
          </Box>
          {!tempMenu && (
            <Box display="flex" flexWrap="wrap" gap={3} height="3rem">
              <Box display="flex" alignItems="center" gap={1}>
                <Typography>권한</Typography>
                <IconButton
                  size="small"
                  onClick={() => {
                    setSelectedMenu(editDatas?.menu_id ?? "")
                    setRoleIds(editDatas?.role_ids ?? null)
                    setRoleOpen(true)
                  }}
                >
                  <AddCircleOutlineIcon
                    className="dark:text-white"
                    fontSize="small"
                    color="secondary"
                  />
                </IconButton>
              </Box>
              <List>
                {((editDatas?.role_ids ?? []) as string[]).map((v) => {
                  if (v) {
                    return (
                      <Chip
                        key={v}
                        label={(editDatas?.role_names ?? [])[editDatas?.role_ids?.indexOf(v) ?? 0]}
                        color="secondary"
                        size="medium"
                        variant="outlined"
                        onDelete={() => handleRoleDelete(editDatas?.menu_id ?? "", v)}
                        deleteIcon={<Close />}
                      />
                    )
                  }
                  return undefined
                })}
              </List>
            </Box>
          )}
          <Button
            variant="contained"
            onClick={() => handleSave()}
            sx={[
              (theme) => ({
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
          {!tempMenu && (
            <Button
              variant="contained"
              onClick={() => handleDelete()}
              sx={[
                (theme) => ({
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
              삭제
            </Button>
          )}
          <RolePopup
            open={roleOpen}
            handleClose={() => {
              setRoleOpen(false)
            }}
            handleSave={handleRoleSave}
            prevRoleIds={roleIds}
          />
        </>
      )}
    </Box>
  )
}
