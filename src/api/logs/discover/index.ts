import getReqByProxyModule from '@/config/request'
import { PROXY } from '@/config/constants'
import { useUserStore } from '@/store/modules/useAuthStore'
import { EventSourcePolyfill } from 'event-source-polyfill'
import type {
  LogHistogramParams,
  LogHistogramResponse,
  LogListParams,
  LogListResponse,
  QueryCondsResponse,
  SaveCondsResponse,
  IndexListParams,
  IndexListResponse,
  IGetIndexLogListApiParams,
  IGetIndexListApiParams,
  IOptionsItem,
  IGetFastFilterSchemaApi,
} from './interfaces'

// 创建请求实例
const request = getReqByProxyModule({ proxyModule: PROXY.GATEWAY_OBSERVE })

/** 查询日志快速筛查结构 */
export const getFastFilterSchemaApi = (params: IGetFastFilterSchemaApi) => {
  return request.post('/api/v1/logging/log/tags', params)
}

// 检索日志柱状图
export const getLogHistogram = (params: IGetIndexListApiParams): Promise<LogHistogramResponse> => {
  // return request.post('/api/v1/logging/log/histogram', params)
  return request.post('/api/v1/logging/log/histogram', params)
}

// 分页检索列表
export const getLogList = (params: LogListParams): Promise<LogListResponse> => {
  return request.post('/api/v1/logging/log/list', params)
}

// 查询保存的检索条件列表
export const getQueryConds = (): Promise<QueryCondsResponse> => {
  return request.get('/api/v1/logging/log/query-conds')
}

// 保存检索条件
export const setQueryConds = (params: LogHistogramParams): Promise<SaveCondsResponse> => {
  return request.post('/api/v1/logging/log/save-query', params)
}

// 编辑检索条件（只能编辑名称）
export const editQueryConds = (params: {
  id: number
  viewName: string
}): Promise<SaveCondsResponse> => {
  return request.post('/api/v1/logging/log/edit-query', params)
}

// 删除检索条件
export const deleteQueryConds = (id: number) => {
  return request.delete(`/api/v1/logging/log/delete-query/${id}`)
}

// 查询索引列表
// export const getIndexList = (params: IndexListParams): Promise<IndexListResponse> => {
//   return request.post('/api/v1/logging/index/list', params)
// }
/** 获取索引列表 */
export const getIndexList = (params: IGetIndexListApiParams): Promise<IOptionsItem[]> => {
  return request.get('/api/v1/logging/log/index-select-list', { params })
}

// 查询索引日志列表
export const getIndexLogListApi = (params: IGetIndexLogListApiParams): Promise<LogListResponse> => {
  return request.post('/api/v1/logging/log/list', params)
}

// 创建SSE日志流连接
export const createLogStream = (indexId: string): EventSource => {
  const baseURL = import.meta.env.VITE_APP_GATEWAY_OBSERVE || ''
  const url = `${baseURL}/api/v1/logging/stream?indexId=${indexId}`
  const userStore = useUserStore()
  const token: string = userStore.userInfo?.token // TODO: error
  return new EventSourcePolyfill(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true, // 如果需要携带 cookie
  })
}

