import { Button } from "@/components/common/button"
import { PowerIcon } from "@heroicons/react/24/outline"
import { signOut } from "auth"

export default function LogoutForm() {
  return (
    <div className="mb-6">
      <form
        action={async () => {
          "use server"

          await signOut()
        }}
      >
        <Button className="rounded-lg bg-blue-500 text-sm font-medium text-white">
          <PowerIcon className="w-6" />
          <div className="hidden md:block">로그아웃</div>
        </Button>
      </form>
    </div>
  )
}

// 로그아웃 버튼 컴포넌트
export function LogoutButton() {
  return (
    <form
      action={async () => {
        "use server"

        await signOut()
      }}
    >
      <button
        type="submit"
        className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3"
      >
        <PowerIcon className="w-6" />
        <span className="hidden md:block">로그아웃</span>
      </button>
    </form>
  )
}
