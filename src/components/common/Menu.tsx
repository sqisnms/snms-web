"use client"

import { MenuType } from "@/types/menu"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

export default function Menu({ menuData }: { menuData: MenuType[] }) {
  const [activeMenus, setActiveMenus] = useState<string[]>([])

  const handleMouseEnter = (menu: string, depth: number) => {
    const newActiveMenus = activeMenus.slice(0, depth)
    newActiveMenus.push(menu)

    setActiveMenus(newActiveMenus)
  }

  const handleMouseLeave = () => {
    setActiveMenus([])
  }

  const renderSubMenu = (pid: string, depth: number) => {
    const subMenus = menuData.filter((item) => item.UPPER_MENU_ID === pid)

    if (subMenus.length === 0) return null
    if (!activeMenus.includes(pid)) return null

    // 순서대로 2,3,4뎁스 용 스타일
    const depthDivStyle = [
      "absolute left-1/2 top-full z-50 w-48 -translate-x-1/2 transform bg-white text-gray-800 shadow-lg",
      "absolute left-full top-0 z-50 w-48 bg-white text-gray-800 shadow-lg",
      "absolute left-full top-0 z-50 w-48 bg-white text-gray-800 shadow-lg",
    ]

    const depthLiStyle = [
      "hover:text-primary relative cursor-pointer px-4 py-2",
      "px-4 py-2 relative hover:bg-gray-100",
      "px-4 py-2 relative hover:bg-gray-100",
    ]

    return (
      <div className={depthDivStyle[depth - 1]}>
        <ul className="py-2">
          {subMenus.map((menu) => (
            <li
              key={menu.MENU_ID}
              className={depthLiStyle[depth - 1]}
              onMouseEnter={() => handleMouseEnter(menu.MENU_ID, depth)}
            >
              {menu.LEAF_NODE_YN_CODE === "Y" ? (
                <Link href={menu.URL ?? ""}>{menu.MENU_NAME}</Link>
              ) : (
                menu.MENU_NAME
              )}
              {renderSubMenu(menu.MENU_ID, depth + 1)}
            </li>
          ))}
        </ul>
      </div>
    )
  }

  return (
    <div className="flex items-center">
      <Image src="/logo_w.svg" width={130} height={40} alt="Logo" className="mr-10 h-8" />
      <nav className="relative flex space-x-6">
        {menuData
          .filter((item) => item.UPPER_MENU_ID === null)
          .map((menu) => (
            <div
              key={menu.MENU_ID}
              onMouseEnter={() => handleMouseEnter(menu.MENU_ID, 0)}
              onMouseLeave={handleMouseLeave}
              className="relative"
            >
              <button
                type="button"
                className={`h-16 px-4 py-2 ${
                  activeMenus.includes(menu.MENU_ID)
                    ? "border-b-2 border-point text-point"
                    : "border-b-2 border-transparent"
                }`}
              >
                {menu.LEAF_NODE_YN_CODE === "Y" ? (
                  <Link href={menu.URL ?? ""}>{menu.MENU_NAME}</Link>
                ) : (
                  menu.MENU_NAME
                )}
              </button>
              {renderSubMenu(menu.MENU_ID, 1)}
            </div>
          ))}
      </nav>
    </div>
  )
}
