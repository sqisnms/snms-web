export type IncidentLogType = {
  log_level: string
  event_time: string
  log_message: string
  log_file: string
  log_time: string
}

export type IncidentLogColumnType = { key: keyof IncidentLogType; name: string; text?: boolean }

export const IncidentLogTypeKor: IncidentLogColumnType[] = [
  { key: "log_level", name: "등급" },
  { key: "event_time", name: "일시" },
  { key: "log_message", name: "상세내역", text: true },
  { key: "log_file", name: "위치" },
  { key: "log_time", name: "로그일시" },
]

export type IncidentSysLogType = {
  log_level: string
  event_time: string
  log_message: string
  server_id: string
  log_time: string
}

export type IncidentSysLogColumnType = {
  key: keyof IncidentSysLogType
  name: string
  text?: boolean
}

export const IncidentSysLogTypeKor: IncidentSysLogColumnType[] = [
  { key: "log_level", name: "등급" },
  { key: "event_time", name: "일시" },
  { key: "log_message", name: "상세내역", text: true },
  { key: "server_id", name: "위치" },
  { key: "log_time", name: "로그일시" },
]
