export type UserType = {
  user_id: string
  user_name: string
  login_id: string
  user_pwd: string
  user_status_code: string
  pfx_user_code: string
  team_code: string
  center_id: string
  title: string
  duty_name: string
  duty_code: string
  business: string
  pcsphone: string
  telephone: string
  email: string
  oper_team_code: string
  env_id: string
  create_date: Date
  modify_date: Date
  auth_key: string
  device_type: string
  fcm_token: string

  role_names?: string[]
  role_ids?: string[]
  team_tree?: string[]
}
