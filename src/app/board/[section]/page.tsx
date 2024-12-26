"use client"

import { Board } from "@/components/board/board"
import { useParams } from "next/navigation"

export default function Page() {
  const params = useParams() // URL의 동적 파라미터 가져오기

  const { section } = params as { section: string }

  return <Board section={section.toUpperCase()} miniId={null} />
}
