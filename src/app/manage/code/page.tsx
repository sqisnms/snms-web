"use client"

import { getCodeList, updateCode } from "@/actions/manage-actions"
import { CommonCodeEdit } from "@/types/commonCode"
import CachedIcon from "@mui/icons-material/Cached"
import DeleteIcon from "@mui/icons-material/Delete"
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { v4 } from "uuid"

export default function CodeManager() {
  const queryClient = useQueryClient()
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [editCodes, setEditCodes] = useState<CommonCodeEdit[]>([])
  const [newCategory, setNewCategory] = useState<string>("")

  const {
    data: codes = [],
    refetch,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["codes"],
    queryFn: () => getCodeList(),
  })

  useEffect(() => {
    if (codes.length > 0 && editCodes.length === 0) {
      setEditCodes(
        codes.map((item) => ({
          ...item,
          key: v4(),
        })),
      )
    }
  }, [codes, editCodes.length])

  const updateMutation = useMutation({
    mutationFn: updateCode,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["codes"],
        exact: true,
        refetchType: "active",
      }),
  })

  // 카테고리 목록 추출
  const categories = Array.from(new Set(editCodes.map((code) => code.category)))

  // 추가/수정/삭제 핸들러
  const handleAdd = (newCode: CommonCodeEdit) => {
    setEditCodes([...editCodes, newCode])
  }

  const handleUpdate = (updatedCode: CommonCodeEdit) => {
    setEditCodes((prevCodes) =>
      prevCodes.map((code) => (code.key === updatedCode.key ? updatedCode : code)),
    )
  }

  const handleDelete = (key: string) => {
    setEditCodes(editCodes.filter((item) => item.key !== key))
  }

  const handleSave = () => {
    const { data: sortOrderCodes } = editCodes.reduce(
      (acc, curr) => {
        const key = curr.category
        if (!acc.tempOrd[key]) {
          acc.tempOrd[key] = 0
        }
        acc.tempOrd[key] += 1
        acc.data.push({ ...curr, sort_order: acc.tempOrd[key] })
        return acc
      },
      { data: [] as CommonCodeEdit[], tempOrd: {} as { [key: string]: number } },
    )

    const changes: CommonCodeEdit[] = []

    // 새로 추가된 항목과 업데이트된 항목 찾기
    sortOrderCodes.forEach((editCode) => {
      const originalCode = codes.find(
        (code) => code.category === editCode.category && code.code === editCode.code,
      )

      if (!originalCode) {
        // 새로 추가된 항목
        changes.push({ ...editCode, flag: "add" })
      } else if (
        originalCode.code_name !== editCode.code_name ||
        originalCode.use_yn !== editCode.use_yn ||
        Number(originalCode.sort_order) !== Number(editCode.sort_order) ||
        originalCode.remarks !== editCode.remarks
      ) {
        // 업데이트된 항목
        changes.push({ ...editCode, flag: "update" })
      }
    })

    // 삭제된 항목 찾기
    codes.forEach((code) => {
      const stillExists = sortOrderCodes.some(
        (editCode) => editCode.category === code.category && editCode.code === code.code,
      )
      if (!stillExists) {
        changes.push({ ...code, flag: "del" })
      }
    })

    // 변경사항이 있는 경우에만 서버에 요청을 보냅니다.
    if (changes.length > 0) {
      console.log(changes)
      updateMutation.mutate(changes, {
        onSuccess: () => {
          toast.success("저장되었습니다.")
          setEditCodes([])
          queryClient.invalidateQueries({ queryKey: ["codes"] })
        },
        onError: (error) => {
          console.error("Error saving changes:", error)
        },
      })
    } else {
      toast.warning("변경사항이 없습니다.")
    }
  }

  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory)) {
      setEditCodes([
        ...editCodes,
        {
          category: newCategory,
          code: "",
          code_name: "",
          use_yn: "Y",
          sort_order: 0,
          remarks: "",
          key: v4(),
        },
      ])
      setNewCategory("") // 입력란 초기화
    }
  }

  return (
    <Box
      display="flex"
      gap={2}
      sx={[
        (theme) => ({
          flexDirection: "column",
          [theme.breakpoints.up("md")]: {
            flexDirection: "row",
          },
        }),
      ]}
    >
      {/* 좌측: 카테고리 목록 */}
      <Box
        sx={[
          (theme) => ({
            width: "100%",
            [theme.breakpoints.up("md")]: {
              minWidth: "300px",
              width: "20%",
            },
          }),
        ]}
      >
        <Box display="flex" alignItems="center" gap={1} className="dark:bg-black">
          <TextField
            variant="outlined"
            placeholder="검색어 입력"
            fullWidth
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              height: "40px",
            }}
          />
          <IconButton
            size="small"
            onClick={() => {
              setEditCodes([])
              refetch()
            }}
            className="dark:text-white"
          >
            <CachedIcon fontSize="small" />
          </IconButton>
        </Box>
        <Divider className="dark:border-gray-400" sx={{ mt: 1, mb: 1 }} />

        {isLoading || isFetching ? (
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
        ) : (
          <ul>
            {categories
              .filter(
                (item) => !searchQuery || item.toLowerCase().includes(searchQuery.toLowerCase()),
              )
              .map((category) => (
                <li className="mt-2" key={category}>
                  <Button
                    fullWidth
                    variant={selectedCategory === category ? "contained" : "outlined"}
                    color="primary"
                    sx={[
                      (theme) => ({
                        backgroundColor: selectedCategory === category ? "primary.main" : "white",
                        color: selectedCategory === category ? "white" : "primary.main",
                        borderColor: selectedCategory === category ? "transparent" : "primary.main",
                        borderWidth: "1px",
                        borderStyle: "solid",
                        boxShadow: "none",
                        "&:hover": {
                          backgroundColor:
                            selectedCategory === category ? "primary.dark" : "grey.100",
                        },
                        ...(theme.palette.mode === "dark" && {
                          backgroundColor:
                            selectedCategory === category ? "secondary.main" : "black",
                          color: selectedCategory === category ? "white" : "white",
                          borderColor: selectedCategory === category ? "transparent" : "white",
                          "&:hover": {
                            backgroundColor:
                              selectedCategory === category ? "secondary.dark" : "grey.900",
                          },
                        }),
                      }),
                    ]}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Button>
                </li>
              ))}
          </ul>
        )}

        <Box display="flex" flexDirection="column" alignItems="center" gap={1} mb={2} mt={2}>
          <TextField
            variant="outlined"
            size="small"
            placeholder="새 카테고리"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="mt-0 w-full"
          />
          <Button
            variant="contained"
            onClick={handleAddCategory}
            className="h-9 w-full"
            sx={[
              (theme) => ({
                background: theme.palette.secondary.main,
                fontSize: "1.25rem",
                lineHeight: "1.75rem",
                boxShadow: "none",
                color: theme.palette.primary.contrastText,
                "&:hover": {
                  background: theme.palette.secondary.dark,
                  boxShadow: "none",
                },
              }),
            ]}
          >
            +
          </Button>
        </Box>
      </Box>

      {/* 우측: 코드 목록 및 검색 */}
      <Box
        width="80%"
        sx={[
          (theme) => ({
            width: "100%",
            borderTopWidth: "2px",
            paddingTop: "1rem",
            ...theme.applyStyles("dark", {
              borderColor: "rgb(75, 85, 99)",
            }),
            [theme.breakpoints.up("md")]: {
              maxWidth: "calc(100% - 316px)",
              width: "80%",
              borderTopWidth: "0",
              borderLeftWidth: "2px",
              paddingTop: "0",
              paddingLeft: "1rem",
            },
          }),
        ]}
        className="code_wrap"
      >
        <Box display="flex" gap={1} justifyContent="flex-end" mb={1}>
          <Button
            variant="contained"
            color="primary"
            onClick={() =>
              handleAdd({
                category: selectedCategory ?? "",
                code: "",
                code_name: "",
                use_yn: "Y",
                sort_order: 0,
                remarks: "",
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

        {/* 코드 테이블 */}
        <div className="overflow-y-auto rounded-md">
          <Table
            sx={[
              (theme) => ({
                "& .MuiTableCell-root": { padding: "4px 16px" },
                backgroundColor: "#fafafa",
                ...theme.applyStyles("dark", {
                  backgroundColor: "#000",
                }),
              }),
            ]}
          >
            <TableHead
              sx={[
                (theme) => ({
                  height: "40px",
                  background: "#e5e7eb",
                  ...theme.applyStyles("dark", {
                    backgroundColor: "#1f2937",
                  }),
                }),
              ]}
            >
              <TableRow>
                <TableCell className="dark:text-white">CATEGORY</TableCell>
                <TableCell className="dark:text-white">CODE</TableCell>
                <TableCell className="dark:text-white">CODE_NAME</TableCell>
                <TableCell className="dark:text-white">REMARKS</TableCell>
                <TableCell className="dark:text-white" />
              </TableRow>
            </TableHead>
            <TableBody>
              {editCodes
                .filter((code) => (selectedCategory ? code.category === selectedCategory : false))
                .map((code) => (
                  <TableRow key={code.key}>
                    <TableCell className="dark:text-white">{code.category}</TableCell>
                    <TableCell className="dark:text-white">
                      <TextField
                        variant="outlined"
                        value={code.code}
                        onChange={(e) =>
                          handleUpdate({ ...code, CODE: e.target.value } as CommonCodeEdit)
                        }
                        sx={{
                          width: "280px",
                          height: "40px",
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        variant="outlined"
                        value={code.code_name}
                        onChange={(e) =>
                          handleUpdate({ ...code, CODE_NAME: e.target.value } as CommonCodeEdit)
                        }
                        sx={{
                          width: "280px",
                          height: "40px",
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        variant="outlined"
                        value={code.remarks}
                        onChange={(e) =>
                          handleUpdate({ ...code, REMARKS: e.target.value } as CommonCodeEdit)
                        }
                        slotProps={{
                          htmlInput: { maxLength: 25 },
                        }}
                        sx={{
                          width: "280px",
                          height: "40px",
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton size="small" onClick={() => handleDelete(code.key ?? "")}>
                        <DeleteIcon className="dark:text-white" fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </Box>
    </Box>
  )
}
