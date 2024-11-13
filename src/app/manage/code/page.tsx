"use client"

import { getCodeList, updateCode } from "@/actions/manage-actions"
import { CommonCodeEdit } from "@/types/commonCode"
import CachedIcon from "@mui/icons-material/Cached"
import DeleteIcon from "@mui/icons-material/Delete"
import {
  Box,
  Button,
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

  const { data: codes = [], refetch } = useQuery({
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
    <div>
      <h1>공통 코드 관리</h1>
      <Box display="flex" gap={4}>
        {/* 좌측: 카테고리 목록 */}
        <Box width="30%">
          <Box mt={2} display="flex" alignItems="center" gap={1}>
            <TextField
              variant="outlined"
              placeholder="검색어 입력"
              fullWidth
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <IconButton
              size="small"
              onClick={() => {
                setEditCodes([])
                refetch()
              }}
            >
              <CachedIcon fontSize="small" />
            </IconButton>
          </Box>
          <Divider sx={{ mt: 1, mb: 1 }} />
          <ul>
            {categories
              .filter(
                (item) => !searchQuery || item.toLowerCase().includes(searchQuery.toLowerCase()),
              )
              .map((category) => (
                <li key={category}>
                  <Button
                    fullWidth
                    variant={selectedCategory === category ? "contained" : "outlined"}
                    color="primary"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Button>
                </li>
              ))}
          </ul>
        </Box>

        {/* 우측: 코드 목록 및 검색 */}
        <Box width="70%">
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <TextField
              variant="outlined"
              size="small"
              placeholder="새 카테고리"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
            <Button variant="contained" color="primary" onClick={handleAddCategory}>
              +
            </Button>

            <Box display="flex" gap={2} ml="auto">
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
              >
                추가
              </Button>
              <Button variant="contained" color="secondary" onClick={() => handleSave()}>
                저장
              </Button>
            </Box>
          </Box>

          {/* 코드 테이블 */}
          <Table sx={{ "& .MuiTableCell-root": { padding: "4px 4px" } }}>
            <TableHead>
              <TableRow>
                <TableCell>CATEGORY</TableCell>
                <TableCell>CODE</TableCell>
                <TableCell>CODE_NAME</TableCell>
                <TableCell>REMARKS</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {editCodes
                .filter((code) => (selectedCategory ? code.category === selectedCategory : false))
                .map((code) => (
                  <TableRow key={code.key}>
                    <TableCell>{code.category}</TableCell>
                    <TableCell>
                      <TextField
                        variant="outlined"
                        value={code.code}
                        onChange={(e) =>
                          handleUpdate({ ...code, CODE: e.target.value } as CommonCodeEdit)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        variant="outlined"
                        value={code.code_name}
                        onChange={(e) =>
                          handleUpdate({ ...code, CODE_NAME: e.target.value } as CommonCodeEdit)
                        }
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
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton size="small" onClick={() => handleDelete(code.key ?? "")}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </Box>
      </Box>
    </div>
  )
}
