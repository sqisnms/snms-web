import LoginForm from "@/components/account/login-form"
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
    redirect(searchParams?.callbackUrl ?? "/system/resource")
  }

  return (
    <Box className="h-screen bg-cover bg-center" sx={{ backgroundImage: "url('/login_bg.png')" }}>
      <Box className="flex h-full px-20">
        <Box className="flex hidden w-1/2 items-center justify-center md:flex">
          <Image src="/logo_w.png" alt="로고" width={160} height={80} className="h-12" />
        </Box>

        <Box className="flex w-full items-center justify-center p-8 md:w-1/2">
          <Box className="w-full max-w-md rounded-lg bg-white bg-opacity-90 px-10 py-12 shadow-lg">
            <Box className="mb-6 flex justify-center">
              <Image src="/logo.png" alt="로고" width={130} height={40} className="h-10" />
            </Box>

            <p className="mb-8·text-center·text-primary">S·NMS를 이용하기 위해 로그인 해주세요.</p>

            <Suspense fallback={<div>Loading...</div>}>
              <LoginForm />
            </Suspense>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
