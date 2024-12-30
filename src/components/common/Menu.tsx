"use client"

import { grafanaThemeAtom } from "@/atom/dashboardAtom"
import { LOGIN_DEFAULT_PAGE } from "@/config/const"
import { MenuType } from "@/types/menu"
import CloseIcon from "@mui/icons-material/Close"
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp"
import MenuIcon from "@mui/icons-material/Menu"
import { Box, FormControlLabel } from "@mui/material"
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
  const [isMenuOpen, setIsMenuOpen] = useState(false) // 햄버거 메뉴 열림/닫힘 상태
  const [activeMenus, setActiveMenus] = useState<string[]>([])
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      const isMobileView = window.innerWidth <= 900 // 900px 이하를 모바일로 간주
      setIsMobile(isMobileView)

      if (!isMobileView) {
        setActiveMenus([]) // 활성화된 하위 메뉴 초기화
      }
    }
    handleResize() // 초기 설정
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

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

  const handleMenuClick = (menuId: string) => {
    // 해당 메뉴 및 모든 하위 메뉴 ID 가져오기
    const getAllSubMenuIds = (id: string): string[] => {
      const subMenus = menuData.filter((menu) => menu.upper_menu_id === id)
      const subMenuIds = subMenus.map((menu) => menu.menu_id)
      // 하위 메뉴가 더 있다면 재귀적으로 ID 추가
      return subMenuIds.length > 0
        ? subMenuIds.concat(subMenuIds.flatMap((subId) => getAllSubMenuIds(subId)))
        : []
    }

    const allRelatedIds = [menuId, ...getAllSubMenuIds(menuId)]

    // 상태 업데이트
    setActiveMenus(
      (prev) =>
        prev.includes(menuId)
          ? prev.filter((id) => !allRelatedIds.includes(id)) // 열려 있으면 닫기
          : [...prev, ...allRelatedIds], // 닫혀 있으면 열기
    )
  }

  const openInNewWindow = (menu: MenuType) => {
    const url = menu.url ?? ""
    const width = menu.screen_width ?? 800
    const height = menu.screen_width ?? 600

    // 아이디로 추적할거면 noopener,noreferrer 못씀
    window.open(url, url, `width=${width},height=${height},top=50,left=50`)
  }

  function renderMenuLink(menu: MenuType) {
    if (menu.leaf_node_yn_code === "Y") {
      // 새창 팝업
      if (menu.pop_up_yn_code === "Y") {
        return (
          <Box>
            <button type="button" onClick={() => openInNewWindow(menu)}>
              {menu.menu_name}
            </button>
          </Box>
        )
      }
      // 새탭
      if (menu.pop_up_yn_code === "T") {
        return (
          <Link
            className="block w-full py-3 pl-4 indent-4 text-[15px] leading-5 text-gray-800 hover:bg-gray-100 hover:text-primary dark:text-white dark:hover:bg-gray-900 dark:hover:text-point md:p-0 md:indent-0 md:text-base md:hover:!bg-transparent"
            href={menu.url ?? ""}
            target={menu.url ?? ""}
          >
            {menu.menu_name}
          </Link>
        )
      }
      // 현재 탭 링크 이동
      return (
        <Link
          className="menu md:dark:hover:text-pointZ block w-full py-3 pl-4 indent-4 text-[15px] leading-5 text-gray-800 hover:bg-gray-100 hover:text-primary dark:text-white dark:hover:bg-gray-900 dark:hover:text-point md:p-0 md:indent-0 md:text-base md:hover:!bg-transparent"
          href={menu.url ?? ""}
        >
          {menu.menu_name}
        </Link>
      )
    }
    return menu.menu_name
  }

  const renderSubMenu = (pid: string, depth: number) => {
    const subMenus = menuData.filter((item) => item.upper_menu_id === pid)

    if (subMenus.length === 0) return null
    // if (!activeMenus.includes(pid)) return null
    const isActive = activeMenus.includes(pid)

    // 순서대로 2,3,4뎁스 용 스타일
    const depthDivStyle = [
      "depth2 absolute left-1/2 top-full z-50 w-48 -translate-x-1/2 transform bg-white text-gray-800 shadow-lg dark:bg-gray-900 dark:text-white",
      "depth3 z-10 bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-white md:absolute md:left-full md:top-0 md:z-50 md:w-48 md:bg-white md:shadow-lg",
      "depth4 z-10 bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-white md:absolute md:left-full md:top-0 md:z-50 md:w-48 md:bg-white md:shadow-lg",
    ]

    const depthLiStyle = [
      "text-gray-800 hover:text-primary relative cursor-pointer dark:hover:text-point md:dark:text-white dark:bg-gray-900 dark:hover:bg-gray-900",
      "hover:text-primary dark:bg-gray-900 dark:hover:bg-gray-800 dark:hover:text-point md:relative md:hover:bg-gray-100",
      "dark:bg-gray-900 dark:hover:bg-gray-800 dark:hover:text-point md:relative md:hover:bg-gray-100",
    ]

    return (
      <div className={depthDivStyle[depth - 1]} style={{ display: isActive ? "block" : "none" }}>
        <ul className="md:py-2">
          {subMenus.map((menu) => (
            <li
              key={menu.menu_id}
              className={`${depthLiStyle[depth - 1]} md:hover:bg-gray-100 md:hover:text-primary`}
              onMouseEnter={!isMobile ? () => handleMouseEnter(menu.menu_id, depth) : undefined}
              onMouseLeave={!isMobile ? handleMouseLeave : undefined}
            >
              <span className="block cursor-pointer indent-5 text-sm leading-9 text-gray-500 dark:bg-gray-900 dark:text-white md:relative md:indent-0 md:text-base md:leading-6 md:text-gray-800 md:hover:text-primary md:dark:hover:text-point">
                {renderMenuLink(menu)}
              </span>
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
    // setGrafanaTheme(newTheme as "dark" | "light")

    // document.documentElement.className = newTheme

    setCookie("theme", newTheme, 30)

    window.location.reload()
  }

  useEffect(() => {
    const savedTheme = initialTheme ?? "light"
    setTheme(savedTheme)
    setGrafanaTheme(savedTheme as "dark" | "light")
    document.documentElement.className = savedTheme
  }, [])

  return (
    <div className="flex items-center">
      {/* 햄버거 버튼 */}
      <button
        type="button"
        className="block h-8 w-8 md:hidden"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
      </button>

      {/* 로고 */}
      <Link href={LOGIN_DEFAULT_PAGE}>
        <Image
          src="/logo_w.svg"
          width={130}
          height={40}
          alt="Logo"
          className="mr-2 h-8 md:mr-4 lg:mr-6"
        />
      </Link>

      {/* 데스크톱 메뉴 */}
      <nav className="relative hidden space-x-2 md:mr-6 md:flex lg:space-x-6">
        {menuData
          .filter((item) => item.upper_menu_id === null)
          .map((menu) => (
            <div
              key={menu.menu_id}
              onMouseEnter={!isMobile ? () => handleMouseEnter(menu.menu_id, 0) : undefined}
              onMouseLeave={!isMobile ? handleMouseLeave : undefined}
              className="gnb_menu relative"
            >
              <button
                type="button"
                className={`h-16 px-4 py-2 ${
                  activeMenus.includes(menu.menu_id)
                    ? "border-b-2 border-point !text-point hover:!text-point"
                    : "border-b-2 border-transparent"
                }`}
              >
                {renderMenuLink(menu)}
              </button>
              {renderSubMenu(menu.menu_id, 1)}
            </div>
          ))}
      </nav>

      {/* 다크모드 토글 */}
      <FormControlLabel
        control={
          <MaterialUISwitch sx={{ m: 1 }} onChange={toggleTheme} checked={theme !== "light"} />
        }
        label=""
      />

      {/* 모바일 메뉴 */}
      {isMobile && isMenuOpen && (
        <nav className="fixed left-0 top-16 z-10 h-[calc(100vh-64px)] w-full overflow-y-auto bg-gray-200 pb-10 dark:bg-gray-900 md:hidden">
          <ul>
            {menuData
              .filter((item) => item.upper_menu_id === null)
              .map((menu) => {
                const hasSubMenu = menuData.some((item) => item.upper_menu_id === menu.menu_id)
                const isActive = activeMenus.includes(menu.menu_id)

                return (
                  <li key={menu.menu_id} className="relative">
                    {hasSubMenu ? (
                      <button
                        type="button"
                        onClick={() => handleMenuClick(menu.menu_id)}
                        className={`flex w-full justify-between bg-white px-5 py-3 pr-4 text-gray-800 dark:bg-gray-700 dark:text-white ${
                          isActive ? "text-primary" : ""
                        }`}
                      >
                        {menu.menu_name}
                        <span>
                          {isActive ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        </span>
                      </button>
                    ) : (
                      <a
                        href={menu.url ?? "#"}
                        className="flex w-full justify-between bg-white px-5 py-3 pr-4 text-gray-800 dark:bg-gray-700 dark:text-white"
                      >
                        {menu.menu_name}
                      </a>
                    )}
                    {/* 하위 메뉴 */}
                    {isActive && renderSubMenu(menu.menu_id, 2)}
                  </li>
                )
              })}
          </ul>
        </nav>
      )}
    </div>
  )
}
