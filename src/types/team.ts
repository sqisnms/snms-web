export type TeamType = {
  team_code: string
  team_name: string
  upper_team_code: string
  upper_team_name: string
  tree_depth: number
  team_names: string // 컬럼은 없음
}

export type TeamNamesType = {
  team_code: string
  team_names: string[]
}
