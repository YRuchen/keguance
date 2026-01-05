import getReqByProxyModule from '~/config/request'
import { PROXY } from '~/config/constants'
const request = getReqByProxyModule({ proxyModule: PROXY.GATEWAY_OBSERVE })
// 创建api key
export const generateKeyApi = <T = any>(data: any): Promise<T> => {
  return request.post('/api/v1/iam/generate/key', data)
}
// 编辑api key
export const editKeyApi = <T = any>(params?: any): Promise<T> => {
  return request.get(`/api/v1/iam/key`, { params })
}
// 删除api key
export const deleteKeyApi = <T = any>(data: any): Promise<T> => {
  return request.delete(`/api/v1/iam/key/${data.keyId}/${data.id}`)
}
// 获取api key 列表
export const getKeyApi = <T = any>(data: any, params: any): Promise<T> => {
  return request.get(`/api/v1/iam/key/${data.type}/${data.id}`, { params })
}
// 获取agent列表
export const getAgentApi = <T = any>(params: any): Promise<T> => {
  return request.get('/api/v1/logging/agent/list', { params })
}
