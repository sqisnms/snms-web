export type BoardType = {
  board_seq: string // 게시물 고유 ID
  section: string // 게시판 섹션 (NOTICE, FAQ, QNA 등)
  title: string // 게시물 제목
  content: string // 게시물 내용
  create_user_id: string // 작성자 ID
  delete_flag: boolean // 삭제 여부 (TRUE: 삭제됨)
  create_date: string // 생성일자 (ISO 형식의 문자열)
  modify_date?: string // 수정일자 (수정된 경우에만 존재할 수 있음)

  create_user_name?: string // 작성자 이름
}
