"use client"

import { UserType } from "@/types/user"
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

// 유저 정보 UserProvider 설정. commonLayout 에서 조회 후 데이터 넣어서 provider 감쌈
// const currentUser = useUser() 이런식으로 사용하면 됨
interface UserContextType {
  currentUser: Partial<UserType> | null
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({
  children,
  value,
}: {
  children: React.ReactNode
  value: UserContextType
}) {
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context.currentUser
}
//

// toast 설정
export function ToastProvider() {
  return <ToastContainer autoClose={3000} position="top-center" />
}
//

export default function Providers({
  children,
  darkLightTheme,
}: {
  children: React.ReactNode
  darkLightTheme: "light" | "dark"
}) {
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

  // MUI
  const theme = createTheme({
    palette: {
      primary: {
        main: "#143896", // Primary 메인 색상
        dark: "#102c78", // Primary 다크 색상
        light: "#234ab1", // Primary 다크 색상
        contrastText: "#ffffff", // Primary 대비 텍스트
      },
      secondary: {
        main: "#4496e5", // Secondary 메인 색상
        dark: "#367bbd", // Secondary 다크 색상
        light: "#5eb6ff", // Secondary 라이트 색상
        contrastText: "#ffffff", // Primary 대비 텍스트
      },
      mode: darkLightTheme,
    },
    components: {
      // 버튼 자동대문자 변환 방지
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
          },
        },
      },
      // TextField label 위치 안맞는 현상 수정
      MuiTextField: {
        defaultProps: {
          slotProps: {
            inputLabel: {
              sx: {
                // 기본 상태에서 레이블 위치 조정
                top: "-7px",
                // shrink 상태일 때 레이블 위치 조정
                "&.MuiInputLabel-shrink": {
                  transform: "translate(15px, -1.5px)", // 위로 살짝 이동
                  fontSize: "0.75rem", // 글자 크기를 줄임
                },
              },
            },
          },
        },
        styleOverrides: {
          root: {
            marginTop: "7px", // 모든 TextField에 상단 마진 적용. shrink 상태의 텍스트가 가려지지 않도록
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
