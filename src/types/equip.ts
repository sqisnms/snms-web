export type EquipType = {
  equip_id: string // 고유key
  current_equip_id: string // 장비id
  equip_name: string // 장비명
  parent_equip_id: string | null // 상위장비 (nullable)
  equip_type_code: string // 장비 유형 코드
  net_type_code: string | null // 네트워크 유형 코드 (nullable)
  generation_code: string | null // 세대 코드 (nullable)
  vendor_code: string | null // 벤더 코드 (nullable)
  model_code: string | null // 모델 코드 (nullable)
  team_code: string | null // 팀 코드 (nullable)
  open_date: Date | null // 개통일 (nullable, timestamp -> date in typescript)
  equip_status: string // 장비 상태 코드
  ip_address: string | null // ip 주소 (nullable)
  mgr_main_user: string | null // 주 관리자 id (nullable)
  mgr_sub_user: string | null // 부 관리자 id (nullable)
  city: string | null // 도시 (nullable)
  district: string | null // 구/군 (nullable)
  dong: string | null // 동 (nullable)
  street: string | null // 거리 (nullable)
  create_date: Date | null // 생성일 (nullable, timestamp -> date in typescript)
  modify_date: Date | null // 수정일 (nullable, timestamp -> date in typescript)
}
