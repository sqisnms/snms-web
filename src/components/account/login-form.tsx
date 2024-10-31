"use client"

import { authenticate } from "@/actions/account-actions"
import { ExclamationCircleIcon } from "@heroicons/react/24/outline"
import { Button } from "@mui/material"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useFormState, useFormStatus } from "react-dom"

function LoginButton() {
  const { pending } = useFormStatus()

  return (
    // <Button className="mt-4 w-full" aria-disabled={pending}>
    //   로그인 <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
    // </Button>
    <Button
      aria-disabled={pending}
      type="submit"
      variant="contained"
      fullWidth
      className="mt-6·h-12·rounded-lg·bg-primary·text-base·font-normal·shadow-none·hover:bg-primary-dark"
    >
      로그인
    </Button>
  )
}

export default function LoginForm() {
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
