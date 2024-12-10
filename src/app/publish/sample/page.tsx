"use client"

import {
  Box,
  Button,
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
  TextField,
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
    <Box className="p-0">
      {/* Header Section */}
      <Paper className="mb-6 w-full p-0 shadow-md dark:bg-black">
        {/* <Box display="flex" alignItems="center" justifyContent="space-between"> */}
        {/* Title */}
        {/* <Typography variant="h5" className="font-semibold text-gray-800">
              Page Title
            </Typography> */}

        {/* Breadcrumb */}
        {/* <Breadcrumbs aria-label="breadcrumb">
              <Link href="/" underline="hover" color="inherit">
                Home
              </Link>
              <Typography color="text.primary">Dashboard</Typography>
            </Breadcrumbs> */}
        {/* </Box> */}

        <Box display="flex" alignItems="center" justifyContent="space-between" className="w-full">
          <Typography variant="h6" className="text-lg font-semibold text-gray-800 dark:text-white">
            Page Sub Title
          </Typography>
          {/* Select Box */}

          <Box display="flex" alignItems="center">
            <Typography
              variant="body1"
              className="p-0 text-sm font-bold text-gray-700 dark:text-white"
            >
              선택 항목
            </Typography>
            <Select defaultValue="Option 1" className="ml-2 h-10 bg-white text-sm dark:bg-black">
              <MenuItem value="Option 1" className="text-sm">
                Option 1
              </MenuItem>
              <MenuItem value="Option 2" className="text-sm">
                Option 2
              </MenuItem>
            </Select>
            <Typography variant="body1" className="ml-6 text-sm text-gray-700 dark:text-white">
              조회건수 <span className="font-bold"> 10건</span>
            </Typography>
          </Box>
        </Box>

        {/* Tabs */}
        <Box mt={2}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="styled tabs"
            className="w-full border-b border-gray-300 dark:border-gray-800"
            sx={[
              (theme) => ({
                "& .MuiTabs-indicator": {
                  backgroundColor: "primary.main",
                  height: "2px",
                  ...theme.applyStyles("dark", {
                    backgroundColor: "theme.palette.secondary.main",
                  }),
                },
              }),
            ]}
          >
            <Tab
              label="Tab 1"
              className={`max-w-none flex-1 px-4 py-2 font-semibold text-gray-700 ${
                tabValue === 0
                  ? "border-l border-r border-t border-gray-300 bg-white dark:bg-black dark:text-secondary"
                  : "bg-gray-100 dark:bg-black dark:text-white"
              }`}
            />
            <Tab
              label="Tab 2"
              className={`max-w-none flex-1 px-4 py-2 font-semibold text-gray-700 ${
                tabValue === 1
                  ? "border-l border-r border-t border-gray-300 bg-white dark:bg-black dark:text-secondary"
                  : "bg-gray-100 dark:bg-black dark:text-white"
              }`}
            />
            <Tab
              label="Tab 3"
              className={`max-w-none flex-1 px-4 py-2 font-semibold text-gray-700 ${
                tabValue === 2
                  ? "border-l border-r border-t border-gray-300 bg-white dark:bg-black dark:text-secondary"
                  : "bg-gray-100 dark:bg-black dark:text-white"
              }`}
            />
            <Tab
              label="Tab 4"
              className={`max-w-none flex-1 px-4 py-2 font-semibold text-gray-700 ${
                tabValue === 3
                  ? "border-l border-r border-t border-gray-300 bg-white dark:bg-black dark:text-secondary"
                  : "bg-gray-100 dark:bg-black dark:text-white"
              }`}
            />
          </Tabs>
        </Box>

        <div className="mb-4 mt-4 rounded-sm border border-gray-300 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-950">
          <div className="mb-4 grid grid-cols-3 gap-x-4 gap-y-2">
            {/* 운용부서 */}
            <div>
              <label
                htmlFor="select1"
                className="mb-1 block text-sm font-medium text-gray-700 dark:text-white"
              >
                운용부서
              </label>
              <Select
                id="select1"
                variant="outlined"
                size="small"
                fullWidth
                className="bg-white text-sm dark:bg-gray-400"
              >
                <MenuItem value="" className="text-sm">
                  선택하세요
                </MenuItem>
                <MenuItem value="무선망관제팀" className="text-sm">
                  무선망관제팀
                </MenuItem>
                <MenuItem value="유선망운용팀" className="text-sm">
                  유선망운용팀
                </MenuItem>
              </Select>
            </div>

            {/* 운용상태 */}
            <div>
              <label
                htmlFor="select2"
                className="mb-1 block text-sm font-medium text-gray-700 dark:text-white"
              >
                운용상태
              </label>
              <Select
                id="select2"
                variant="outlined"
                size="small"
                fullWidth
                className="bg-white text-sm"
              >
                <MenuItem value="" className="text-sm">
                  선택하세요
                </MenuItem>
              </Select>
            </div>

            {/* NMS공사/작업용 장비 유형 */}
            <div>
              <label
                htmlFor="select3"
                className="mb-1 block text-sm font-medium text-gray-700 dark:text-white"
              >
                NMS공사/작업용 장비 유형
              </label>
              <Select
                id="select3"
                variant="outlined"
                size="small"
                fullWidth
                className="bg-white text-sm"
              >
                <MenuItem value="" className="text-sm">
                  선택하세요
                </MenuItem>
              </Select>
            </div>

            {/*  장비ID(영) */}
            <div>
              <label
                htmlFor="input1"
                className="mb-1 block text-sm font-medium text-gray-700 dark:text-white"
              >
                장비ID(영)
              </label>
              <TextField
                id="input1"
                variant="outlined"
                placeholder="직접 입력해주세요"
                className="mt-0 w-full"
              />
            </div>

            {/*  장비ID(한) */}
            <div>
              <label
                htmlFor="input2"
                className="mb-1 block text-sm font-medium text-gray-700 dark:text-white"
              >
                장비ID(한)
              </label>
              <TextField
                id="input2"
                variant="outlined"
                placeholder="직접 입력해주세요"
                className="mt-0 w-full"
              />
            </div>

            {/*  장비ID(한) */}
            <div>
              <label
                htmlFor="input3"
                className="mb-1 block text-sm font-medium text-gray-700 dark:text-white"
              >
                장비 IP
              </label>
              <TextField
                id="input3"
                variant="outlined"
                placeholder="직접 입력해주세요"
                className="mt-0 w-full"
              />
            </div>

            {/* 장비구분(Lv1) */}
            <div>
              <label
                htmlFor="select4"
                className="mb-1 block text-sm font-medium text-gray-700 dark:text-white"
              >
                장비구분(Lv1)
              </label>
              <Select
                id="select4"
                variant="outlined"
                size="small"
                fullWidth
                className="bg-white text-sm"
              >
                <MenuItem value="" className="text-sm">
                  선택하세요
                </MenuItem>
              </Select>
            </div>

            {/* 장비구분(Lv2) */}
            <div>
              <label
                htmlFor="select5"
                className="mb-1 block text-sm font-medium text-gray-700 dark:text-white"
              >
                장비구분(Lv2)
              </label>
              <Select
                id="select5"
                variant="outlined"
                size="small"
                fullWidth
                className="bg-white text-sm"
              >
                <MenuItem value="" className="text-sm">
                  선택하세요
                </MenuItem>
              </Select>
            </div>

            {/* 장비구분(Lv3) */}
            <div>
              <label
                htmlFor="select6"
                className="mb-1 block text-sm font-medium text-gray-700 dark:text-white"
              >
                장비구분(Lv3)
              </label>
              <Select
                id="select6"
                variant="outlined"
                size="small"
                fullWidth
                className="bg-white text-sm"
              >
                <MenuItem value="" className="text-sm">
                  선택하세요
                </MenuItem>
              </Select>
            </div>
          </div>

          {/* 하단 버튼 */}
          <div className="flex w-full items-center justify-end">
            {/* <FormControlLabel control={<Checkbox size="small" />} label="조회수 131" /> */}
            <div className="space-x-2">
              <Button
                variant="contained"
                size="small"
                sx={[
                  (theme) => ({
                    background: theme.palette.secondary.main,
                    width: "6rem",
                    fontSize: "16px",
                    lineHeight: "2rem",
                    boxShadow: "none",
                    color: theme.palette.secondary.contrastText,
                    "&:hover": {
                      background: theme.palette.secondary.dark,
                      boxShadow: "none",
                    },
                  }),
                ]}
              >
                초기화
              </Button>
              <Button
                variant="contained"
                size="small"
                sx={[
                  (theme) => ({
                    background: theme.palette.primary.main,
                    width: "6rem",
                    fontSize: "16px",
                    lineHeight: "2rem",
                    boxShadow: "none",
                    color: theme.palette.primary.contrastText,
                    "&:hover": {
                      background: theme.palette.primary.dark,
                      boxShadow: "none",
                    },
                  }),
                ]}
              >
                조회
              </Button>
            </div>
          </div>
        </div>

        <TableContainer className="mt-5 rounded-md">
          <Table
            aria-label="simple table"
            sx={[
              (theme) => ({
                "& .MuiTableCell-root": { padding: "4px 16px", height: "40px" },
                backgroundColor: "#fafafa",
                ...theme.applyStyles("dark", {
                  backgroundColor: "#000",
                }),
              }),
            ]}
          >
            <TableHead
              sx={[
                (theme) => ({
                  height: "40px",
                  background: "#e5e7eb",
                  ...theme.applyStyles("dark", {
                    backgroundColor: "#1f2937",
                  }),
                }),
              ]}
            >
              <TableRow>
                <TableCell className="font-semibold text-gray-600 dark:text-white">
                  Column 1
                </TableCell>
                <TableCell className="font-semibold text-gray-600 dark:text-white">
                  Column 2
                </TableCell>
                <TableCell className="font-semibold text-gray-600 dark:text-white">
                  Column 3
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell className="dark:text-white">Data 1</TableCell>
                <TableCell className="dark:text-white">Data 2</TableCell>
                <TableCell className="dark:text-white">Data 3</TableCell>
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
  )
}

export default DashboardLayout
