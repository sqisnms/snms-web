import { getCode } from "@/actions/common-actions"
import { grafanaServerProcessParamAtom } from "@/atom/dashboardAtom"
import { CommonCode } from "@/types/commonCode"
import { Box } from "@mui/material"
import { useAtom } from "jotai"
import { useEffect, useState } from "react"
import MultiSelectBox from "../common/MultiSelectBox"

export function ProcessOption() {
  const [, setSelected] = useAtom(grafanaServerProcessParamAtom)
  const [selectedServers, setSelectedServers] = useState<string[]>([])
  const [codeSysPrcSvr, setCodeSysPrcSvr] = useState<Partial<CommonCode>[]>([])
  const [selectedProcesses, setSelectedProcesses] = useState<string[]>([])
  const [codeSysPrcPrc, setCodeSysPrcPrc] = useState<Partial<CommonCode>[]>([])

  useEffect(() => {
    getCode({ category: "SYS_PRC_SVR" })
      .then((data) => {
        setCodeSysPrcSvr(data)
        if (data.length > 0) {
          setSelectedServers([data[0].code ?? "All"])
        }
      })
      .catch((error) => {
        console.error("서버 옵션을 불러오는 데 실패했습니다:", error)
      })
    getCode({ category: "SYS_PRC_PRC" })
      .then((data) => {
        setCodeSysPrcPrc(data)
        if (data.length > 0) {
          setSelectedProcesses([data[0].code ?? "All"])
        }
      })
      .catch((error) => {
        console.error("서버 옵션을 불러오는 데 실패했습니다:", error)
      })
  }, [])

  useEffect(() => {
    const serverParams = selectedServers.map((server) => `&var-server_id=${server}`).join("")
    const processParams = selectedProcesses.map((server) => `&var-process_name=${server}`).join("")
    setSelected(serverParams + processParams)
  }, [selectedServers, selectedProcesses, setSelected])

  return (
    <Box sx={{ display: "flex", gap: 2 }}>
      <Box sx={{ width: 300 }}>
        <MultiSelectBox
          label="서버"
          options={codeSysPrcSvr}
          selectedItems={selectedServers}
          setSelectedItems={setSelectedServers}
          allOptionCode="All"
        />
      </Box>
      <Box sx={{ width: 300 }}>
        <MultiSelectBox
          label="프로세스"
          options={codeSysPrcPrc}
          selectedItems={selectedProcesses}
          setSelectedItems={setSelectedProcesses}
          allOptionCode="All"
        />
      </Box>
    </Box>
  )
}
