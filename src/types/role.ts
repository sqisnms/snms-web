export type RoleType = {
  role_id: string
  role_name: string
  role_desc: string
}

export type RoleEdit = RoleType & {
  key?: string
  flag?: "add" | "update" | "del"
}
