export type CommonCode = {
  CATEGORY: string
  CODE: string
  CODE_NAME: string
  USE_YN: string
  SORT_ORDER: number
  REMARKS: string
}

export type CommonCodeEdit = CommonCode & {
  key?: string
  flag?: "add" | "update" | "del"
}
