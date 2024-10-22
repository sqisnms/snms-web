import { dashboardSelectedAtom } from "@/atom/dashboardAtom"
import { FormControl, InputLabel, MenuItem, Select, Typography } from "@mui/material"
import { useAtom } from "jotai"
import { useEffect, useState } from "react"

export function TopTable() {
  const [, setSelected] = useAtom(dashboardSelectedAtom)
  const [selectedServer, setSelectedServer] = useState("sqinms_m01")

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
          <MenuItem value="sqinms_m01">sqinms_m01</MenuItem>
          <MenuItem value="sqinms_m02">sqinms_m02</MenuItem>
        </Select>
      </FormControl>
      <Typography variant="body1" sx={{ mt: 2 }}>
        선택된 서버: {selectedServer}
      </Typography>
    </div>
  )
}
