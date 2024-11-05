"use server"

import { postgres } from "@/config/db"
import { CommonCode, CommonCodeEdit } from "@/types/commonCode"

export async function getCodeList() {
  const { rows } = await postgres.query<CommonCode>(`
    select "CATEGORY", "CODE", "CODE_NAME", "USE_YN", "SORT_ORDER", "REMARKS" from "COMDB"."TBD_COM_CODE_MAST"
    where "USE_YN" = 'Y'
    order by "CATEGORY", "SORT_ORDER"
  `)
  return rows
}

// 코드 업데이트
export async function updateCode(changes: CommonCodeEdit[]) {
  const { queries, params } = changes.reduce(
    (acc, change) => {
      const { CATEGORY, CODE, CODE_NAME, USE_YN, SORT_ORDER, REMARKS, flag } = change

      switch (flag) {
        case "add":
          acc.queries.push(`
            INSERT INTO "COMDB"."TBD_COM_CODE_MAST" ("CATEGORY", "CODE", "CODE_NAME", "USE_YN", "SORT_ORDER", "REMARKS")
            VALUES ($1, $2, $3, $4, $5, $6)
          `)
          acc.params.push([CATEGORY, CODE, CODE_NAME, USE_YN, SORT_ORDER, REMARKS])
          break

        case "update":
          acc.queries.push(`
            UPDATE "COMDB"."TBD_COM_CODE_MAST"
            SET "CODE_NAME" = $3, "USE_YN" = $4, "SORT_ORDER" = $5, "REMARKS" = $6
            WHERE "CATEGORY" = $1 AND "CODE" = $2
          `)
          acc.params.push([CATEGORY, CODE, CODE_NAME, USE_YN, SORT_ORDER, REMARKS])
          break

        case "del":
          acc.queries.push(`
            DELETE FROM "COMDB"."TBD_COM_CODE_MAST"
            WHERE "CATEGORY" = $1 AND "CODE" = $2
          `)
          acc.params.push([CATEGORY, CODE])
          break

        default:
          throw new Error(`Invalid flag: ${flag}`)
      }

      return acc
    },
    { queries: [], params: [] } as { queries: string[]; params: (string | number)[][] },
  )

  const saves = queries.map((query, index) => {
    return postgres.query(query, params[index])
  })

  await Promise.all(saves)

  // // 모든 쿼리를 하나의 문자열로 결합
  // const combinedQuery = queries.join(";")

  // // 트랜잭션 실행
  // try {
  //   await postgres.query("BEGIN")
  //   await postgres.query(combinedQuery, params)
  //   await postgres.query("COMMIT")
  // } catch (error) {
  //   await postgres.query("ROLLBACK")
  //   throw error
  // }
}
