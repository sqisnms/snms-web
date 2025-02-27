"use server"

import { clickhouse } from "@/config/db"
import { CMDuDetailType, CMMastType, CMRuDetailType, CMTreeType } from "@/types/cm"

export async function getCMTree() {
  const logResult = await clickhouse.query({
    query: `
    SELECT id, parent_id, level
    FROM CMDB.VI_TBD_CM_APP_EQUIP_TREE
    ORDER BY level ASC
    `,
    format: "JSONEachRow",
  })
  const logResultJson = await logResult.json()
  const logResults = logResultJson as CMTreeType[]

  return {
    treeData: logResults,
  }
}

export async function getCMMast({ code }: { code: string }) {
  const logResult = await clickhouse.query({
    query: `
    SELECT * FROM CMDB.VI_TBD_CM_APP_EQUIP_MAST_LIST
    WHERE current_equip_id = {code: String}
    ORDER BY open_date desc
    `,
    format: "JSONEachRow",
    query_params: { code },
  })
  const logResultJson = await logResult.json()
  const logResults = logResultJson as CMMastType[]

  return logResults
}

export async function getCMDuDetail({ code }: { code: string }) {
  const logResult = await clickhouse.query({
    query: `
    SELECT * FROM CMDB.VI_TBD_CM_APP_EQUIP_DU_LIST_DETAIL
    WHERE ems_id = {code: String}
    ORDER BY open_date desc
    `,
    format: "JSONEachRow",
    query_params: { code },
  })
  const logResultJson = await logResult.json()
  const logResults = logResultJson as CMDuDetailType[]

  return logResults
}

export async function getCMRuDetail({ code }: { code: string }) {
  const logResult = await clickhouse.query({
    query: `
    SELECT * FROM CMDB.VI_TBD_CM_APP_EQUIP_RU_LIST_DETAIL
    WHERE du_id = {code: String}
    ORDER BY open_date desc
    `,
    format: "JSONEachRow",
    query_params: { code },
  })
  const logResultJson = await logResult.json()
  const logResults = logResultJson as CMRuDetailType[]

  return logResults
}
