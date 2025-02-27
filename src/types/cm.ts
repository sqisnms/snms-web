export type CMTreeType = {
  id: string
  parent_id: string | null
  level: number
}

export type CMMastType = {
  equip_id: string
  current_equip_id: string
  equip_name: string
  vendor_code: string
  upper_team_name: string | null
  team_name: string
  open_date: Date
  ip_address: string | null
  address: string | null
}

export type CMDuDetailType = {
  ems_id: string
  current_equip_id: string
  equip_name: string
  vendor_code: string
  generation_code: string
  upper_team_name: string | null
  team_name: string
  open_date: Date
  ip_address: string | null
  address: string | null
  user_name: string
  pcsphone: string | null
}

export type CMRuDetailType = {
  du_id: string
  ru_id: string
  equip_name: string
  vendor_code: string
  generation_code: string
  cell_no: number | null
  cell_fdd_id: string
  global_cell_id: number
  upper_team_name: string | null
  team_name: string
  open_date: Date
  ip_address: string | null
  address: string | null
  user_name: string
  pcsphone: string | null
}
