import SignUpForm from "@/components/account/signup-form"
import { Box } from "@mui/material"
import Image from "next/image"

export default function LoginPage() {
  return (
    <Box className="h-screen bg-cover bg-center" sx={{ backgroundImage: "url('/login_bg.png')" }}>
      <Box className="flex h-full w-full items-center justify-center p-8">
        <Box className="w-full max-w-md rounded-lg bg-white bg-opacity-90 px-10 py-12 shadow-lg">
          <Box className="mb-2 flex justify-center">
            <Image src="/logo.png" width="130" height="40" alt="로고" className="h-10" />
          </Box>
          <h1 className="mb-8 text-center text-2xl font-semibold text-primary">회원가입</h1>
          <SignUpForm />
        </Box>
      </Box>
    </Box>
  )
}
