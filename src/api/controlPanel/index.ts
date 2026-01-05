import getReqByProxyModule from '~/config/request'
import { PROXY } from '~/config/constants'
const request = getReqByProxyModule({ proxyModule: PROXY.GATEWAY_OBSERVE })
// 新增目录/修改目录
export const updateFolderApi = (data: any) => {
  return request.patch('/api/core/observable/core/v1/folders', data)
}
// 删除目录
export const deleteFolderApi = (data: any) => {
  return request.delete('/api/core/observable/core/v1/folders', { data: data })
}
// 目录列表
export const listFolderApi = (params: any) => {
  return request.get('/api/core/observable/core/v1/folders', { params })
}
// 仪表盘列表
export const listBoardsApi = (data: any) => {
  return request.post('/api/core/observable/core/v1/boards/list', data)
}
// 新增仪表盘
export const createBoardApi = (data: any) => {
  return request.post('/api/core/observable/core/v1/boards', data)
}
// 导入仪表盘
export const importBoardApi = (data: any) => {
  return request.post('/api/core/observable/core/v1/boards/import', data)
}
// 删除仪表盘
export const deleteBoardApi = (data: any) => {
  return request.delete('/api/core/observable/core/v1/boards/batch', { data: data })
}
// 取消收藏
export const unfavoriteApi = (data: any) => {
  return request.put('/api/core/observable/core/v1/boards/batch/unfavorite', data)
}
// 收藏仪表盘
export const favoriteApi = (data: any) => {
  return request.put('/api/core/observable/core/v1/boards/favorite', data)
}
// 创建人
export const getCreatorsApi = (params: any) => {
  return request.get('/api/core/observable/core/v1/boards/creators', { params })
}
// 搜索
export const searchApi = (data: any) => {
  return request.post('/api/core/observable/core/v1/boards/search', data)
}
// 仪表盘详情
export const detailBoardsApi = (data: any) => {
  return request.post('/api/core/observable/core/v1/boards/detail', data)
}
// 不知道干啥的
export const vistApi = (data: any) => {
  return request.post('/api/core/observable/core/v1/boards/visit', data)
}
