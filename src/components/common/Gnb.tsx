import { LogoutButton } from "@/components/account/logout-form"
import { MenuType } from "@/types/menu"
import { UserType } from "@/types/user"
import Menu from "./Menu"

function Gnb({
  menuData,
  theme,
  currentUser,
}: {
  menuData: MenuType[]
  theme: string
  currentUser: Partial<UserType> | null
}) {
  return (
    <header className="bg-primary text-white dark:bg-gray-800">
      <div className="container flex h-16 w-full max-w-full items-center justify-between px-4">
        <Menu menuData={menuData} theme={theme} />

        {/* Right Icons */}
        <div className="flex items-center space-x-4">
          {/* <button type="button">
            <Image src="/ic_setting.png" width={25} height={25} alt="Settings" className="h-6" />
          </button>
          <button type="button">
            <Image src="/ic_search.png" width={25} height={25} alt="Search" className="h-6" />
          </button> */}
          <span>{currentUser?.user_name ?? ""}님</span>
          {/* <UserName /> */}
          <LogoutButton />
        </div>
      </div>
    </header>
  )
}

export default Gnb
