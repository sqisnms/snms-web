"use client"

import { EquipTable } from "@/components/equip/EquipTable"
import { EquipTree } from "@/components/equip/EquipTree"
import { Box, Breadcrumbs, Link, Paper, Typography } from "@mui/material"
import { useState } from "react"

// eslint-disable-next-line react/function-component-definition
export default function Page() {
  const [selectedEquipTypeCode, setSelectedEquipTypeCode] = useState<string>("")

  return (
    <div className="flex h-screen flex-col">
      <Box className="min-h-screen bg-gray-100 p-8">
        {/* Header Section */}
        <Paper className="mb-6 p-6 shadow-md">
          <Box display="flex" alignItems="center" justifyContent="space-between">
            {/* Title */}
            <Typography variant="h5" className="font-semibold text-gray-800">
              구성관리
            </Typography>

            {/* Breadcrumb */}
            <Breadcrumbs aria-label="breadcrumb">
              <Link href="/" underline="hover" color="inherit">
                Home
              </Link>
              <Typography color="text.primary">구성관리</Typography>
            </Breadcrumbs>
          </Box>

          <Box display="flex" mt={5}>
            {/* Left: TreeView */}
            <Box width="30%" mr={2}>
              <EquipTree onSelectEquipTypeCode={setSelectedEquipTypeCode} />
            </Box>

            {/* Right: Table */}
            <Box width="70%">
              <EquipTable selectedEquipTypeCode={selectedEquipTypeCode} />
            </Box>
          </Box>
        </Paper>
      </Box>
    </div>
  )
}
