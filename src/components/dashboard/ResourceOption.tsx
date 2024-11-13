import { getCode } from "@/actions/common-actions"
import { grafanaServerResourceParamAtom } from "@/atom/dashboardAtom"
import { CommonCode } from "@/types/commonCode"
import { Box } from "@mui/material"
import { useAtom } from "jotai"
import { useEffect, useState } from "react"
import MultiSelectBox from "../common/MultiSelectBox"

export function ResourceOption() {
  const [, setSelected] = useAtom(grafanaServerResourceParamAtom)
  const [selectedServers, setSelectedServers] = useState<string[]>([])
  const [codeSysResSvr, setCodeSysResSvr] = useState<Partial<CommonCode>[]>([])

  useEffect(() => {
    getCode({ category: "SYS_RES_SVR" })
      .then((data) => {
        setCodeSysResSvr(data)
        if (data.length > 0) {
          setSelectedServers([data[0].code ?? "All"])
        }
      })
      .catch((error) => {
        console.error("서버 옵션을 불러오는 데 실패했습니다:", error)
      })
  }, [])

  useEffect(() => {
    const serverParams = selectedServers.map((server) => `&var-server_id=${server}`).join("")
    setSelected(serverParams)
  }, [selectedServers, setSelected])

  return (
    <Box sx={{ width: 300 }}>
      <MultiSelectBox
        label="서버"
        options={codeSysResSvr}
        selectedItems={selectedServers}
        setSelectedItems={setSelectedServers}
        allOptionCode="All"
      />
    </Box>
  )
}
