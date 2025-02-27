import { useEffect, useState } from "react"
import { CmTableDu } from "./CmTableDu"
import { CmTableMast } from "./CmTableMast"
import { CmTableRu } from "./CmTableRu"

type TableProps = {
  selectedCode: string
}

export function TeamTableWrapper({ selectedCode }: TableProps) {
  const [selectedCode1, setSelectedCode1] = useState<string>("")
  const [selectedCode2, setSelectedCode2] = useState<string>("")
  const [selectedCode3, setSelectedCode3] = useState<string>("")

  useEffect(() => {
    setSelectedCode1(selectedCode)
  }, [selectedCode])
  return (
    <>
      <CmTableMast selectedCode={selectedCode1} setSelectedCode={setSelectedCode2} />
      <CmTableDu selectedCode={selectedCode2} setSelectedCode={setSelectedCode3} />
      <CmTableRu selectedCode={selectedCode3} />
    </>
  )
}
