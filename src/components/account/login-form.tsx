"use client"

import { authenticate } from "@/actions/account-actions"
import { ExclamationCircleIcon } from "@heroicons/react/24/outline"
import { Box, Button, Tab, Tabs } from "@mui/material"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useFormState, useFormStatus } from "react-dom"
import QRLogin from "./qrLogin"

function LoginButton() {
  const { pending } = useFormStatus()

  return (
    <Button
      aria-disabled={pending}
      type="submit"
      variant="contained"
      fullWidth
      className="btn btn_login !mt-6 !h-12 !rounded-lg !bg-primary !text-base !font-normal !shadow-none hover:!bg-primary-dark"
    >
      로그인
    </Button>
  )
}

function JoinButton() {
  return (
    <Button
      variant="contained"
      fullWidth
      className="btn btn_join mt-4 h-12 !rounded-lg bg-white !text-base !font-normal text-primary !shadow-none hover:text-primary-dark"
    >
      회원가입
    </Button>
  )
}

function FormLogin() {
  const [email, setEmail] = useState("")
  const [errorMessage, dispatch] = useFormState(authenticate, undefined)

  const searchParams = useSearchParams()
  const signup = searchParams?.get("signup") ?? ""
  const signupEmail = searchParams?.get("email") ?? ""

  // 쿼리 파라미터에서 이메일 값을 받아와서 상태를 설정합니다.
  useEffect(() => {
    if (signup === "success" && signupEmail) {
      setEmail(signupEmail)
    }
  }, [signup, signupEmail])

  return (
    <form action={dispatch}>
      <div className="mb-4">
        <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
          이메일
        </label>
        <input
          type="email"
          id="email"
          name="email"
          className="w-full rounded-lg border-none p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="이메일"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-700">
          비밀번호
        </label>
        <input
          type="password"
          id="password"
          name="password"
          className="w-full rounded-lg border-none p-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="비밀번호"
          required
          minLength={6}
        />
      </div>
      <LoginButton />
      <JoinButton />
      <div className="flex h-8 items-end space-x-1" aria-live="polite" aria-atomic="true">
        {errorMessage && (
          <>
            <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
            <p className="text-sm text-red-500">{errorMessage}</p>
          </>
        )}
      </div>
    </form>
  )
}

export default function LoginForm() {
  const [activeTab, setActiveTab] = useState(0)

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
  }

  return (
    <Box className="mx-auto w-full max-w-md">
      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: "divider" }} className="mb-6">
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="login tabs"
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab className="flex-1 text-base" label="이메일 로그인" />
          <Tab className="flex-1 text-base" label="QR 로그인" />
        </Tabs>
      </Box>

      {/* Tab Panels */}
      <Box>
        {activeTab === 0 && (
          <Box>
            <FormLogin />
          </Box>
        )}
        {activeTab === 1 && (
          <Box>
            <QRLogin />
          </Box>
        )}
      </Box>
    </Box>
  )
}
