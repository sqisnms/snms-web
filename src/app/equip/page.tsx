"use client"

import { EquipTable } from "@/components/equip/EquipTable"
import { EquipTree } from "@/components/equip/EquipTree"
import { Box } from "@mui/material"
import { useState } from "react"

// eslint-disable-next-line react/function-component-definition
export default function Page() {
  const [selectedCodeObj, setSelectedCodeObj] = useState<{
    equip_type_code: string
    net_type_code: string
    allYN: string
  }>()

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
        <EquipTree onSelectedCodeObj={setSelectedCodeObj} />
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
        <EquipTable selectedCodeObj={selectedCodeObj} />
      </Box>
    </Box>
  )
}
