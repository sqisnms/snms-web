"use client"

import { EquipTable } from "@/components/equip/EquipTable"
import { EquipTree } from "@/components/equip/EquipTree"
import { Box } from "@mui/material"
import { useState } from "react"

// eslint-disable-next-line react/function-component-definition
export default function Page() {
  const [selectedEquipTypeCode, setSelectedEquipTypeCode] = useState<string>("")

  return (
    <Box display="flex">
      {/* Left: TreeView */}
      <Box width="20%" mr={2}>
        <EquipTree onSelectEquipTypeCode={setSelectedEquipTypeCode} />
      </Box>

      {/* Right: Table */}
      <Box
        width="80%"
        // className="border-l-2 pl-6 dark:border-gray-600"
        sx={[
          (theme) => ({
            borderLeftWidth: "2px",
            paddingLeft: "1.5rem",
            ...theme.applyStyles("dark", {
              borderColor: "rgb(75, 85, 99)",
            }),
          }),
        ]}
      >
        <EquipTable selectedEquipTypeCode={selectedEquipTypeCode} />
      </Box>
    </Box>
  )
}
