export type SystemMonitorListType = {
  server_id: string
  server_ip: string
  boot_time: string
  physical_cpu_cores: number
  cpu: string
  mem: string
  disk: string
  load: string
  network_io: string
  collect_time: string
}

export type ProcessMonitorListType = {
  server_id: string
  process_name: string
  process_kind: string
  process_directory: string
  execute_kind: string
  create_time: string
  sum_cpu: string
  sum_memory_usage: string
  sum_rss: number
}

export type ProcessMastType = {
  server_id: string
  process_name: string
  process_kind: string
  process_directory: string
  execute_kind: string
}

export type ProcessMastColumnType = {
  key: keyof ProcessMastType
  name: string
  width: string
  text?: boolean
  readOnlyOnUpdate?: boolean
}

export const ProcessMastTypeKor: ProcessMastColumnType[] = [
  { key: "server_id", name: "Server_ID", width: "100px", readOnlyOnUpdate: true },
  { key: "process_name", name: "프로세스명", width: "150px", readOnlyOnUpdate: true },
  { key: "process_kind", name: "종류", width: "350px" },
  { key: "process_directory", name: "실행 위치", width: "100px" },
  { key: "execute_kind", name: "실행방법", width: "200px" },
]

export const defaultProcessMast: ProcessMastType = {
  server_id: "",
  process_name: "",
  process_kind: "",
  process_directory: "",
  execute_kind: "",
}
