export type CommonCode = {
  category: string
  code: string
  code_name: string
  use_yn: string
  sort_order: number
  remarks: string
}

export type CommonCodeEdit = CommonCode & {
  key?: string
  flag?: "add" | "update" | "del"
}
