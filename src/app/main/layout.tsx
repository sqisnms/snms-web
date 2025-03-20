// import SideNav from "@/components/dashboard/sidenav"

import { getCurrentUser } from "@/actions/account-actions"
import { getCmsInfo } from "@/actions/cms-action"
import { getMenu } from "@/actions/menu-actions"
import Gnb from "@/components/common/Gnb"
import { CmsProvider, UserProvider } from "@/config/Providers"
import { cookies } from "next/headers"

export default async function CommonLayout({ children }: { children: React.ReactNode }) {
  const { menuData } = await getMenu() // 공통 메뉴
  // const session = await getServerSession() // 유저정보
  const currentUser = await getCurrentUser()
  const cms = await getCmsInfo()

  const loweredUserRoleIds = currentUser?.role_ids?.map((r) => r.toLowerCase())
  const roledMenu = menuData.filter((m) => {
    return (
      loweredUserRoleIds?.includes("admin") ||
      m.role_ids?.length === 0 ||
      m.role_ids?.some((r) => {
        return currentUser?.role_ids?.includes(r)
      })
    )
  })

  // 다크모드 토글 초기 세팅
  const cookie = cookies()
  const theme = cookie.get("theme")?.value ?? "light"

  return (
    <UserProvider value={{ currentUser }}>
      <CmsProvider value={{ cms }}>
        <div className="flex min-h-screen flex-col dark:bg-black">
          <div className="w-full">
            <Gnb menuData={roledMenu} theme={theme} currentUser={currentUser} />
          </div>
          <div className="w-full">{children}</div>
        </div>
      </CmsProvider>
    </UserProvider>
  )
}
