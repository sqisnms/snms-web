// import SideNav from "@/components/dashboard/sidenav"
import GNB from "@/components/dashboard/gnb"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col">
      {/* <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div> */}
      <div className="w-full">
        <GNB />
      </div>
      <div className="w-full p-12 p-6">{children}</div>
    </div>
  )
}
