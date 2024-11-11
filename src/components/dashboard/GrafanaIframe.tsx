import { useContextPath } from "@/config/Providers"
import { useCallback, useEffect, useRef } from "react"

interface GrafanaIframeProps {
  src: string
  selected: string
  title: string
}

export function GrafanaIframe({ src, selected, title }: GrafanaIframeProps) {
  const contextPath = useContextPath()
  const iframeRef = useRef<HTMLIFrameElement | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const adjustHeight = useCallback(() => {
    const iframe = iframeRef.current
    if (iframe) {
      try {
        const doc = iframe.contentWindow?.document
        if (doc?.readyState === "complete") {
          const targetDiv = doc.querySelector(".react-grid-layout")
          if (targetDiv) {
            const divHeight = targetDiv.getBoundingClientRect().height
            iframe.style.height = `${divHeight + 32 + 32 + 16 + 8}px`
          } else {
            console.warn("Target div not found")
          }
        }
      } catch (error) {
        console.error("Error accessing iframe content:", error)
      }
    }
  }, [])

  useEffect(() => {
    const iframe = iframeRef.current
    if (iframe) {
      adjustHeight()

      intervalRef.current = setInterval(adjustHeight, 1000)

      iframe.onload = adjustHeight

      window.addEventListener("resize", adjustHeight)
    }

    return () => {
      window.removeEventListener("resize", adjustHeight)
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [adjustHeight, selected])

  return (
    <iframe
      ref={iframeRef}
      width="100%"
      height="750"
      title={title}
      src={`${contextPath}${src}${selected}`}
      // src={`${contextPath}/grafana/d/ae0ijnes4j7cwe/snms-server-resource?orgId=1&refresh=auto&kiosk${selected}`}
      /// grafana/d/ae0yw793f2800a/new-dashboard?orgId=1&from=1729567451243&to=1729589051243&refresh=auto&kiosk
      // grafana/d/ae0ijnes4j7cwe/server-resource?orgId=1&kiosk${selected}
      // &var-server_id=sqinms_m01&var-server_id=sqinms_m03
    />
  )
}
