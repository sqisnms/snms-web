"use client"

import { RoleTable } from "@/components/manage/role/RoleTable"
import { Box } from "@mui/material"

// eslint-disable-next-line react/function-component-definition
export default function Page() {
  return (
    <Box display="flex">
      <Box
        width="100%"
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
        <RoleTable />
      </Box>
    </Box>
  )
}
