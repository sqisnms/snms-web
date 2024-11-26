"use client"

import { MiniBoard } from "@/components/main/MiniBoard"
import { Box, Grid, Typography } from "@mui/material"
import Image from "next/image"

// 함수 선언 방식으로 컴포넌트 정의
function DashboardLayout() {
  return (
    <div className="flex h-screen flex-col">
      {/* Banner */}
      <Box className="min-h-screen dark:bg-black dark:text-white">
        <Box
          className="relative h-80 bg-cover bg-center"
          style={{ backgroundImage: "url('/login_bg.png')" }}
        >
          <Box className="absolute inset-0 flex flex-col items-center justify-center px-6 pb-2 text-center text-white">
            <Image src="/logo_w.png" width="130" height="40" alt="로고" className="h-10" />
            <hr className="mx-auto my-4 w-14 border-t-2 border-gray-300 opacity-60" />
            <Typography
              variant="h4"
              // className={`${notoSansKR.className} mb-2 break-keep font-semibold`}
              sx={{
                marginBottom: "0.5rem",
                wordBreak: "keep-all",
                fontWeight: 600,
                fontFamily: "Noto Sans KR",
              }}
            >
              미래의 연결, 혁신의 시작
            </Typography>
            <Typography
              variant="body1"
              // className={`${notoSansKR.className} break-keep`}
              sx={{
                wordBreak: "keep-all",
                fontFamily: "Noto Sans KR",
              }}
            >
              첨단 기술로 변화하는 도시와 산업의 동반자, S·NMS가 함께합니다.
            </Typography>
          </Box>
        </Box>

        {/* Main Content */}
        <Grid
          container
          spacing={2}
          // className="!m-0 w-full px-6 py-8"
          sx={{
            margin: 0,
            width: "100%",
            paddingX: { xs: "0.5rem", md: "0.5rem" }, // 좌우 패딩 균등
            paddingY: { xs: "0.5rem", md: "0.5rem" }, // 상하 패딩 균등
          }}
        >
          <Grid
            item
            xs={12}
            md={4}
            // className="border-b border-gray-300 !px-1 !pt-1 pb-6 dark:border-gray-500 md:border-b-0 md:border-r md:!pb-2 md:!pr-6"
            sx={{
              borderBottom: { xs: "1px solid rgb(209, 213, 219)", md: "none" }, // 좁은 화면에서는 하단 경계선, 넓은 화면에서는 없음
              borderRight: { md: "1px solid rgb(209, 213, 219)" }, // 넓은 화면에서만 오른쪽 경계선
              paddingX: { xs: "0.5rem", md: "1rem" }, // 좌우 패딩 균등
              paddingTop: { xs: "0.5rem", md: "1rem" }, // 상하 패딩 균등
              paddingBottom: { xs: "1rem", md: "1rem" }, // 상하 패딩 균등
            }}
          >
            <MiniBoard section="NOTICE" label="공지사항" />
          </Grid>

          <Grid
            item
            xs={12}
            md={4}
            // className="border-b border-gray-300 !px-1 !pb-6 !pt-4 dark:border-gray-500 md:border-b-0 md:border-r md:!px-6 md:!pb-2 md:!pt-1"
            sx={{
              borderBottom: { xs: "1px solid rgb(209, 213, 219)", md: "none" },
              borderRight: { md: "1px solid rgb(209, 213, 219)" },
              paddingX: { xs: "0.5rem", md: "1rem" },
              paddingTop: { xs: "0.5rem", md: "1rem" }, // 상하 패딩 균등
              paddingBottom: { xs: "1rem", md: "1rem" }, // 상하 패딩 균등
            }}
          >
            <MiniBoard section="MANUAL" label="매뉴얼(SOP)" />
          </Grid>

          <Grid
            item
            xs={12}
            md={4}
            // className="!px-1 !pb-6 !pt-4 md:!pb-2 md:!pl-6 md:!pt-1"
            sx={{
              paddingX: { xs: "0.5rem", md: "1rem" },
              paddingY: { xs: "0.5rem", md: "1rem" },
            }}
          >
            <MiniBoard section="TASK" label="작업계획" />
          </Grid>
        </Grid>

        {/* <Box className="flex flex-col bg-gray-100 px-6 py-8 md:flex-row">
          <Typography variant="h6" className="w-full font-bold md:w-24">
            자료실
          </Typography>
          <ul className="mt-3 flex w-full space-x-4 md:mt-0">
            <li className="flex w-1/5 cursor-pointer items-center justify-between space-x-2 hover:text-primary">
              <span>[매뉴얼] [중요][신규] 5G NMS 개발요청 등록가이드</span>
              <FileDownloadIcon className="text-gray-500 hover:text-primary" />
            </li>
            <li className="flex w-1/5 cursor-pointer items-center justify-between space-x-2 hover:text-primary">
              <span>[매뉴얼] 감시화면 편집 가이드라인</span>
              <FileDownloadIcon className="text-gray-500 hover:text-primary" />
            </li>
            <li className="flex w-1/5 cursor-pointer items-center justify-between space-x-2 hover:text-primary">
              <span>[SW설치] 5G NMS PC Client 설치파일</span>
              <FileDownloadIcon className="text-gray-500 hover:text-primary" />
            </li>
          </ul>
        </Box> */}

        <Box className="flex flex-col bg-gray-100 px-6 py-8 dark:bg-gray-900 md:flex-row">
          <Typography
            variant="h6"
            // className="w-full font-bold md:w-1/12"
            sx={{
              width: "100%",
              fontWeight: 700,
              "@media (min-width:900px)": {
                width: "8.333333%",
              },
            }}
          >
            FAQ
          </Typography>
          <ul className="mt-6 flex w-full flex-col space-y-6 md:mt-0 md:w-11/12 md:flex-row md:space-x-4 md:space-y-0">
            <li className="w-full cursor-pointer hover:text-primary md:w-1/3">
              <Box className="flex items-center space-x-2">
                <Typography className="h-6 min-w-8 max-w-8 rounded-md bg-gray-600 text-center font-medium text-white">
                  Q
                </Typography>
                <span className="truncate text-gray-800 hover:text-primary dark:text-white">
                  5G NMS 활용, 무선망 코어 & 엑세스 스위치 감시 체계 관련 문의 드립니다.
                </span>
              </Box>
              <Box className="mt-2 flex items-center space-x-2">
                <Typography className="h-6 min-w-8 max-w-8 rounded-md bg-red-500 text-center font-medium text-white">
                  A
                </Typography>
                <span className="truncate text-gray-800 hover:text-primary dark:text-white">
                  5G NMS 활용, 무선망 코어 & 엑세스 스위치 감시 체계 관련 안내입니다.
                </span>
              </Box>
            </li>
            <li className="w-full cursor-pointer hover:text-primary md:w-1/3">
              <Box className="flex items-center space-x-2">
                <Typography className="h-6 min-w-8 max-w-8 rounded-md bg-gray-600 text-center font-medium text-white">
                  Q
                </Typography>
                <span className="truncate text-gray-800 hover:text-primary dark:text-white">
                  무선 VOC 응대시스템 권한신청 매뉴얼 장애 해결을 위한 질문입니다.
                </span>
              </Box>
              <Box className="mt-2 flex items-center space-x-2">
                <Typography className="h-6 min-w-8 max-w-8 rounded-md bg-red-500 text-center font-medium text-white">
                  A
                </Typography>
                <span className="truncate text-gray-800 hover:text-primary dark:text-white">
                  무선 VOC 응대시스템 권한신청 매뉴얼 장애 해결을 위한 조치 방법입니다.
                </span>
              </Box>
            </li>
            <li className="w-full cursor-pointer hover:text-primary md:w-1/3">
              <Box className="flex items-center space-x-2">
                <Typography className="h-6 min-w-8 max-w-8 rounded-md bg-gray-600 text-center font-medium text-white">
                  Q
                </Typography>
                <span className="truncate text-gray-800 hover:text-primary dark:text-white">
                  무선 VOC 응대시스템 권한신청 매뉴얼 장애 해결을 위한 질문입니다.
                </span>
              </Box>
              <Box className="mt-2 flex items-center space-x-2">
                <Typography className="h-6 min-w-8 max-w-8 rounded-md bg-red-500 text-center font-medium text-white">
                  A
                </Typography>
                <span className="truncate text-gray-800 hover:text-primary dark:text-white">
                  무선 VOC 응대시스템 권한신청 매뉴얼 장애 해결을 위한 조치 방법입니다.
                </span>
              </Box>
            </li>
          </ul>
        </Box>

        {/* Q&A */}
        <Box className="flex flex-col px-6 py-8 dark:bg-black dark:text-white md:flex-row">
          <Typography
            variant="h6"
            // className="w-full font-bold md:w-1/12"
            sx={{
              width: "100%",
              fontWeight: 700,
              "@media (min-width:900px)": {
                width: "8.333333%",
              },
            }}
          >
            Q&A
          </Typography>
          <ul className="mt-6 flex w-full flex-col space-y-6 md:mt-0 md:w-11/12 md:flex-row md:space-x-4 md:space-y-0">
            <li className="w-full cursor-pointer hover:text-primary md:w-1/3">
              <Box className="flex items-center space-x-2">
                <Typography className="h-6 min-w-8 max-w-8 rounded-md bg-gray-600 text-center font-medium text-white">
                  Q
                </Typography>
                <span className="truncate text-gray-800 hover:text-primary dark:text-white">
                  안녕하세요? 2024년 9월 4일 특정국소의 전기정보관리 입력 관련 문의입니다.
                </span>
              </Box>
              <Box className="mt-2 flex items-center space-x-2">
                <Typography className="h-6 min-w-8 max-w-8 rounded-md bg-red-500 text-center font-medium text-white">
                  A
                </Typography>
                <span className="truncate text-gray-800 hover:text-primary dark:text-white">
                  답변 준비 중 입니다.
                </span>
              </Box>
            </li>
            <li className="w-full cursor-pointer hover:text-primary md:w-1/3">
              <Box className="flex items-center space-x-2">
                <Typography className="h-6 min-w-8 max-w-8 rounded-md bg-gray-600 text-center font-medium text-white">
                  Q
                </Typography>
                <span className="truncate text-gray-800 hover:text-primary dark:text-white">
                  안녕하세요? 2024년 9월 4일 특정국소의 전기정보관리 입력 관련 문의입니다.
                </span>
              </Box>
              <Box className="mt-2 flex items-center space-x-2">
                <Typography className="h-6 min-w-8 max-w-8 rounded-md bg-red-500 text-center font-medium text-white">
                  A
                </Typography>
                <span className="truncate text-gray-800 hover:text-primary dark:text-white">
                  실제로 WCDMA 품질 보고가 누락되어 발생한 정상 장애입니다.
                </span>
              </Box>
            </li>
            <li className="w-full cursor-pointer hover:text-primary md:w-1/3">
              <Box className="flex items-center space-x-2">
                <Typography className="h-6 min-w-8 max-w-8 rounded-md bg-gray-600 text-center font-medium text-white">
                  Q
                </Typography>
                <span className="truncate text-gray-800 hover:text-primary dark:text-white">
                  안녕하세요? 2024년 9월 4일 특정국소의 전기정보관리 입력 관련 문의입니다.
                </span>
              </Box>
              <Box className="mt-2 flex items-center space-x-2">
                <Typography className="h-6 min-w-8 max-w-8 rounded-md bg-red-500 text-center font-medium text-white">
                  A
                </Typography>
                <span className="truncate text-gray-800 hover:text-primary dark:text-white">
                  실제로 WCDMA 품질 보고가 누락되어 발생한 정상 장애입니다.
                </span>
              </Box>
            </li>
          </ul>
        </Box>
      </Box>
    </div>
  )
}

export default DashboardLayout
