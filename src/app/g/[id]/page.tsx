"use client"

import { grafanaServerProcessParamAtom } from "@/atom/dashboardAtom"
import { GrafanaIframe } from "@/components/dashboard/GrafanaIframe"
import { useAtom } from "jotai"
import { useParams } from "next/navigation"

export default function Page() {
  const [selected] = useAtom(grafanaServerProcessParamAtom)
  const params = useParams() // URL의 동적 파라미터 가져오기

  const { id } = params as { id: string }

  const src = `/grafana/d/${id}?kiosk`
  return <GrafanaIframe src={src} selected={selected} title={id ?? ""} />
}
