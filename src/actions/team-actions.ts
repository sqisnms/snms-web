"use server"

import { postgres } from "@/config/db"
import { TeamNamesType, TeamType } from "@/types/team"
import { UserType } from "@/types/user"

export async function getTeamList() {
  const { rows: teamData } = await postgres.query<TeamType>(`
    WITH RECURSIVE team_tree AS (
      SELECT
        TEAM_CODE,
        TEAM_NAME,
        UPPER_TEAM_CODE,
        UPPER_TEAM_NAME,
        TREE_DEPTH
      FROM COMDB.TBD_COM_ORG_TEAM
      WHERE UPPER_TEAM_CODE IS NULL
      -- AND COALESCE(TEAM_STATUS_CODE, 'U') = 'U'
      UNION ALL
      -- 재귀적으로 하위 노드를 찾음 (RECURSIVE PART)
      SELECT
        child.TEAM_CODE,
        child.TEAM_NAME,
        child.UPPER_TEAM_CODE,
        child.UPPER_TEAM_NAME,
        child.TREE_DEPTH
      FROM COMDB.TBD_COM_ORG_TEAM child
      JOIN team_tree parent ON parent.TEAM_CODE = child.UPPER_TEAM_CODE
      --WHERE COALESCE(TEAM_STATUS_CODE, 'U') = 'U'
    )
    SELECT
      TEAM_CODE,
      TEAM_NAME,
      UPPER_TEAM_CODE,
      UPPER_TEAM_NAME,
      TREE_DEPTH
    FROM team_tree
    ORDER BY UPPER_TEAM_CODE NULLS FIRST, TEAM_CODE
  `)

  const { rows: breadcrumbs } = await postgres.query<TeamNamesType>(`
    WITH RECURSIVE team_tree AS (
      -- leaf_node_yn_code가 'Y'인 노드부터 시작
      SELECT
          TEAM_CODE,
          UPPER_TEAM_CODE,
          TEAM_NAME,
          ARRAY[TEAM_NAME]::varchar[] AS team_names
      FROM COMDB.TBD_COM_ORG_TEAM
      --WHERE COALESCE(TEAM_STATUS_CODE, 'U') = 'U'
      UNION ALL
      SELECT
          child.TEAM_CODE,
          parent.UPPER_TEAM_CODE,
          parent.TEAM_NAME,
          parent.TEAM_NAME || child.team_names
      FROM COMDB.TBD_COM_ORG_TEAM parent
      JOIN team_tree child ON child.UPPER_TEAM_CODE = parent.TEAM_CODE
    )
    SELECT
        TEAM_CODE,
        team_names
    FROM team_tree
    WHERE UPPER_TEAM_CODE IS NULL  -- 최상위 노드까지 추적 완료된 경우만 반환
    ORDER BY TEAM_CODE
  `)
  return { teamData, breadcrumbs }
}

export async function getUsersUnderTeamCode({ code }: { code: string }) {
  const queryParams: string[] = []
  let query = `
    WITH RECURSIVE team_tree AS (
      SELECT TEAM_CODE
      FROM COMDB.TBD_COM_ORG_TEAM
  `

  if (code !== "") {
    query += `WHERE TEAM_CODE = $1`
    queryParams.push(code)
  }

  query += `
      UNION ALL
      SELECT child.TEAM_CODE
      FROM COMDB.TBD_COM_ORG_TEAM child
      JOIN team_tree parent ON child.UPPER_TEAM_CODE = parent.TEAM_CODE
    )
    SELECT
      u.USER_ID,
      u.USER_NAME,
      u.LOGIN_ID,
      u.TITLE,
      u.DUTY_NAME,
      u.BUSINESS,
      u.PCSPHONE,
      u.TEAM_CODE,
      ARRAY_REMOVE(ARRAY_AGG(r.role_name), NULL) AS role_names,
      ARRAY_REMOVE(ARRAY_AGG(r.role_id), NULL) AS role_ids
    FROM COMDB.TBD_COM_ORG_USER as u
    LEFT JOIN COMDB.TBD_COM_CONF_USERROLE as ur ON u.user_id = ur.user_id
    LEFT JOIN COMDB.TBD_COM_CONF_ROLE as r ON r.role_id = ur.role_id
    WHERE u.TEAM_CODE IN (SELECT TEAM_CODE FROM team_tree)
    GROUP BY
      u.USER_ID, u.USER_NAME, u.LOGIN_ID, u.TITLE, u.DUTY_NAME, u.BUSINESS, u.PCSPHONE, u.TEAM_CODE
    ORDER BY u.TEAM_CODE, u.USER_NAME`

  const { rows } = await postgres.query<Partial<UserType>>(query, queryParams)

  const { rows: breadcrumbs } = await postgres.query<TeamNamesType>(`
    WITH RECURSIVE team_tree AS (
      -- leaf_node_yn_code가 'Y'인 노드부터 시작
      SELECT
          TEAM_CODE,
          UPPER_TEAM_CODE,
          TEAM_NAME,
          ARRAY[TEAM_NAME]::varchar[] AS team_names
      FROM COMDB.TBD_COM_ORG_TEAM
      --WHERE COALESCE(TEAM_STATUS_CODE, 'U') = 'U'
      UNION ALL
      SELECT
          child.TEAM_CODE,
          parent.UPPER_TEAM_CODE,
          parent.TEAM_NAME,
          parent.TEAM_NAME || child.team_names
      FROM COMDB.TBD_COM_ORG_TEAM parent
      JOIN team_tree child ON child.UPPER_TEAM_CODE = parent.TEAM_CODE
    )
    SELECT
        TEAM_CODE,
        team_names
    FROM team_tree
    WHERE UPPER_TEAM_CODE IS NULL  -- 최상위 노드까지 추적 완료된 경우만 반환
    ORDER BY TEAM_CODE
  `)

  const rowWithTeams = rows.map((r) => {
    const bInfo = breadcrumbs.find((b) => b.team_code === r.team_code)
    return { ...r, team_tree: bInfo?.team_names }
  })
  return rowWithTeams
}
