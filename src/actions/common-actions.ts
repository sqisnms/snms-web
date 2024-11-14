"use server"

import { postgres } from "@/config/db"
import { CommonCode } from "@/types/commonCode"

export async function getCode({ category }: Partial<CommonCode>) {
  // console.log("CATEGORY")
  // console.log(CATEGORY)
  const { rows } = await postgres.query<Partial<CommonCode>>(
    `
    SELECT CODE, CODE_NAME
    FROM COMDB.TBD_COM_CODE_MAST
    WHERE CATEGORY = $1 AND COALESCE(USE_YN, 'N') = $2 ORDER BY SORT_ORDER
  `,
    [category, "Y"],
  )
  return rows
}
