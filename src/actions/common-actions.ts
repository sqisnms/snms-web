"use server"

import { clickhouse, postgres } from "@/config/db"
import { CommonCode } from "@/types/commonCode"

// postgres COMDB
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

// clickhouse COMDB
export async function getCodeCH({ category }: Partial<CommonCode>) {
  const logResult = await clickhouse.query({
    query: `
    SELECT * FROM COMDB.TBD_COM_CODE_MAST
    WHERE category = {category: String}
    `,
    format: "JSONEachRow",
    query_params: {
      category,
    },
  })
  const logResultJson = await logResult.json()
  const logResults = logResultJson as Partial<CommonCode>[]

  return logResults
}
