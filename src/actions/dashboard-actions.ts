import { postgres } from "@/config/db"

export async function fetchTodos() {
  const { rows } = await postgres.query("SELECT * FROM todos")
  return rows
}

export async function addTodo(text: string) {
  const { rows } = await postgres.query("INSERT INTO todos (text) VALUES ($1) RETURNING *", [text])
  return rows[0]
}
