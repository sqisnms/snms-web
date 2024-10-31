"use client"

import React, { useState } from "react"
import { Button, Box } from "@mui/material"
import Image from "next/image"

function Login() {
  const [email] = useState("")
  const [password] = useState("")

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    console.log("Email:", email, "Password:", password)
  }

  return (
    <Box className="h-screen bg-cover bg-center" sx={{ backgroundImage: "url('/login_bg.png')" }}>
      <Box className="flex h-full px-20">
        <Box className="flex hidden w-1/2 items-center justify-center md:flex">
          <Image src="/logo_w.png" alt="로고" width="160" height="80" className="h-12" />
        </Box>

        <Box className="flex w-full items-center justify-center p-8 md:w-1/2">
          <Box className="w-full max-w-md rounded-lg bg-white bg-opacity-90 px-10 py-12 shadow-lg">
            <Box className="mb-6 flex justify-center">
              <Image src="/logo.png" width="130" height="40" alt="로고" className="h-10" />
            </Box>

            <p className="mb-8 text-center text-primary">S·NMS를 이용하기 위해 로그인 해주세요.</p>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
                  이메일
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full rounded-lg border-none p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="이메일"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-700">
                  비밀번호
                </label>
                <input
                  type="password"
                  id="password"
                  className="w-full rounded-lg border-none p-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="비밀번호"
                />
              </div>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                className="mt-6 h-12 rounded-lg bg-primary text-base font-normal shadow-none hover:bg-primary-dark hover:shadow-none"
              >
                로그인
              </Button>
            </form>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default Login
