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
    ORDER BY UPPER_TEAM_CODE NULLS FIRST, TEAM_NAME
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

export async function getUsersByTeamCode({ code }: { code: string }) {
  const { rows } = await postgres.query<Partial<UserType>>(
    `
    SELECT
      USER_ID,
      USER_NAME,
      LOGIN_ID,
      TITLE,
      DUTY_NAME,
      BUSINESS,
      PCSPHONE
    FROM COMDB.TBD_COM_ORG_USER
    WHERE TEAM_CODE = $1
    ORDER BY USER_NAME
  `,
    [code],
  )
  return rows
}
