import { LogoutButton } from "@/components/account/logout-form"
import { MenuType } from "@/types/menu"
import Image from "next/image"
import Menu from "./Menu"

function Gnb({ menuData, userName }: { menuData: MenuType[]; userName: string }) {
  return (
    <header className="bg-primary text-white">
      <div className="container mx-auto flex h-16 items-center justify-between">
        <Menu menuData={menuData} />

        {/* Right Icons */}
        <div className="flex items-center space-x-4">
          <button type="button">
            <Image src="/ic_setting.png" width={25} height={25} alt="Settings" className="h-6" />
          </button>
          <button type="button">
            <Image src="/ic_search.png" width={25} height={25} alt="Search" className="h-6" />
          </button>
          <span>{userName}님</span>
          {/* <UserName /> */}
          <LogoutButton />
        </div>
      </div>
    </header>
  )
}

export default Gnb
