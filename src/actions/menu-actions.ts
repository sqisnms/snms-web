"use server"

import { postgres } from "@/config/db"
import { BreadcrumbType, MenuEdit, MenuType } from "@/types/menu"

export async function getMenu() {
  const { rows: menuData } = await postgres.query<MenuType>(`
    WITH RECURSIVE menu_tree AS (
      SELECT
        MENU_ID,
        UPPER_MENU_ID,
        MENU_NAME,
        URL,
        MENU_ORDER,
        LEAF_NODE_YN_CODE,
        POP_UP_YN_CODE,
        SCREEN_WIDTH,
        SCREEN_HEIGHT,
        USE_YN_CODE
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
        child.LEAF_NODE_YN_CODE,
        child.POP_UP_YN_CODE,
        child.SCREEN_WIDTH,
        child.SCREEN_HEIGHT,
        child.USE_YN_CODE
      FROM COMDB.TBD_COM_CONF_MENU child
      JOIN menu_tree parent ON parent.MENU_ID = child.UPPER_MENU_ID
      WHERE COALESCE(child.USE_YN_CODE, 'N') = 'Y'
    )
    SELECT
      m.MENU_ID,
      m.UPPER_MENU_ID,
      m.MENU_NAME,
      m.URL,
      m.MENU_ORDER,
      m.LEAF_NODE_YN_CODE,
      m.POP_UP_YN_CODE,
      m.SCREEN_WIDTH,
      m.SCREEN_HEIGHT,
      m.USE_YN_CODE,
      ARRAY_REMOVE(ARRAY_AGG(r.role_name), NULL) AS role_names,
      ARRAY_REMOVE(ARRAY_AGG(r.role_id), NULL) AS role_ids
    FROM menu_tree as m
    left join COMDB.TBD_COM_CONF_MENUROLE as mr on m.menu_id = mr.menu_id
    left join COMDB.TBD_COM_CONF_ROLE as r on r.role_id = mr.role_id
    GROUP BY
      m.MENU_ID,
      m.UPPER_MENU_ID,
      m.MENU_NAME,
      m.URL,
      m.MENU_ORDER,
      m.LEAF_NODE_YN_CODE,
      m.POP_UP_YN_CODE,
      m.SCREEN_WIDTH,
      m.SCREEN_HEIGHT,
      m.USE_YN_CODE
    ORDER BY m.UPPER_MENU_ID NULLS FIRST, m.MENU_ORDER
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

export async function getMenuByMenuId({ menu_id }: { menu_id: string }) {
  const { rows } = await postgres.query<Partial<MenuType>>(
    `
    SELECT
      m.MENU_ID,
      m.UPPER_MENU_ID,
      m.MENU_NAME,
      m.URL,
      m.MENU_ORDER,
      m.LEAF_NODE_YN_CODE,
      m.POP_UP_YN_CODE,
      m.SCREEN_WIDTH,
      m.SCREEN_HEIGHT,
      m.USE_YN_CODE,
      ARRAY_REMOVE(ARRAY_AGG(r.role_name), NULL) AS role_names,
      ARRAY_REMOVE(ARRAY_AGG(r.role_id), NULL) AS role_ids
    FROM COMDB.TBD_COM_CONF_MENU as m
    left join COMDB.TBD_COM_CONF_MENUROLE as mr on m.menu_id = mr.menu_id
    left join COMDB.TBD_COM_CONF_ROLE as r on r.role_id = mr.role_id
    WHERE m.MENU_ID = $1
    GROUP BY
      m.MENU_ID,
      m.UPPER_MENU_ID,
      m.MENU_NAME,
      m.URL,
      m.MENU_ORDER,
      m.LEAF_NODE_YN_CODE,
      m.POP_UP_YN_CODE,
      m.SCREEN_WIDTH,
      m.SCREEN_HEIGHT,
      m.USE_YN_CODE
  `,
    [menu_id],
  )
  return rows?.[0] ?? {}
}

export async function updateMenu(changes: MenuEdit) {
  const {
    menu_id,
    upper_menu_id,
    menu_name,
    url,
    menu_order,
    leaf_node_yn_code,
    pop_up_yn_code,
    screen_width,
    screen_height,
    use_yn_code,
  } = changes

  await postgres.query(
    `INSERT INTO COMDB.TBD_COM_CONF_MENU (
      MENU_ID, UPPER_MENU_ID, MENU_NAME, URL, MENU_ORDER, LEAF_NODE_YN_CODE,
      POP_UP_YN_CODE, SCREEN_WIDTH, SCREEN_HEIGHT, USE_YN_CODE
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    ON CONFLICT (MENU_ID)
    DO UPDATE SET
          UPPER_MENU_ID = $2, MENU_NAME = $3, URL = $4, MENU_ORDER = $5, LEAF_NODE_YN_CODE = $6,
          POP_UP_YN_CODE = $7, SCREEN_WIDTH = $8, SCREEN_HEIGHT = $9, USE_YN_CODE = $10
    `,
    [
      menu_id,
      upper_menu_id,
      menu_name,
      url,
      menu_order,
      leaf_node_yn_code,
      pop_up_yn_code,
      screen_width,
      screen_height,
      use_yn_code,
    ],
  )
}

export async function deleteMenu(changes: MenuEdit) {
  const { menu_id } = changes

  await postgres.query(
    `DELETE FROM COMDB.TBD_COM_CONF_MENU
     WHERE MENU_ID = $1
    `,
    [menu_id],
  )
}
