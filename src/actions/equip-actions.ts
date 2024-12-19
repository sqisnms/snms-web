"use server"

import { postgres } from "@/config/db"
import { EquipType } from "@/types/equip"

export async function getEquipList() {
  const { rows } = await postgres.query<Partial<EquipType>>(`
    SELECT
        NET_TYPE_CODE,
        EQUIP_TYPE_CODE,
        EQUIP_ID,
        EQUIP_NAME
    FROM
        COMDB.TBD_COM_EQUIP_MAST
    ORDER BY
        NET_TYPE_CODE,
        EQUIP_TYPE_CODE,
        EQUIP_NAME
  `)
  return rows
}

export async function getEquipByTypeCode({
  equip_type_code,
  net_type_code,
  allYN,
}: {
  equip_type_code: string
  net_type_code: string
  allYN: string
}) {
  let query = `
  SELECT
    EQUIP_ID,
    CURRENT_EQUIP_ID,
    EQUIP_NAME,
    PARENT_EQUIP_ID,
    EQUIP_TYPE_CODE,
    NET_TYPE_CODE,
    GENERATION_CODE,
    VENDOR_CODE,
    MODEL_CODE,
    TEAM_CODE,
    OPEN_DATE,
    EQUIP_STATUS,
    IP_ADDRESS,
    MGR_MAIN_USER,
    MGR_SUB_USER,
    CITY,
    DISTRICT,
    DONG,
    STREET,
    CREATE_DATE,
    MODIFY_DATE
  FROM COMDB.TBD_COM_EQUIP_MAST
`

  // WHERE 조건 배열
  const whereConditions: string[] = []
  const queryParams: string[] = []

  // 조건 추가 (allYN이 "Y"가 아니면 조건을 추가)
  if (allYN !== "Y") {
    if (net_type_code) {
      whereConditions.push(`NET_TYPE_CODE = $${queryParams.length + 1}`)
      queryParams.push(net_type_code)
    }

    if (equip_type_code) {
      whereConditions.push(`EQUIP_TYPE_CODE = $${queryParams.length + 1}`)
      queryParams.push(equip_type_code)
    }
  }

  // WHERE 절 추가
  if (whereConditions.length > 0) {
    query += ` WHERE ${whereConditions.join(" AND ")}`
  }

  // ORDER BY 추가
  query += ` ORDER BY NET_TYPE_CODE, EQUIP_TYPE_CODE, EQUIP_NAME`

  // 쿼리 실행
  const { rows } = await postgres.query<Partial<EquipType>>(query, queryParams)

  return rows
}
