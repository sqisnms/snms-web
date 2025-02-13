export type IncidentLogType = {
  event_time: string
  log_file: string
  log_message: string
  log_level: string
  log_time: string
}

export type IncidentSysLogType = {
  event_time: string
  server_id: string
  log_message: string
  log_level: string
  log_time: string
}
