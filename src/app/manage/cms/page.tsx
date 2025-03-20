"use client"

import CmsMain from "@/components/manage/cms/CmsMain"
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
            ...theme.applyStyles("dark", {
              borderColor: "rgb(75, 85, 99)",
            }),
          }),
        ]}
      >
        <CmsMain />
      </Box>
    </Box>
  )
}
