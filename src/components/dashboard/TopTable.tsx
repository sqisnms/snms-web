import { getCode } from "@/actions/common-actions"
import { dashboardSelectedAtom } from "@/atom/dashboardAtom"
import { CommonCode } from "@/types/commonCode"
import { FormControl, InputLabel, MenuItem, Select, Typography } from "@mui/material"
import { useAtom } from "jotai"
import { useEffect, useState } from "react"

export function TopTable() {
  const [, setSelected] = useAtom(dashboardSelectedAtom)
  const [selectedServer, setSelectedServer] = useState("")
  const [dashboardOptions, setDashboardOptions] = useState<Partial<CommonCode>[]>([])

  useEffect(() => {
    getCode({ CATEGORY: "dashboardParam1" })
      .then((data) => {
        setDashboardOptions(data)
        if (data.length > 0) {
          setSelectedServer(data[0].CODE_NAME ?? "All")
        }
      })
      .catch((error) => {
        console.error("서버 옵션을 불러오는 데 실패했습니다:", error)
      })
  }, [])

  useEffect(() => {
    setSelected(`&var-server_id=${selectedServer}`)
  }, [selectedServer, setSelected])

  return (
    <div>
      <FormControl fullWidth>
        <InputLabel id="server-select-label">서버 선택</InputLabel>
        <Select
          labelId="server-select-label"
          id="server-select"
          value={selectedServer}
          label="서버 선택"
          onChange={(e) => setSelectedServer(e.target.value)}
        >
          {dashboardOptions.map((option) => (
            <MenuItem key={option.CODE} value={option.CODE}>
              {option.CODE_NAME}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Typography variant="body1" sx={{ mt: 2 }}>
        선택된 서버: {selectedServer}
      </Typography>
    </div>
  )
}
