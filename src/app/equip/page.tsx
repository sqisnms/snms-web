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
    <Box display="flex" className="flex flex-col md:flex-row">
      {/* Left: TreeView */}
      <Box
        sx={[
          (theme) => ({
            width: "100%",
            padding: "0",
            background: "#fafafa",
            ...theme.applyStyles("dark", {
              background: "#191919",
            }),
            [theme.breakpoints.up("md")]: {
              minWidth: "300px",
              width: "20%",
              padding: "10px",
              marginRight: "16px",
            },
          }),
        ]}
      >
        <EquipTree onSelectedCodeObj={setSelectedCodeObj} />
      </Box>
      {/* Right: Table */}
      <Box
        // className="border-l-2 pl-6 dark:border-gray-600"
        sx={[
          (theme) => ({
            width: "100%",
            marginTop: "20px",
            paddingTop: "1rem",
            borderTopWidth: "2px",
            ...theme.applyStyles("dark", {
              borderColor: "rgb(75, 85, 99)",
            }),
            [theme.breakpoints.up("md")]: {
              maxWidth: "calc(100% - 316px)",
              width: "80%",
              borderTopWidth: "0",
              borderLeftWidth: "2px",
              paddingLeft: "1rem",
              marginTop: "0",
              paddingTop: "0",
            },
          }),
        ]}
      >
        <EquipTable selectedCodeObj={selectedCodeObj} />
      </Box>
    </Box>
  )
}
