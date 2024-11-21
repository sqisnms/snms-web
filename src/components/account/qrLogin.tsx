import { checkQrLogin } from "@/actions/account-actions"
import { Box, Button, CircularProgress } from "@mui/material"
import { useQuery } from "@tanstack/react-query"
import { signIn } from "next-auth/react"
import Image from "next/image"
import { useEffect, useState } from "react"

export default function QRLogin() {
  const [qrUrl, setQrUrl] = useState<string | null>(null) // 서버에서 받은 QR 이미지 URL
  const [qrSessionID, setQrSessionID] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true) // 로딩 상태 관리
  const [error, setError] = useState<string | null>(null) // 에러 상태 관리
  const [isLoginSuccessful, setIsLoginSuccessful] = useState(false)

  const pollingQrLogin = async () => {
    const res = await checkQrLogin({
      qrSessionID: qrSessionID ?? "",
      baseUrl: window.location.href,
    })
    if (res.code === "0000") {
      setIsLoginSuccessful(true)
      signIn("credentials", { qrInfo: res.data })
    }
    return []
  }

  useQuery({
    queryKey: ["qrlogin", qrSessionID], // 캐시 키
    queryFn: () => pollingQrLogin(),
    enabled: !!qrSessionID,
    refetchInterval: isLoginSuccessful ? false : 1000,
  })

  // 서버에서 QR 코드를 가져오는 함수
  const fetchQrCode = async () => {
    setLoading(true)
    setError(null)

    try {
      // 실제로는 여기에 인증 서버의 API를 호출하여 QR 코드를 받아옵니다.
      const response = await fetch("/qrScan/genSession", { method: "POST" })
      if (!response.ok) throw new Error("QR 코드를 가져오는데 실패했습니다.")

      const data = await response.json()
      setQrUrl(data.data.qrCode) // 서버에서 받은 QR 코드 URL 설정
      setQrSessionID(data.data.sessionID) // 세션 ID
    } catch (err) {
      setError("QR 코드를 불러오는 중 오류가 발생했습니다.")
    } finally {
      setLoading(false)
    }
  }

  // 컴포넌트가 마운트될 때 QR 코드를 가져옵니다.
  useEffect(() => {
    fetchQrCode()
  }, [])

  return (
    <Box className="mt-4 flex flex-col items-center">
      {/* 로딩 중일 때 */}
      {loading && <CircularProgress />}

      {/* 에러 발생 시 */}
      {error && <p className="text-red-500">{error}</p>}

      {/* QR 코드 이미지 */}
      {qrUrl && !loading && <Image src={qrUrl} alt="QR 코드" width={200} height={200} />}

      {/* QR 코드 갱신 버튼 (선택 사항) */}
      <Button variant="outlined" onClick={fetchQrCode} className="mt-6">
        새로고침
      </Button>
    </Box>
  )
}
