"use client"

import { grafanaServerProcessParamAtom } from "@/atom/dashboardAtom"
import { GrafanaIframe } from "@/components/dashboard/GrafanaIframe"
import { SystemMonitorServerTable } from "@/components/system/SystemMonitorServerTable"
import { useAtom } from "jotai"
import { useEffect, useState } from "react"

export default function Page() {
  const [selected, setSelected] = useAtom(grafanaServerProcessParamAtom)
  const [selectedCode, setSelectedCode] = useState<string>("")

  useEffect(() => {
    setSelected(`&var-server_id=${selectedCode}`)
  }, [selectedCode, setSelected])

  return (
    <>
      {/* <div style={{ width: 50, height: 20 }} /> */}
      {/* <ProcessOption /> */}
      {/* <div style={{ width: 50, height: 20 }} /> */}
      <SystemMonitorServerTable selectedCode={selectedCode} setSelectedCode={setSelectedCode} />
      <GrafanaIframe
        src="/grafana/d/ae0ijnes4j7cwe?kiosk"
        selected={selected}
        title="서버모니터링"
      />
    </>
  )
}
