"use client"

import { grafanaServerProcessParamAtom } from "@/atom/dashboardAtom"
import { GrafanaIframe } from "@/components/dashboard/GrafanaIframe"
import { useAtom } from "jotai"

export default function Page() {
  const [selected] = useAtom(grafanaServerProcessParamAtom)
  return (
    <>
      {/* <div style={{ width: 50, height: 20 }} /> */}
      {/* <ProcessOption /> */}
      {/* <div style={{ width: 50, height: 20 }} /> */}
      <GrafanaIframe
        src="/grafana/playlists/play/ce3l4rhdkh5vke?kiosk" // &autofitpanels=true 이 옵션 주면 화면이 줄어들면서 차트가 안보이는 상황 발생
        selected={selected}
        title="대시보드"
      />
    </>
  )
}
