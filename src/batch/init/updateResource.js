import fs from "fs/promises"
import path from "path"
import pg from "pg"

const { Pool } = pg

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
})

/** *******************************************
  본 파일은 현재 사용안함. 서버기동시 작업 필요할 경우의 레퍼런스로 남겨둠.
  next.config.mjs 혹은 action 에서 호출 가능
******************************************** */

// config_name: 키
// value1: 타입 (image | text) (text일때는 .env 파일 사용) >> 최종은 참고용
// value2: 위치 (이미지일 경우 경로포함한 파일명, text일 경우 .env 내 키) >> 최종은 참고용
// value6: 내용 (이미지일 경우 base64, text일 경우 문자열) >> 실제 사용할 문자열. 이미지경로 혹은 문구
const doUpdate = (rows) => {
  rows.forEach(async (row) => {
    if (row.value1 === "image") {
      const base64String = row.value6.replace(/^data:[^;]+;base64,/, "")
      const buffer = Buffer.from(base64String, "base64")
      const uint8Array = new Uint8Array(buffer)
      const filePath = path.join(process.cwd(), row.value2)
      await fs.writeFile(filePath, uint8Array)
    } else if (row.value1 === "text") {
      let envFilePath = path.join(process.cwd(), ".env") // 운영
      await fs.access(envFilePath).catch(() => {
        envFilePath = path.join(process.cwd(), ".env.local") // 로컬
      })
      const content = await fs.readFile(envFilePath, "utf-8")
      const lines = content.split("\n")

      let keyExists = false
      const newLines = lines.map((line) => {
        if (line.trim().startsWith(`${row.value2}=`)) {
          keyExists = true
          return `${row.value2}=${row.value6}`
        }
        return line.trim()
      })

      if (!keyExists) {
        newLines.push(`${row.value2}=${row.value6}`)
      }

      await fs.writeFile(envFilePath, newLines.join("\n"))
    }
  })
}

export async function updateEachResource(key) {
  try {
    const result = await pool.query(
      `SELECT
        config_name, value1, value2, value6
      FROM comdb.tbd_com_conf_systemconfig
      WHERE config_name = $1`,
      [key],
    )

    if (!result.rows || result.rows === 0) {
      console.log(`updateEachResource no data : ${key}`)
    } else {
      doUpdate(result.rows)
      console.log(`updateEachResource done : ${key}`)
    }
  } catch (error) {
    console.error("Error updateEachResource:", error)
    throw error
  }
}

export async function updateResource() {
  const arr = ["INIT_MAIN_LOGO", "INIT_MAIN_BG", "INIT_MAIN_TITLE", "INIT_MAIN_SUBTITLE"]

  // forEach 는 비동기, for .. of 는 동기
  /* eslint-disable no-restricted-syntax, no-await-in-loop */
  for (const key of arr) {
    await updateEachResource(key)
  }
  /* eslint-enable no-restricted-syntax, no-await-in-loop */
}
