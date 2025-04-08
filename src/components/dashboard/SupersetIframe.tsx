import { grafanaThemeAtom } from "@/atom/dashboardAtom"
import { useContextPath } from "@/config/Providers"
import { Box } from "@mui/material"
import { useAtom } from "jotai"
import { useEffect, useRef, useState } from "react"

interface SupersetIframeProps {
  src: string
  selected: string
  title: string
}

export function SupersetIframe({ src, selected, title }: SupersetIframeProps) {
  const contextPath = useContextPath()
  const iframeRef = useRef<HTMLIFrameElement | null>(null)
  const [theme] = useAtom(grafanaThemeAtom)
  const [loaded, setLoaded] = useState(false)

  // height 자동조정 스크립트. 11버전으로 가면서(autofitheight) 필요없어짐.

  // const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // const adjustHeight = useCallback(() => {
  //   const iframe = iframeRef.current
  //   if (iframe) {
  //     try {
  //       const doc = iframe.contentWindow?.document
  //       if (doc?.readyState === "complete") {
  //         const targetDiv = doc.querySelector(".react-grid-layout")
  //         if (targetDiv) {
  //           const divHeight = targetDiv.getBoundingClientRect().height
  //           iframe.style.height = `${divHeight + 32 + 32 + 16 + 8}px`
  //         } else {
  //           console.warn("Target div not found")
  //         }
  //       }
  //     } catch (error) {
  //       console.error("Error accessing iframe content:", error)
  //     }
  //   }
  // }, [])

  // useEffect(() => {
  //   const iframe = iframeRef.current
  //   if (iframe) {
  //     adjustHeight()

  //     intervalRef.current = setInterval(adjustHeight, 1000)

  //     iframe.onload = adjustHeight

  //     window.addEventListener("resize", adjustHeight)
  //   }

  //   return () => {
  //     window.removeEventListener("resize", adjustHeight)
  //     if (intervalRef.current) clearInterval(intervalRef.current)
  //   }
  // }, [adjustHeight, selected])

  useEffect(() => {
    setLoaded(true)
  }, [])

  if (!loaded) {
    return (
      <Box
        sx={{
          width: "100%",
          height: "750px", // iframe과 동일한 높이
          backgroundColor: "transparent", // 배경 투명
        }}
      />
    )
  }

  return (
    <iframe
      ref={iframeRef}
      width="100%"
      height="750"
      title={title}
      src={`${contextPath}${src}${selected}&theme=${theme}`}
      // src={`${contextPath}/grafana/d/ae0ijnes4j7cwe/snms-server-resource?orgId=1&refresh=auto&kiosk${selected}`}
      /// grafana/d/ae0yw793f2800a/new-dashboard?orgId=1&from=1729567451243&to=1729589051243&refresh=auto&kiosk
      // grafana/d/ae0ijnes4j7cwe/server-resource?orgId=1&kiosk${selected}
      // &var-server_id=sqinms_m01&var-server_id=sqinms_m03
    />
  )
}
