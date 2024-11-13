// import SideNav from "@/components/dashboard/sidenav"

import { getMenu } from "@/actions/menu-actions"
import Gnb from "@/components/common/Gnb"
import Top from "@/components/common/Top"
import { Box, Paper } from "@mui/material"
import { auth as getServerSession } from "auth"

export default async function CommonLayout({ children }: { children: React.ReactNode }) {
  const { menuData, breadcrumbs } = await getMenu() // 공통 메뉴
  const session = await getServerSession() // 유저정보

  return (
    <div className="flex h-screen flex-col">
      <div className="w-full">
        <Gnb menuData={menuData} userName={session?.user?.name ?? ""} />
      </div>
      <div className="w-full p-6">
        <div className="flex h-screen flex-col">
          <Box className="min-h-screen bg-gray-100 p-8">
            {/* Header Section */}
            <Paper className="mb-6 p-6 shadow-md">
              <Top breadcrumbs={breadcrumbs} />
              <div style={{ width: 50, height: 20 }} />
              {children}
            </Paper>
          </Box>
        </div>
      </div>
    </div>
  )
}
