// import SideNav from "@/components/dashboard/sidenav"

import { getMenu } from "@/actions/menu-actions"
import Gnb from "@/components/common/Gnb"
import { auth as getServerSession } from "auth"
import { cookies } from "next/headers"

export default async function CommonLayout({ children }: { children: React.ReactNode }) {
  const { menuData } = await getMenu() // 공통 메뉴
  const session = await getServerSession() // 유저정보

  // 다크모드 토글 초기 세팅
  const cookie = cookies()
  const theme = cookie.get("theme")?.value ?? "light"
  return (
    <div className="flex min-h-screen flex-col dark:bg-black">
      <div className="w-full">
        <Gnb menuData={menuData} userName={session?.user?.name ?? ""} theme={theme} />
      </div>
      <div className="w-full">{children}</div>
    </div>
  )
}
