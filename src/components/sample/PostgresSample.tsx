import { postgres } from "@/utils/db"

interface PostgresData {
  cnt: string
}

async function getPostgresData() {
  const { rows } = await postgres.query<PostgresData>("SELECT count(1)::text as cnt FROM users")
  return rows[0]
}

async function PostgresSample() {
  const data = await getPostgresData()

  return (
    <div>
      <h3>PostgreSQL 통계</h3>
      <p>users 수: {data.cnt}</p>
      <p>query: SELECT count(1)::text as cnt FROM users</p>
    </div>
  )
}

export { PostgresSample }
