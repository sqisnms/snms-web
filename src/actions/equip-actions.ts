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

export async function getEquipByTypeCode({ equip_type_code }: Partial<EquipType>) {
  const { rows } = await postgres.query<Partial<EquipType>>(
    `
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
    WHERE EQUIP_TYPE_CODE = $1
    ORDER BY EQUIP_NAME
  `,
    [equip_type_code],
  )
  return rows
}
