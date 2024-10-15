import { LogoutButton } from "@/ui/account/logout-form"
import NavLinks from "@/ui/dashboard/nav-links"
import SNMSLogo from "@/ui/logo"

export default function SideNav() {
  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      {/* 로고 */}
      <div className="mb-2 flex h-20 items-end justify-start rounded-md bg-blue-600 p-4 md:h-40">
        <SNMSLogo />
      </div>

      {/* 내비게이션 링크 및 로그아웃 버튼 */}
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks />
        <div className="hidden grow bg-gray-50 md:block md:h-auto md:rounded-md" />
        <LogoutButton />
      </div>
    </div>
  )
}
