import { signOut } from "auth"
import Image from "next/image"

// 로그아웃 버튼 컴포넌트
export function LogoutButton() {
  return (
    <form
      action={async () => {
        "use server"

        await signOut({ redirectTo: "/login", redirect: true })
      }}
    >
      <button type="submit" className="flex items-center">
        <Image
          src="/ic_logout.png"
          width={25}
          height={25}
          alt="Logout"
          className="ml-2 h-6 rounded-full"
        />
      </button>
    </form>
  )
}
