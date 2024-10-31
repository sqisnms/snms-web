"use client"

import { signUp } from "@/actions/account-actions"
import { Button } from "@/components/common/button"
import {
  AtSymbolIcon,
  ExclamationCircleIcon,
  KeyIcon,
  UserIcon,
  // UserPlusIcon,
} from "@heroicons/react/24/outline"
import { useEffect, useState } from "react"
import { useFormState, useFormStatus } from "react-dom"

function SignUpButton() {
  const { pending } = useFormStatus()
  return (
    <Button
      className="mt-10 h-12 w-full justify-center rounded-lg bg-primary text-center text-base font-normal shadow-none hover:bg-primary-dark hover:shadow-none"
      aria-disabled={pending}
    >
      회원가입
      {/* <UserPlusIcon className="ml-auto h-5 w-5 text-gray-50" /> */}
    </Button>
  )
}

export default function SignUpForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordError, setPasswordError] = useState("")

  const [errorMessage, dispatch] = useFormState(signUp, undefined)

  useEffect(() => {
    // 비밀번호와 확인 비밀번호가 동일한지 확인
    if (password !== confirmPassword && confirmPassword !== "") {
      setPasswordError("Passwords do not match.")
    } else {
      setPasswordError("")
    }
  }, [password, confirmPassword])

  return (
    <form action={dispatch}>
      <div className="w-full">
        {/* Name Input */}
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-gray-700" htmlFor="name">
            이름
          </label>
          <div className="relative">
            <input
              className="w-full rounded-lg border-none p-3 pl-10 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
              id="name"
              type="text"
              name="name"
              placeholder="Enter your name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
          </div>
        </div>
        {/* Email Input */}
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-gray-700" htmlFor="email">
            이메일
          </label>
          <div className="relative">
            <input
              className="w-full rounded-lg border-none p-3 pl-10 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
              id="email"
              type="email"
              name="email"
              placeholder="Enter your email address"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
          </div>
        </div>

        {/* Password Input */}
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-gray-700" htmlFor="password">
            암호
          </label>
          <div className="relative">
            <input
              className="w-full rounded-lg border-none p-3 pl-10 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
              id="password"
              type="password"
              name="password"
              placeholder="Enter password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
          </div>
        </div>

        {/* Confirm Password Input */}
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-gray-700" htmlFor="confirmPassword">
            암호 확인
          </label>
          <div className="relative">
            <input
              className="w-full rounded-lg border-none p-3 pl-10 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              placeholder="Confirm password"
              required
              minLength={6}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
          </div>
        </div>
        {passwordError && <div className="mt-2 text-sm text-red-500">{passwordError}</div>}
      </div>
      <SignUpButton />
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
