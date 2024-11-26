import { getEquipByTypeCode } from "@/actions/equip-actions"
import { EquipType } from "@/types/equip"
import {
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

type EquipTableProps = {
  selectedEquipTypeCode: string
}

export function EquipTable({ selectedEquipTypeCode }: EquipTableProps) {
  const [equips, setEquips] = useState<Partial<EquipType>[]>([])
  const [columns, setColumns] = useState<{ name: string; comment: string }[]>([])

  useEffect(() => {
    getEquipByTypeCode({ equip_type_code: selectedEquipTypeCode })
      .then((data) => {
        // console.table(data)
        // console.log(JSON.stringify(data))
        if (data.length > 0) {
          setColumns([
            { name: "equip_id", comment: "고유Key" },
            { name: "current_equip_id", comment: "장비ID" },
            { name: "equip_name", comment: "장비명" },
            { name: "parent_equip_id", comment: "상위장비" },
            { name: "equip_type_code", comment: "장비종류" },
            { name: "net_type_code", comment: "장비구분" },
            { name: "generation_code", comment: "세대구분" },
            { name: "vendor_code", comment: "제조사" },
            { name: "model_code", comment: "모델" },
            { name: "team_code", comment: "조직" },
            { name: "open_date", comment: "개통일자" },
            { name: "equip_status", comment: "장비상태" },
            { name: "ip_address", comment: "IP주소" },
            { name: "mgr_main_user", comment: "관리담당자(정)" },
            { name: "mgr_sub_user", comment: "관리담당자(부)" },
            { name: "city", comment: "시도" },
            { name: "district", comment: "시군구" },
            { name: "dong", comment: "읍면동" },
            { name: "street", comment: "번지" },
            { name: "create_date", comment: "생성일자" },
            { name: "modify_date", comment: "수정일자" },
          ])
        }
        setEquips(data)
      })
      .catch((error) => {
        console.error("데이터를 불러오는 데 실패했습니다:", error)
      })
  }, [selectedEquipTypeCode])

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

  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
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
          {equips.length === 0 ? (
            <TableRow>
              <TableCell
                className="dark:bg-black dark:text-white"
                colSpan={columns.length}
                align="center"
              >
                <Typography variant="body1">좌측 분류에서 선택해주세요</Typography>
              </TableCell>
            </TableRow>
          ) : (
            equips.map((equip) => (
              <TableRow key={equip.equip_id}>
                {columns.map((column) => {
                  const value = equip[column.name as keyof EquipType]

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
  )
}
