export type MenuType = {
  menu_id: string
  upper_menu_id: string | null
  menu_name: string
  url: string | null
  menu_order: number | null
  leaf_node_yn_code: string | null
  pop_up_yn_code: string | null
  screen_width: number | null
  screen_height: number | null
  use_yn_code: string | null

  role_names?: string[]
  role_ids?: string[]
}

export type MenuEdit = MenuType & {
  key?: string
  flag?: "add" | "update" | "del"
}

export type BreadcrumbType = {
  menu_id: string
  url: string | null
  path_names: string[]
}
