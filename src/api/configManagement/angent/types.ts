// 登录参数类型
export interface LoginParams {
  username: string
  password: string
}
export interface registerUserParams {
  username: string
  password: string
  confirmPPassword: string
  email: string
  code: string
}
export interface sendEmailParams {
  channel: string
  recipient: string
}
