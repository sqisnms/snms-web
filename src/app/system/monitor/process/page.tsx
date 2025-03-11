"use client"

import { grafanaServerProcessParamAtom } from "@/atom/dashboardAtom"
import { GrafanaIframe } from "@/components/dashboard/GrafanaIframe"
import { SystemMonitorProcessTable } from "@/components/system/SystemMonitorProcessTable"
import { useAtom } from "jotai"
import { useEffect, useState } from "react"

export default function Page() {
  const [selected, setSelected] = useAtom(grafanaServerProcessParamAtom)
  const [selectedCode, setSelectedCode] = useState<string>("")

  useEffect(() => {
    setSelected(selectedCode)
  }, [selectedCode, setSelected])

  return (
    <>
      {/* <div style={{ width: 50, height: 20 }} /> */}
      {/* <ProcessOption /> */}
      {/* <div style={{ width: 50, height: 20 }} /> */}
      <SystemMonitorProcessTable selectedCode={selectedCode} setSelectedCode={setSelectedCode} />
      <div style={{ width: 50, height: 20 }} />
      <GrafanaIframe
        src="/grafana/d/be1q2wlewne9sc?kiosk"
        selected={selected}
        title="서버모니터링"
      />
    </>
  )
}
