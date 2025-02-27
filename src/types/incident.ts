export type IncidentLogType = {
  log_level: string
  event_time: string
  log_message: string
  log_file: string
  log_time: string
}

export type IncidentLogColumnType = {
  key: keyof IncidentLogType
  name: string
  width: string
  text?: boolean
}

export const IncidentLogTypeKor: IncidentLogColumnType[] = [
  { key: "log_level", name: "등급", width: "100px" },
  { key: "event_time", name: "일시", width: "150px" },
  { key: "log_message", name: "상세내역", width: "350px", text: true },
  { key: "log_file", name: "위치", width: "250px" },
  { key: "log_time", name: "로그일시", width: "200px" },
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
  width: string
  text?: boolean
}

export const IncidentSysLogTypeKor: IncidentSysLogColumnType[] = [
  { key: "log_level", name: "등급", width: "100px" },
  { key: "event_time", name: "일시", width: "150px" },
  { key: "log_message", name: "상세내역", width: "350px", text: true },
  { key: "server_id", name: "위치", width: "100px" },
  { key: "log_time", name: "로그일시", width: "200px" },
]
