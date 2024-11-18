"use client"

import { BreadcrumbType } from "@/types/menu"
import { Box, Breadcrumbs, Link, Typography } from "@mui/material"
import { usePathname } from "next/navigation"
import { v4 } from "uuid"

export default function Top({ breadcrumbs }: { breadcrumbs: BreadcrumbType[] }) {
  // 현재 페이지의 URL을 가져옴
  const pathname = usePathname()

  // 현재 URL과 일치하는 breadcrumb 찾기
  const currentBreadcrumb = breadcrumbs.find((breadcrumb) => breadcrumb.url === pathname)

  return (
    <Box display="flex" alignItems="center" justifyContent="space-between" className="mb-3">
      {/* 페이지 제목 */}
      <Typography variant="h5" className="font-semibold text-gray-800 dark:text-white">
        {currentBreadcrumb?.path_names?.[currentBreadcrumb.path_names.length - 1] ||
          "메뉴 미등록 화면"}
      </Typography>

      {/* Breadcrumb 표시 */}
      <Breadcrumbs
        aria-label="breadcrumb"
        className="dark:text-white"
        separator={<span className="text-gray-400 dark:text-gray-500">/</span>}
      >
        <Link href="/main" underline="hover" color="inherit">
          Home
        </Link>
        {currentBreadcrumb?.path_names.map((name, index) => (
          <Typography
            key={v4()} // 간단한 컴포넌트라 그냥 v4 씀. 리렌더링 자주 일어나는 곳에서는 이렇게 쓰면 안됨
            className="dark:text-white"
            color={index === currentBreadcrumb.path_names.length - 1 ? "text.primary" : "inherit"}
          >
            {name}
          </Typography>
        ))}
      </Breadcrumbs>
    </Box>
  )
}
