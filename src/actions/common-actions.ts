"use server"

import { postgres } from "@/config/db"
import { CommonCode } from "@/types/commonCode"

export async function getCode({ CATEGORY }: Partial<CommonCode>) {
  const { rows } = await postgres.query<Partial<CommonCode>>(
    `
    SELECT "CODE", "CODE_NAME"
    FROM "COMDB"."TBD_COM_CODE_MAST"
    WHERE "CATEGORY" = $1 AND "USE_YN" = $2 ORDER BY "SORT_ORDER"
  `,
    [CATEGORY, "Y"],
  )
  return rows
}
