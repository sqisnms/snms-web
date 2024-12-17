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

export async function updateUserRole({
  user_id,
  role_ids,
}: {
  user_id: string
  role_ids: string[] | null
}) {
  const client = await postgres.connect()

  try {
    // 트랜잭션 시작
    await client.query("BEGIN")

    // 기존 user_id에 대한 데이터 삭제
    await client.query(`DELETE FROM COMDB.TBD_COM_CONF_USERROLE WHERE USER_ID = $1`, [user_id])

    // role_ids가 null이 아니고, 빈 배열이 아닐 경우에만 삽입
    if (role_ids && role_ids.length > 0) {
      role_ids.map(async (role_id) => {
        await client.query(
          `INSERT INTO COMDB.TBD_COM_CONF_USERROLE (USER_ID, ROLE_ID, CREATE_DATE) VALUES ($1, $2, NOW())`,
          [user_id, role_id],
        )
      })
    }

    // 트랜잭션 커밋
    await client.query("COMMIT")
  } catch (error) {
    // 오류 발생 시 롤백
    await client.query("ROLLBACK")
    throw error
  } finally {
    client.release()
  }
}

export async function deleteUserRole({ user_id, role_id }: { user_id: string; role_id: string }) {
  await postgres.query(
    `DELETE FROM COMDB.TBD_COM_CONF_USERROLE WHERE USER_ID = $1 AND ROLE_ID = $2`,
    [user_id, role_id],
  )
}

export async function updateMenuRole({
  menu_id,
  role_ids,
}: {
  menu_id: string
  role_ids: string[] | null
}) {
  const client = await postgres.connect()

  try {
    // 트랜잭션 시작
    await client.query("BEGIN")

    // 기존 menu_id 대한 데이터 삭제
    await client.query(`DELETE FROM COMDB.TBD_COM_CONF_MENUROLE WHERE MENU_ID = $1`, [menu_id])

    // role_ids가 null이 아니고, 빈 배열이 아닐 경우에만 삽입
    if (role_ids && role_ids.length > 0) {
      role_ids.map(async (role_id) => {
        await client.query(
          `INSERT INTO COMDB.TBD_COM_CONF_MENUROLE (MENU_ID, ROLE_ID, CREATE_DATE) VALUES ($1, $2, NOW())`,
          [menu_id, role_id],
        )
      })
    }

    // 트랜잭션 커밋
    await client.query("COMMIT")
  } catch (error) {
    // 오류 발생 시 롤백
    await client.query("ROLLBACK")
    throw error
  } finally {
    client.release()
  }
}

export async function deleteMenuRole({ menu_id, role_id }: { menu_id: string; role_id: string }) {
  await postgres.query(
    `DELETE FROM COMDB.TBD_COM_CONF_MENUROLE WHERE MENU_ID = $1 AND ROLE_ID = $2`,
    [menu_id, role_id],
  )
}
