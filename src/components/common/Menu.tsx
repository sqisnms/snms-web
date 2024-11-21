"use client"

import { grafanaThemeAtom } from "@/atom/dashboardAtom"
import { MenuType } from "@/types/menu"
import { FormControlLabel } from "@mui/material"
import { styled } from "@mui/material/styles"
import Switch from "@mui/material/Switch"
import { useAtom } from "jotai"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"

const MaterialUISwitch = styled(Switch)(({ theme }) => ({
  width: 62,
  height: 34,
  padding: 7,
  "& .MuiSwitch-switchBase": {
    margin: 1,
    padding: 0,
    transform: "translateX(6px)",
    "&.Mui-checked": {
      color: "#fff",
      transform: "translateX(22px)",
      "& .MuiSwitch-thumb:before": {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          "#fff",
        )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
      },
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: "#aab4be",
        ...theme.applyStyles("dark", {
          backgroundColor: "#8796A5",
        }),
      },
    },
  },
  "& .MuiSwitch-thumb": {
    backgroundColor: "#001e3c",
    width: 32,
    height: 32,
    "&::before": {
      content: "''",
      position: "absolute",
      width: "100%",
      height: "100%",
      left: 0,
      top: 0,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
        "#fff",
      )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
    },
    ...theme.applyStyles("dark", {
      backgroundColor: "#003892",
    }),
  },
  "& .MuiSwitch-track": {
    opacity: 1,
    backgroundColor: "#aab4be",
    borderRadius: 20 / 2,
    ...theme.applyStyles("dark", {
      backgroundColor: "#8796A5",
    }),
  },
}))

function setCookie(name: string, value: string, days: number) {
  let expires = ""
  if (days) {
    const date = new Date()
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
    expires = `; expires=${date.toUTCString()}`
  }
  document.cookie = `${name}=${value || ""}${expires}; path=/`
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getCookie(name: string) {
  const nameEQ = `${name}=`
  const ca = document.cookie.split(";")
  for (let i = 0; i < ca.length; i + 1) {
    let c = ca[i]
    while (c.charAt(0) === " ") c = c.substring(1, c.length)
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
  }
  return null
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function eraseCookie(name: string) {
  document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`
}

export default function Menu({
  menuData,
  theme: initialTheme,
}: {
  menuData: MenuType[]
  theme: string
}) {
  const [activeMenus, setActiveMenus] = useState<string[]>([])
  const [theme, setTheme] = useState<string>(initialTheme)
  const [, setGrafanaTheme] = useAtom(grafanaThemeAtom)

  const handleMouseEnter = (menu: string, depth: number) => {
    const newActiveMenus = activeMenus.slice(0, depth)
    newActiveMenus.push(menu)

    setActiveMenus(newActiveMenus)
  }

  const handleMouseLeave = () => {
    setActiveMenus([])
  }

  const renderSubMenu = (pid: string, depth: number) => {
    const subMenus = menuData.filter((item) => item.upper_menu_id === pid)

    if (subMenus.length === 0) return null
    if (!activeMenus.includes(pid)) return null

    // 순서대로 2,3,4뎁스 용 스타일
    const depthDivStyle = [
      "absolute left-1/2 top-full z-50 w-48 -translate-x-1/2 transform bg-white text-gray-800 shadow-lg dark:bg-gray-900 dark:text-white",
      "absolute left-full top-0 z-50 w-48 bg-white text-gray-800 shadow-lg dark:bg-gray-900 dark:text-white",
      "absolute left-full top-0 z-50 w-48 bg-white text-gray-800 shadow-lg dark:bg-gray-900 dark:text-white",
    ]

    const depthLiStyle = [
      "hover:text-primary relative cursor-pointer px-4 py-2 dark:hover:text-point",
      "px-4 py-2 relative hover:bg-gray-100 dark:hover:text-point dark:bg-gray-900 dark:hover:bg-gray-800",
      "px-4 py-2 relative hover:bg-gray-100 dark:hover:text-point dark:bg-gray-900 dark:hover:bg-gray-800",
    ]

    return (
      <div className={depthDivStyle[depth - 1]}>
        <ul className="py-2">
          {subMenus.map((menu) => (
            <li
              key={menu.menu_id}
              className={depthLiStyle[depth - 1]}
              onMouseEnter={() => handleMouseEnter(menu.menu_id, depth)}
            >
              {menu.leaf_node_yn_code === "Y" ? (
                <Link href={menu.url ?? ""}>{menu.menu_name}</Link>
              ) : (
                menu.menu_name
              )}
              {renderSubMenu(menu.menu_id, depth + 1)}
            </li>
          ))}
        </ul>
      </div>
    )
  }

  // 스위치가 눌렸을 때 모드 전환 함수
  const toggleTheme = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTheme = event.target.checked ? "dark" : "light"
    setTheme(newTheme)
    setGrafanaTheme(newTheme as "dark" | "light")

    document.documentElement.className = newTheme

    setCookie("theme", newTheme, 30)
  }

  useEffect(() => {
    const savedTheme = initialTheme ?? "light"
    setTheme(savedTheme)
    setGrafanaTheme(savedTheme as "dark" | "light")
    document.documentElement.className = savedTheme
  }, [])

  return (
    <div className="flex items-center">
      <Link href="/main">
        <Image src="/logo_w.svg" width={130} height={40} alt="Logo" className="mr-10 h-8" />
      </Link>
      <nav className="relative flex space-x-6">
        {menuData
          .filter((item) => item.upper_menu_id === null)
          .map((menu) => (
            <div
              key={menu.menu_id}
              onMouseEnter={() => handleMouseEnter(menu.menu_id, 0)}
              onMouseLeave={handleMouseLeave}
              className="relative"
            >
              <button
                type="button"
                className={`h-16 px-4 py-2 ${
                  activeMenus.includes(menu.menu_id)
                    ? "border-b-2 border-point text-point"
                    : "border-b-2 border-transparent"
                }`}
              >
                {menu.leaf_node_yn_code === "Y" ? (
                  <Link href={menu.url ?? ""}>{menu.menu_name}</Link>
                ) : (
                  menu.menu_name
                )}
              </button>
              {renderSubMenu(menu.menu_id, 1)}
            </div>
          ))}
      </nav>
      <FormControlLabel
        control={
          <MaterialUISwitch sx={{ m: 1 }} onChange={toggleTheme} checked={theme !== "light"} />
        }
        label=""
      />
    </div>
  )
}
