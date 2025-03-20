"use server"

import { postgres } from "@/config/db"
import { getParenthesisNumStr } from "@/helpers/sql.helper"
import { SystemConfigType } from "@/types/systemConfig"

export async function getCmsInfo() {
  const keys = ["INIT_MAIN_LOGO", "INIT_MAIN_BG", "INIT_MAIN_TITLE", "INIT_MAIN_SUBTITLE"]
  const { rows } = await postgres.query<SystemConfigType>(
    `
    SELECT
      config_name, value1, value2, value6
    FROM comdb.tbd_com_conf_systemconfig
    WHERE config_name IN ${getParenthesisNumStr(keys)}
  `,
    keys,
  )
  return rows
}

export async function getCmsMainInfo() {
  const keys = ["INIT_MAIN_LOGO", "INIT_MAIN_BG", "INIT_MAIN_TITLE", "INIT_MAIN_SUBTITLE"]
  const { rows } = await postgres.query<SystemConfigType>(
    `
    SELECT
      config_name, value1, value2, value6
    FROM comdb.tbd_com_conf_systemconfig
    WHERE config_name IN ${getParenthesisNumStr(keys)}
  `,
    keys,
  )
  return rows
}

export async function updateMainCms({
  bg,
  logo,
  mainTitle,
  subTitle,
}: {
  bg: string
  logo: string
  mainTitle: string
  subTitle: string
}) {
  console.log("updateMainCms!!!")
  const cmsData = [
    {
      config_name: "INIT_MAIN_LOGO",
      value1: "image",
      value2: "메인 가운데 로고 /public/logo_w_main.png",
      value6: logo,
    },
    {
      config_name: "INIT_MAIN_BG",
      value1: "image",
      value2: "메인 가운데 백그라운드 이미지 /public/login_bg_main.png",
      value6: bg,
    },
    {
      config_name: "INIT_MAIN_TITLE",
      value1: "text",
      value2: "메인 가운데 타이틀",
      value6: mainTitle,
    },
    {
      config_name: "INIT_MAIN_SUBTITLE",
      value1: "text",
      value2: "메인 가운데 서브타이틀",
      value6: subTitle,
    },
  ]
  const prevCms = await getCmsMainInfo()
  cmsData.forEach(async (d) => {
    let params = []
    let query = ""
    if (
      prevCms.some((cms) => {
        return cms.config_name === d.config_name
      })
    ) {
      params = [d.value1, d.value2, d.value6, d.config_name]
      query = `
        UPDATE comdb.tbd_com_conf_systemconfig
        SET value1 = $1,
            value2 = $2,
            value6 = $3,
            modify_date = CURRENT_TIMESTAMP
        WHERE config_name = $4
      `
    } else {
      params = [d.config_name, d.value1, d.value2, d.value6]
      query = `
        INSERT INTO comdb.tbd_com_conf_systemconfig (config_name, value1, value2, value6)
        VALUES ($1, $2, $3, $4)
      `
    }
    await postgres.query(query, params)
  })
  // updateResource()
  return true
}
