"use client"

import { createTheme, ThemeProvider } from "@mui/material/styles"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { SessionProvider } from "next-auth/react"
import { createContext, useContext, useState } from "react"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.min.css"

// context path 설정
const ContextPathContext = createContext<string>("")

export const useContextPath = () => {
  return useContext(ContextPathContext)
}
//

// toast 설정
export function ToastProvider() {
  return <ToastContainer autoClose={3000} position="top-center" />
}
//

export default function Providers({ children }: { children: React.ReactNode }) {
  // react query 설정
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5000, // 5초 이내에 동일 쿼리 실행 시 캐시에서 반환
            gcTime: 300000, // 300초 이후 캐시 삭제
            retry: 3, // 3번 재시도
            refetchOnWindowFocus: false, // 윈도우가 다시 포커스 되었을 때 데이터를 refetch
            refetchOnMount: false, // 데이터가 stale 상태이면 컴포넌트가 마운트 될 때 refetch
            // refetchInterval: 5000, // 5초마다 쿼리 재실행 > 이 옵션은 필요한 곳에만 사용
          },
        },
      }),
  )
  //

  // MUI 버튼 자동대문자 변환 방지
  const theme = createTheme({
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
          },
        },
      },
    },
  })
  //

  // context path 설정
  const contextPath = process.env.NEXT_PUBLIC_CONTEXT_PATH || ""
  //

  // QueryClientProvider : react query
  // ContextPathContext.Provider : context path
  // SessionProvider : next auth 에서 화면/서버단 사용자 정보 확인
  // ToastProvider : toast 알림
  // ThemeProvider : mui 버튼에서 자동 대문자변환 방지
  // ReactQueryDevtools: react query 개발도구
  return (
    <QueryClientProvider client={queryClient}>
      <ContextPathContext.Provider value={contextPath}>
        <SessionProvider>
          <ToastProvider />
          <ThemeProvider theme={theme}>{children}</ThemeProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </SessionProvider>
      </ContextPathContext.Provider>
    </QueryClientProvider>
  )
}
