"use client"

import { MenuTable } from "@/components/manage/menu/MenuTable"
import { MenuTree } from "@/components/manage/menu/MenuTree"
import { MenuType } from "@/types/menu"
import { Box } from "@mui/material"
import { useState } from "react"

// eslint-disable-next-line react/function-component-definition
export default function Page() {
  const [selectedCode, setSelectedCode] = useState<string>("")
  const [tempMenu, setTempMenu] = useState<Partial<MenuType> | undefined>(undefined)

  const onSelectCode = (code: string) => {
    setSelectedCode(code)
    setTempMenu(undefined)
  }

  return (
    <Box display="flex">
      {/* Left: TreeView */}
      <Box
        width="20%"
        mr={2}
        sx={[
          (theme) => ({
            background: "#fafafa",
            padding: "10px",
            minHeight: "30vh",
            ...theme.applyStyles("dark", {
              background: "#000",
            }),
          }),
        ]}
      >
        <MenuTree onSelectCode={onSelectCode} setTempMenu={setTempMenu} />
      </Box>
      {/* Right: Table */}
      <Box
        width="80%"
        // className="border-l-2 pl-6 dark:border-gray-600"
        sx={[
          (theme) => ({
            borderLeftWidth: "2px",
            paddingLeft: "1rem",
            minHeight: "30vh",
            ...theme.applyStyles("dark", {
              borderColor: "rgb(75, 85, 99)",
            }),
          }),
        ]}
      >
        <MenuTable selectedCode={selectedCode} tempMenu={tempMenu} setTempMenu={setTempMenu} />
      </Box>
    </Box>
  )
}
