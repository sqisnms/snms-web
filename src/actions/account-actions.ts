"use server"

import { unstable_noStore as noStore } from "next/cache"
import { z } from "zod"
// eslint-disable-next-line import/no-cycle
import { signIn, signOut } from "auth"
import bcrypt from "bcrypt"
import { AuthError } from "next-auth"
import { v4 as uuidv4 } from "uuid"

import { postgres } from "@/config/db"
import type { User } from "@/types/user"
import AES from "crypto-js/aes"

export async function getUser(email: string): Promise<User | undefined> {
  try {
    const user = await postgres.query<User>("SELECT * FROM users WHERE email=$1", [email])
    return user.rows[0]
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Failed to fetch user:", error)
    throw new Error("Failed to fetch user.")
  }
}

const EmailSchema = z.string().email({ message: "Invalid email address." })
const PasswordSchema = z
  .string()
  .min(6, { message: "Password must be at least 6 characters long." })
const NameSchema = z.string().min(1, { message: "Name cannot be empty." })

export async function signUp(prevState: string | undefined, formData: FormData) {
  // 각 필드 유효성 검사
  const emailValidation = EmailSchema.safeParse(formData.get("email"))
  const passwordValidation = PasswordSchema.safeParse(formData.get("password"))
  const nameValidation = NameSchema.safeParse(formData.get("name"))

  // 유효성 검사 실패 시 에러 메시지 반환
  if (!emailValidation.success) {
    return emailValidation.error.message
  }
  if (!passwordValidation.success) {
    return passwordValidation.error.message
  }
  if (!nameValidation.success) {
    return nameValidation.error.message
  }

  const email = emailValidation.data
  const password = passwordValidation.data
  const name = nameValidation.data
  const authKey = uuidv4()

  try {
    // 이메일 중복 검사
    const existingUser = await postgres.query("SELECT * FROM users WHERE email = $1", [email])
    if (existingUser.rowCount !== null && existingUser.rowCount > 0) {
      return "Email already exists."
    }

    // 비밀번호 해싱 및 사용자 추가
    const hashedPassword = await bcrypt.hash(password, 10)

    const query = `
      INSERT INTO users (name, email, password, auth_key)
      VALUES ($1, $2, $3, $4)
    `

    const values = [name, email, hashedPassword, authKey]

    await postgres.query(query, values)
    return "User successfully created."
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Database error:", error)
    return "Failed to create user."
  }
}

export async function authenticate(prevState: string | undefined, formData: FormData) {
  try {
    await signIn("credentials", formData)
    return "success"
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials."
        default:
          return "Something went wrong."
      }
    }
    throw error
  }
}

export async function deleteUser(email: string) {
  // eslint-disable-next-line no-console
  console.info("deleteUser:", email)
  try {
    // 데이터베이스에서 사용자 삭제
    await postgres.query("DELETE FROM users WHERE email = $1", [email])
    // 필요한 경우 캐시 무효화 및 추가 작업 수행

    return { message: "Deleted User." }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Database error:", error)
    return { message: "Database Error: Failed to Delete User." }
  }
}

export async function fetchLoggedInUser(email: string) {
  noStore()

  try {
    const user = await postgres.query("SELECT * FROM users WHERE email = $1", [email])
    return user.rows[0] as User
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Failed to fetch user:", error)
    throw new Error("Failed to fetch user.")
  }
}

/**
 * 로그아웃을 수행하는 함수
 */
export async function performLogout() {
  "use server"

  try {
    await signOut() // 로그아웃 실행
    // eslint-disable-next-line no-console
    console.log("Successfully logged out")
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Logout failed:", error)
  }
}

export async function checkQrLogin({
  qrSessionID,
  baseUrl,
}: {
  qrSessionID: string
  baseUrl: string
}) {
  const res = await fetch(new URL("/qrScan/loginCheck", baseUrl), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sessionID: qrSessionID,
    }),
  })

  if (!res.ok) return { code: "1001" }

  const resData = await res.json()

  if (resData.code === "0000") {
    const encryped = AES.encrypt(
      JSON.stringify(resData.data),
      process.env.AUTH_SERVER_API_KEY ?? "",
    ).toString()
    return { code: resData.code, data: encryped }
  }
  return { code: "1002" }
}
