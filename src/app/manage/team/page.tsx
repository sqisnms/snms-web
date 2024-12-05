"use client"

import { TeamTable } from "@/components/manage/team/TeamTable"
import { TeamTree } from "@/components/manage/team/TeamTree"
import { Box } from "@mui/material"
import { useState } from "react"

// eslint-disable-next-line react/function-component-definition
export default function Page() {
  const [selectedCode, setSelectedCode] = useState<string>("")

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
        <TeamTree onSelectCode={setSelectedCode} />
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
        <TeamTable selectedCode={selectedCode} />
      </Box>
    </Box>
  )
}
