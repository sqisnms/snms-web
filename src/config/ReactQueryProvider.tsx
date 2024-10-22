"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { useState } from "react"

export default function ReactQueryProvider({ children }: { children: React.ReactNode }) {
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

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
