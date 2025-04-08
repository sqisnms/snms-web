"use client"

import { grafanaServerProcessParamAtom } from "@/atom/dashboardAtom"
import { SupersetIframe } from "@/components/dashboard/SupersetIframe"
import { useAtom } from "jotai"
import { useParams } from "next/navigation"

export default function Page() {
  const [selected] = useAtom(grafanaServerProcessParamAtom)
  const params = useParams() // URL의 동적 파라미터 가져오기

  const { path } = params as { path: string[] }

  const src = `/superset/${path.join("/")}/?standalone=true`
  return <SupersetIframe src={src} selected={selected} title={path.join("/") ?? ""} />
}
