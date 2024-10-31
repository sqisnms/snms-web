"use client"

import React, { useState } from "react"
import Image from "next/image"

function GNB() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null)

  const handleMouseEnter = (menu: string) => {
    setActiveMenu(menu)
  }

  const handleMouseLeave = () => {
    setActiveMenu(null)
    setActiveSubmenu(null)
  }

  const handleSubmenuEnter = (submenu: string) => {
    setActiveSubmenu(submenu)
  }

  return (
    <header className="bg-primary text-white">
      <div className="container mx-auto flex h-16 items-center justify-between">
        <div className="flex items-center">
          <Image src="/logo_w.svg" width="160" height="80" alt="Logo" className="mr-10 h-8" />
          <nav className="relative flex space-x-6">
            {["대시보드", "감사", "운영", "분석", "SR관리", "시스템관리"].map((menu) => (
              <div
                key={menu}
                onMouseEnter={() => handleMouseEnter(menu)}
                onMouseLeave={handleMouseLeave}
                className="relative"
              >
                <button
                  type="button"
                  className={`h-16 px-4 py-2 ${
                    activeMenu === menu
                      ? "border-b-2 border-point text-point"
                      : "border-b-2 border-transparent"
                  }`}
                >
                  {menu}
                </button>

                {activeMenu === menu && (
                  <div className="absolute left-1/2 top-full z-50 w-48 -translate-x-1/2 transform bg-white text-gray-800 shadow-lg">
                    <ul className="py-2">
                      {["2depth Menu 1", "2depth Menu 2", "2depth Menu 3"].map((submenu) => (
                        <li
                          key={submenu}
                          className="relative cursor-pointer px-4 py-2 hover:text-primary"
                          onMouseEnter={() => handleSubmenuEnter(submenu)}
                        >
                          {submenu}

                          {activeSubmenu === submenu && (
                            <div className="absolute left-full top-0 z-50 w-48 bg-white text-gray-800 shadow-lg">
                              <ul className="py-2">
                                <li className="px-4 py-2 hover:bg-gray-100">3depth Menu 1</li>
                                <li className="px-4 py-2 hover:bg-gray-100">3depth Menu 2</li>
                                <li className="px-4 py-2 hover:bg-gray-100">3depth Menu 3</li>
                              </ul>
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* Right Icons */}
        <div className="flex items-center space-x-4">
          <button type="button">
            <Image src="/ic_setting.png" width={32} height={32} alt="Settings" className="h-6" />
          </button>
          <button type="button">
            <Image src="/ic_search.png" width={32} height={32} alt="Search" className="h-6" />
          </button>
          <span>홍길동님</span>
          <button type="button" className="flex items-center">
            <Image
              src="/ic_logout.png"
              width={32}
              height={32}
              alt="Logout"
              className="ml-2 h-6 rounded-full"
            />
          </button>
        </div>
      </div>
    </header>
  )
}

export default GNB
