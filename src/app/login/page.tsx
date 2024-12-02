import LoginForm from "@/components/account/login-form"
import { LOGIN_DEFAULT_PAGE } from "@/config/const"
import { Box } from "@mui/material"
import { auth } from "auth"
import Image from "next/image"
import { redirect } from "next/navigation"
import { Suspense } from "react"

export default async function Login({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined }
}) {
  const session = await auth()
  if (session) {
    redirect(searchParams?.callbackUrl ?? LOGIN_DEFAULT_PAGE)
  }

  return (
    <Box className="h-screen bg-cover bg-center" sx={{ backgroundImage: "url('/login_bg.png')" }}>
      <Box className="flex h-full px-10 md:px-20">
        <Box className="hidden w-1/2 items-center justify-center lg:flex">
          <Image src="/logo_w.png" alt="로고" width={160} height={80} className="h-12" />
        </Box>

        <Box className="flex w-full items-center justify-center p-0 md:p-8 lg:w-1/2">
          <Box className="login_box_wrap w-full max-w-md rounded-lg bg-white bg-opacity-90 px-10 py-12 shadow-lg">
            <Box className="mb-6 flex justify-center">
              <Image src="/logo.png" alt="로고" width={130} height={40} className="h-10" />
            </Box>

            <p className="mb-8 break-words text-center text-primary">
              S·NMS를 이용하기 위해 로그인 해주세요.
            </p>

            <Suspense fallback={<div>Loading...</div>}>
              <LoginForm />
            </Suspense>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
