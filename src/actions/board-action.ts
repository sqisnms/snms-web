"use server"

import { postgres } from "@/config/db"
import { BoardType, CommentType } from "@/types/board"
import { getCurrentUser } from "./account-actions"

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
  const totalPages = totalItems * 1 === 0 ? 1 : Math.ceil(totalItems / rowsPerPage)

  const offset = (page - 1) * rowsPerPage

  const { rows } = await postgres.query<Partial<BoardType>>(
    `
    SELECT
      b.board_seq, b.title, b.content, b.create_date
      , u.user_name as create_user_name, b.create_user_id
    FROM comdb.tbd_com_info_board b
    left join comdb.tbd_com_org_user u on b.create_user_id = u.user_id
    WHERE b.section = $1
    ORDER BY b.create_date DESC
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

export async function updateBoard({
  board_seq,
  section,
  title,
  content,
}: Pick<BoardType, "board_seq" | "section" | "title" | "content">) {
  const currentUser = await getCurrentUser() // 유저 정보
  const user_id = currentUser?.user_id

  if (!user_id) return null

  const params = board_seq
    ? [title, content, user_id, board_seq]
    : [section, title, content, user_id]
  const query = board_seq
    ? `
    UPDATE comdb.tbd_com_info_board
    SET title = $1,
        content = $2,
        create_user_id = $3,
        modify_date = CURRENT_TIMESTAMP
    WHERE board_seq = $4
  `
    : `
    INSERT INTO comdb.tbd_com_info_board (section, title, content, create_user_id, delete_flag, create_date)
    VALUES ($1, $2, $3, $4, 0, CURRENT_TIMESTAMP)
  `
  const { rowCount } = await postgres.query(query, params)
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
    SELECT
      b.board_seq, b.title, b.content, b.create_date
      , u.user_name as create_user_name, b.create_user_id
    FROM comdb.tbd_com_info_board b
    left join comdb.tbd_com_org_user u on b.create_user_id = u.user_id
    WHERE b.board_seq = $1
  `,
    [board_seq],
  )
  return rows[0]
}

export async function getCommentList({
  board_seq,
  rowsPerPage,
  page,
  count,
}: {
  board_seq: string
  rowsPerPage: number
  page: number
  count?: number
}) {
  const totalResult = await postgres.query<{ count: number }>(
    `
    SELECT COUNT(*) as count
    FROM comdb.tbd_com_info_boarddetail
    WHERE board_seq = $1
    `,
    [board_seq],
  )

  const totalItems = totalResult.rows[0].count
  const totalPages = totalItems * 1 === 0 ? 1 : Math.ceil(totalItems / rowsPerPage)

  const offset = (page - 1) * rowsPerPage

  const { rows } = await postgres.query<Partial<CommentType>>(
    `
    SELECT
      b.board_seq, b.board_sub_seq, b.content, b.create_date
      , u.user_name as create_user_name, b.create_user_id
    FROM comdb.tbd_com_info_boarddetail b
    left join comdb.tbd_com_org_user u on b.create_user_id = u.user_id
    WHERE b.board_seq = $1
    ORDER BY b.create_date DESC
    LIMIT $2 OFFSET $3
  `,
    [board_seq, rowsPerPage, offset],
  )
  return {
    data: count ? rows.splice(0, count) : rows,
    currentPage: page,
    totalPages,
  }
}

export async function updateComment({
  board_seq,
  board_sub_seq,
  content,
}: Pick<CommentType, "board_seq" | "board_sub_seq" | "content">) {
  const currentUser = await getCurrentUser() // 유저 정보
  const user_id = currentUser?.user_id

  if (!user_id) return null

  const params = board_sub_seq
    ? [content, user_id, board_seq, board_sub_seq]
    : [content, user_id, board_seq]
  const query = board_sub_seq
    ? `
    UPDATE comdb.tbd_com_info_boarddetail
    SET content = $1,
        create_user_id = $2,
        modify_date = CURRENT_TIMESTAMP
    WHERE board_seq = $3 and board_sub_seq = $4
  `
    : `
    INSERT INTO comdb.tbd_com_info_boarddetail (board_seq, board_sub_seq, content, create_user_id, delete_flag, create_date)
    VALUES ($3,
      (select coalesce(max(board_sub_seq) + 1, 1) from comdb.tbd_com_info_boarddetail where board_seq = $3),
      $1, $2, 0, CURRENT_TIMESTAMP)
  `
  const { rowCount } = await postgres.query(query, params)
  return !!rowCount // 성공 여부 반환
}

export async function deleteComment({
  board_seq,
  board_sub_seq,
}: Pick<CommentType, "board_seq" | "board_sub_seq">) {
  const { rowCount } = await postgres.query(
    `
    DELETE FROM comdb.tbd_com_info_boarddetail WHERE board_seq = $1 AND board_sub_seq = $2
    `,
    [board_seq, board_sub_seq],
  )
  return !!rowCount // 성공 여부 반환
}
