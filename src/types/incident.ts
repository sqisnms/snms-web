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

export type IncidentAlarmLogType = {
  severity: string
  event_time: string
  terminationtimestamp: string
  alarmcode: string
  current_equip_id: string
  equip_name: string
  user_name: string
  alarm_message: string
  probablecause: string
  specificproblem: string
  duplication_count: number
  log_time: string
}

export type IncidentAlarmLogColumnType = {
  key: keyof IncidentAlarmLogType
  name: string
  width: string
  text?: boolean
}

export const IncidentAlarmLogTypeKor: IncidentAlarmLogColumnType[] = [
  { key: "severity", name: "등급", width: "100px" },
  { key: "event_time", name: "발생시간", width: "200px" },
  { key: "terminationtimestamp", name: "해제시간", width: "250px" },
  { key: "alarmcode", name: "알람코드", width: "100px" },
  { key: "current_equip_id", name: "장비명", width: "150px" },
  { key: "equip_name", name: "장비한글명", width: "150px" },
  { key: "user_name", name: "담당자", width: "100px" },
  { key: "alarm_message", name: "장애내역", width: "350px", text: true },
  { key: "probablecause", name: "Probable Cause", width: "350px", text: true },
  { key: "specificproblem", name: "Specific Problem", width: "350px", text: true },
  { key: "duplication_count", name: "중복장애건수", width: "150px" },
  { key: "log_time", name: "Log Time", width: "250px" },
]
