"use server"

import { postgres } from "@/config/db"
import { BreadcrumbType, MenuType } from "@/types/menu"

export async function getMenu() {
  const { rows: menuData } = await postgres.query<MenuType>(`
    WITH RECURSIVE menu_tree AS (
      SELECT
        MENU_ID,
        UPPER_MENU_ID,
        MENU_NAME,
        URL,
        MENU_ORDER,
        LEAF_NODE_YN_CODE
      FROM COMDB.TBD_COM_CONF_MENU
      WHERE UPPER_MENU_ID IS NULL
      AND COALESCE(USE_YN_CODE, 'N') = 'Y'
      UNION ALL
      -- 재귀적으로 하위 노드를 찾음 (RECURSIVE PART)
      SELECT
        child.MENU_ID,
        child.UPPER_MENU_ID,
        child.MENU_NAME,
        child.URL,
        child.MENU_ORDER,
        child.LEAF_NODE_YN_CODE
      FROM COMDB.TBD_COM_CONF_MENU child
      JOIN menu_tree parent ON parent.MENU_ID = child.UPPER_MENU_ID
      WHERE COALESCE(child.USE_YN_CODE, 'N') = 'Y'
    )
    SELECT
      MENU_ID,
      UPPER_MENU_ID,
      MENU_NAME,
      URL,
      MENU_ORDER,
      LEAF_NODE_YN_CODE
    FROM menu_tree
    ORDER BY UPPER_MENU_ID NULLS FIRST, MENU_ORDER
  `)

  const { rows: breadcrumbs } = await postgres.query<BreadcrumbType>(`
    WITH RECURSIVE menu_tree AS (
      -- leaf_node_yn_code가 'Y'인 노드부터 시작
      SELECT
          MENU_ID,
          UPPER_MENU_ID,
          MENU_NAME,
          URL,
          ARRAY[MENU_NAME]::varchar[] AS path_names
      FROM COMDB.TBD_COM_CONF_MENU
      WHERE leaf_node_yn_code = 'Y'
        AND COALESCE(USE_YN_CODE, 'N') = 'Y'
      UNION ALL
      -- 상위 메뉴로 재귀적으로 연결하면서 path_names 배열에 메뉴명을 추가
      SELECT
          parent.MENU_ID,
          parent.UPPER_MENU_ID,
          parent.MENU_NAME,
          child.URL,
          parent.MENU_NAME || child.path_names
      FROM COMDB.TBD_COM_CONF_MENU parent
      JOIN menu_tree child ON child.UPPER_MENU_ID = parent.MENU_ID
      --WHERE COALESCE(parent.USE_YN_CODE, 'N') = 'Y'
  )
  SELECT
      MENU_ID,
      URL,
      path_names
  FROM menu_tree
  WHERE UPPER_MENU_ID IS NULL  -- 최상위 노드까지 추적 완료된 경우만 반환
  ORDER BY MENU_ID
  `)
  return { menuData, breadcrumbs }
}
