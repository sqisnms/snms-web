"use server"

import { postgres } from "@/config/db"
import { BoardType } from "@/types/board"

export async function getMiniBoardList({ section }: Partial<BoardType>) {
  const { rows } = await postgres.query<Partial<BoardType>>(
    `
    SELECT *
    FROM comdb.tbd_com_info_board
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
    FROM comdb.tbd_com_info_board
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
    FROM comdb.tbd_com_info_board
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
    INSERT INTO comdb.tbd_com_info_board (section, title, content, create_user_id, delete_flag, create_date)
    VALUES ($1, $2, $3, $4, FALSE, CURRENT_TIMESTAMP)
    `,
    [section, title, content, create_user_id],
  )
  return !!rowCount // 성공 여부 반환
}

export async function updateBoard({
  board_seq,
  title,
  content,
}: Pick<BoardType, "board_seq" | "title" | "content">) {
  const { rowCount } = await postgres.query(
    `
    UPDATE comdb.tbd_com_info_board
    SET title = $1,
        content = $2,
        modify_date = CURRENT_TIMESTAMP
    WHERE board_seq = $3
    `,
    [title, content, board_seq],
  )
  return !!rowCount // 성공 여부 반환
}

export async function deleteBoard({ board_seq }: Pick<BoardType, "board_seq">) {
  const { rowCount } = await postgres.query(
    `
    DELETE FROM comdb.tbd_com_info_board WHERE board_seq = $1
    `,
    [board_seq],
  )
  return !!rowCount // 성공 여부 반환
}

export async function getArticleById({ board_seq }: Pick<BoardType, "board_seq">) {
  const { rows } = await postgres.query<Partial<BoardType>>(
    `
    SELECT *
    FROM comdb.tbd_com_info_board
    WHERE board_seq = $1
  `,
    [board_seq],
  )
  return rows[0]
}
