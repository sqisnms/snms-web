"use server"

import { postgres } from "@/config/db"
import { RoleEdit, RoleType } from "@/types/role"

export async function getRoleList() {
  const { rows } = await postgres.query<RoleType>(`
    select ROLE_ID, ROLE_NAME, ROLE_DESC from COMDB.TBD_COM_CONF_ROLE
    order by ROLE_ID
  `)
  return rows
}

// 권한 업데이트
export async function updateRole(changes: RoleEdit[]) {
  const { queries, params } = changes.reduce(
    (acc, change) => {
      const { role_id, role_name, role_desc, flag } = change

      switch (flag) {
        case "add":
          acc.queries.push(`
            INSERT INTO COMDB.TBD_COM_CONF_ROLE (ROLE_ID, ROLE_NAME, ROLE_DESC)
            VALUES ($1, $2, $3)
          `)
          acc.params.push([role_id, role_name, role_desc])
          break

        case "update":
          acc.queries.push(`
            UPDATE COMDB.TBD_COM_CONF_ROLE
            SET ROLE_NAME = $2, ROLE_DESC = $3
            WHERE ROLE_ID = $1
          `)
          acc.params.push([role_id, role_name, role_desc])
          break

        case "del":
          acc.queries.push(`
            DELETE FROM COMDB.TBD_COM_CONF_ROLE
            WHERE ROLE_ID = $1
          `)
          acc.params.push([role_id])
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
}
