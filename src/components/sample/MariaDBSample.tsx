import { mariadb } from "@/utils/db"

interface MariaDBData {
  cnt: string
}

async function getMariaDBData() {
  try {
    const result = (await mariadb.execute(
      "select count(1) as cnt from TBD_DC_CMD_PARAMETER",
    )) as unknown
    const [rows] = result as [MariaDBData[]]
    return rows[0]
  } catch (error) {
    console.error("MariaDB 쿼리 실행 중 오류:", error)
    throw error
  }
}

export async function MariaDBSample() {
  const data = await getMariaDBData()

  return (
    <div>
      <h3>MariaDB 통계</h3>
      <p>TBD_DC_CMD_PARAMETER 수: {data.cnt}</p>
      <p>query: select count(1) as cnt from TBD_DC_CMD_PARAMETER </p>
    </div>
  )
}
