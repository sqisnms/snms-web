// import SideNav from "@/components/dashboard/sidenav"

import CommonLayout from "../commonLayout"

export default async function Layout({ children }: { children: React.ReactNode }) {
  return <CommonLayout>{children}</CommonLayout>
}
