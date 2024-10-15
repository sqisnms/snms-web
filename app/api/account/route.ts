import { NextResponse } from "next/server"

export async function GET() {
  // eslint-disable-next-line no-console
  console.error("22221")
  return NextResponse.json({ message: "GET 요청" })
}

export async function POST() {
  // eslint-disable-next-line no-console
  console.error("22223")
  return NextResponse.json({ message: "POST 요청" })
}
