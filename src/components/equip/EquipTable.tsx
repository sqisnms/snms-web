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
} from "@mui/material"
import { useEffect, useState } from "react"

type EquipTableProps = {
  selectedEquipTypeCode: string
}

export function EquipTable({ selectedEquipTypeCode }: EquipTableProps) {
  const [equips, setEquips] = useState<Partial<EquipType>[]>([])
  const [columns, setColumns] = useState<{ name: string; comment: string }[]>([])

  useEffect(() => {
    getEquipByTypeCode({ EQUIP_TYPE_CODE: selectedEquipTypeCode })
      .then((data) => {
        console.table(data)
        console.log(JSON.stringify(data))
        if (data.length > 0) {
          setColumns([
            { name: "EQUIP_ID", comment: "고유Key" },
            { name: "CURRENT_EQUIP_ID", comment: "장비ID" },
            { name: "EQUIP_NAME", comment: "장비명" },
            { name: "PARENT_EQUIP_ID", comment: "상위장비" },
            { name: "EQUIP_TYPE_CODE", comment: "장비종류" },
            { name: "NET_TYPE_CODE", comment: "장비구분" },
            { name: "GENERATION_CODE", comment: "세대구분" },
            { name: "VENDOR_CODE", comment: "제조사" },
            { name: "MODEL_CODE", comment: "모델" },
            { name: "TEAM_CODE", comment: "조직" },
            { name: "OPEN_DATE", comment: "개통일자" },
            { name: "EQUIP_STATUS", comment: "장비상태" },
            { name: "IP_ADDRESS", comment: "IP주소" },
            { name: "MGR_MAIN_USER", comment: "관리담당자(정)" },
            { name: "MGR_SUB_USER", comment: "관리담당자(부)" },
            { name: "CITY", comment: "시도" },
            { name: "DISTRICT", comment: "시군구" },
            { name: "DONG", comment: "읍면동" },
            { name: "STREET", comment: "번지" },
            { name: "CREATE_DATE", comment: "생성일자" },
            { name: "MODIFY_DATE", comment: "수정일자" },
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
    <TableContainer component={Paper} className="p-4">
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell
                key={column.name}
                className="whitespace-nowrap font-semibold text-gray-600"
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
          {equips.map((equip) => (
            <TableRow key={equip.EQUIP_ID}>
              {columns.map((column) => {
                const value = equip[column.name as keyof EquipType]

                // 날짜 컬럼 처리
                if (column.name.toLowerCase().includes("date")) {
                  return (
                    <TableCell key={column.name} className="whitespace-nowrap">
                      {formatDate(String(value))}
                    </TableCell>
                  )
                }

                // 일반 값 처리
                if (value !== null && value !== undefined) {
                  return <TableCell key={column.name}>{String(value)}</TableCell>
                }

                // 값이 null 또는 undefined인 경우
                return <TableCell key={column.name}>N/A</TableCell>
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
