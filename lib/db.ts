// lib/db.ts
import { Pool } from "pg"

// PostgreSQL 연결 설정
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // 환경 변수에서 가져온 연결 URL
})

export default pool // Pool 객체를 내보내서 재사용 가능하게 함
