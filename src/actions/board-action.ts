"use server"

import { postgres } from "@/config/db"
import { BoardType } from "@/types/board"

export async function getMiniBoardList({ section }: Partial<BoardType>) {
  const { rows } = await postgres.query<Partial<BoardType>>(
    `
    SELECT *
    FROM boards
    WHERE section = $1
    ORDER BY create_date DESC
    LIMIT 3
  `,
    [section],
  )
  return rows
}

export async function getBoardList({
  section,
  rowsPerPage,
  page,
  count,
}: {
  section: string
  rowsPerPage: number
  page: number
  count?: number
}) {
  const totalResult = await postgres.query<{ count: number }>(
    `
    SELECT COUNT(*) as count
    FROM boards
    WHERE section = $1
    `,
    [section],
  )

  const totalItems = totalResult.rows[0].count
  const totalPages = Math.ceil(totalItems / rowsPerPage)

  const offset = (page - 1) * rowsPerPage

  const { rows } = await postgres.query<Partial<BoardType>>(
    `
    SELECT *
    FROM boards
    WHERE section = $1
    ORDER BY create_date DESC
    LIMIT $2 OFFSET $3
  `,
    [section, rowsPerPage, offset],
  )
  return {
    data: count ? rows.splice(0, count) : rows,
    currentPage: page,
    totalPages,
  }
}

export async function insertBoard({
  section,
  title,
  content,
  create_user_id,
}: Omit<BoardType, "id" | "delete_flag" | "create_date" | "modify_date">) {
  const { rowCount } = await postgres.query(
    `
    INSERT INTO boards (section, title, content, create_user_id, delete_flag, create_date)
    VALUES ($1, $2, $3, $4, FALSE, CURRENT_TIMESTAMP)
    `,
    [section, title, content, create_user_id],
  )
  return !!rowCount // 성공 여부 반환
}

export async function updateBoard({
  id,
  title,
  content,
}: Pick<BoardType, "id" | "title" | "content">) {
  const { rowCount } = await postgres.query(
    `
    UPDATE boards
    SET title = $1,
        content = $2,
        modify_date = CURRENT_TIMESTAMP
    WHERE id = $3
    `,
    [title, content, id],
  )
  return !!rowCount // 성공 여부 반환
}

export async function deleteBoard({ id }: Pick<BoardType, "id">) {
  const { rowCount } = await postgres.query(
    `
    DELETE FROM boards WHERE id = $1
    `,
    [id],
  )
  return !!rowCount // 성공 여부 반환
}

export async function getArticleById({ id }: Pick<BoardType, "id">) {
  const { rows } = await postgres.query<Partial<BoardType>>(
    `
    SELECT *
    FROM boards
    WHERE id = $1
  `,
    [id],
  )
  return rows[0]
}
