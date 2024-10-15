import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({ message: "GET 요청" })
}

export async function POST() {
  return NextResponse.json({ message: "POST 요청" })
}
