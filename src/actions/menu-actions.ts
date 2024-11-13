"use server"

import { postgres } from "@/config/db"
import { MenuType } from "@/types/menu"

export async function getMenu() {
  const { rows } = await postgres.query<MenuType>(`
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
  return rows
}
