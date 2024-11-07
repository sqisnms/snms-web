"use client"

import GNB from "@/components/dashboard/gnb"
import {
  Box,
  Breadcrumbs,
  Link,
  MenuItem,
  Paper,
  Select,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Typography,
} from "@mui/material"
import React, { SyntheticEvent, useState } from "react"

// eslint-disable-next-line react/function-component-definition
const DashboardLayout: React.FC = () => {
  const [tabValue, setTabValue] = useState(0)

  const handleTabChange = (event: SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  return (
    <div className="flex h-screen flex-col">
      <div className="w-full">
        <GNB />
      </div>
      <Box className="min-h-screen bg-gray-100 p-8">
        {/* Header Section */}
        <Paper className="mb-6 p-6 shadow-md">
          <Box display="flex" alignItems="center" justifyContent="space-between">
            {/* Title */}
            <Typography variant="h5" className="font-semibold text-gray-800">
              Page Title
            </Typography>

            {/* Breadcrumb */}
            <Breadcrumbs aria-label="breadcrumb">
              <Link href="/" underline="hover" color="inherit">
                Home
              </Link>
              <Typography color="text.primary">Dashboard</Typography>
            </Breadcrumbs>
          </Box>

          <Box display="flex" alignItems="center" justifyContent="space-between" className="mt-2">
            <Typography variant="h6" className="font-semibold text-gray-800">
              Page Title
            </Typography>
            {/* Select Box */}

            <Box display="flex" alignItems="center">
              <Typography variant="body1" className="font-base text-gray-700">
                선택 항목
              </Typography>
              <Select defaultValue="Option 1" className="ml-4 h-12 bg-white">
                <MenuItem value="Option 1">Option 1</MenuItem>
                <MenuItem value="Option 2">Option 2</MenuItem>
              </Select>
            </Box>
          </Box>

          {/* Tabs */}
          <Box mt={2}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="styled tabs"
              className="w-full border-b border-gray-300"
              TabIndicatorProps={{
                style: {
                  backgroundColor: "primary",
                  height: "2px",
                },
              }}
            >
              <Tab
                label="Tab 1"
                className={`flex-1 px-4 py-2 font-semibold text-gray-700 ${
                  tabValue === 0
                    ? "border-l border-r border-t border-gray-300 bg-white"
                    : "bg-gray-100"
                }`}
              />
              <Tab
                label="Tab 2"
                className={`flex-1 px-4 py-2 font-semibold text-gray-700 ${
                  tabValue === 1
                    ? "border-l border-r border-t border-gray-300 bg-white"
                    : "bg-gray-100"
                }`}
              />
              <Tab
                label="Tab 3"
                className={`flex-1 px-4 py-2 font-semibold text-gray-700 ${
                  tabValue === 2
                    ? "border-l border-r border-t border-gray-300 bg-white"
                    : "bg-gray-100"
                }`}
              />
              <Tab
                label="Tab 4"
                className={`flex-1 px-4 py-2 font-semibold text-gray-700 ${
                  tabValue === 3
                    ? "border-l border-r border-t border-gray-300 bg-white"
                    : "bg-gray-100"
                }`}
              />
            </Tabs>
          </Box>

          <TableContainer className="mt-5">
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell className="font-semibold text-gray-600">Column 1</TableCell>
                  <TableCell className="font-semibold text-gray-600">Column 2</TableCell>
                  <TableCell className="font-semibold text-gray-600">Column 3</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Data 1</TableCell>
                  <TableCell>Data 2</TableCell>
                  <TableCell>Data 3</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Data 4</TableCell>
                  <TableCell>Data 5</TableCell>
                  <TableCell>Data 6</TableCell>
                </TableRow>
                {/* Add more rows as needed */}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </div>
  )
}

export default DashboardLayout
