import getReqByProxyModule from '~/config/request'
import type { LoginParams } from './types'

import { PROXY } from '~/config/constants'
const request = getReqByProxyModule({ proxyModule: PROXY.GATEWAY_OBSERVE })

// 登录
export const loginApi = (data: LoginParams) => {
  return request.post('/api/v1/iam/login', {
    ...data,
    type: 'ACCOUNT_TYPE_USERNAME'
  })
  // return request.post('/user/login', data)
}
// 注册
export const registerUser = (data: registerUserParams) => {
  return request.post('/api/v1/iam/registry', data)
}
// 发送邮件
export const sendEmail = (data: sendEmailParams) => {
  return request.post('/api/v1/iam/code', data)
}
// 登出
export const loginOut = (params) => {
  return request.get('/api/v1/iam/logout', params)
}
// 密码验证
export const checkApi = (data) => {
  return request.post('/pwd/check', data)
}
// 邮箱验证
export const checkCodeApi = (data) => {
  return request.post('/api/v1/iam/verify_code', data)
}
// 忘记密码
export const forgetPwsApi = (data) => {
  return request.post('/api/v1/iam/pwd/forget', data)
}
// 修改密码
export const changePswApi = (data) => {
  return request.patch('/api/v1/iam/pwd', data)
}
// 获取基本信息
export const infoApi = (data) => {
  return request.get('/api/v1/iam/info/' + data)
}
// 获取基本信息
export const rolesApi = (data) => {
  return request.get('/api/v1/iam/permissions/user/' + data)
}
// 修改邮箱
export const changeEmailApi = (data) => {
  return request.post('/api/v1/iam/email', data)
}
