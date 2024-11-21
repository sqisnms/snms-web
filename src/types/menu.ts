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
}

export type BreadcrumbType = {
  menu_id: string
  url: string | null
  path_names: string[]
}
