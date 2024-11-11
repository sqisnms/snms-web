export type EquipType = {
  EQUIP_ID: string // 고유Key
  CURRENT_EQUIP_ID: string // 장비ID
  EQUIP_NAME: string // 장비명
  PARENT_EQUIP_ID: string | null // 상위장비 (nullable)
  EQUIP_TYPE_CODE: string // 장비 유형 코드
  NET_TYPE_CODE: string | null // 네트워크 유형 코드 (nullable)
  GENERATION_CODE: string | null // 세대 코드 (nullable)
  VENDOR_CODE: string | null // 벤더 코드 (nullable)
  MODEL_CODE: string | null // 모델 코드 (nullable)
  TEAM_CODE: string | null // 팀 코드 (nullable)
  OPEN_DATE: Date | null // 개통일 (nullable, timestamp -> Date in TypeScript)
  EQUIP_STATUS: string // 장비 상태 코드
  IP_ADDRESS: string | null // IP 주소 (nullable)
  MGR_MAIN_USER: string | null // 주 관리자 ID (nullable)
  MGR_SUB_USER: string | null // 부 관리자 ID (nullable)
  CITY: string | null // 도시 (nullable)
  DISTRICT: string | null // 구/군 (nullable)
  DONG: string | null // 동 (nullable)
  STREET: string | null // 거리 (nullable)
  CREATE_DATE: Date | null // 생성일 (nullable, timestamp -> Date in TypeScript)
  MODIFY_DATE: Date | null // 수정일 (nullable, timestamp -> Date in TypeScript)
}
