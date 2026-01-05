import getReqByProxyModule from '~/config/request'
import { PROXY } from '~/config/constants'

import type { ICommonGetListRes } from '~/interfaces/common'
import type {
  AgentListReplyAgentInfo,
  AgentListRequest,
  AgentListResponse,
  AgentStatusLabelItem,
  AgentStatusLabelResponse,
  PaginationData,
} from './types'

const request = getReqByProxyModule({ proxyModule: PROXY.GATEWAY_OBSERVE })

const DEFAULT_PAGINATION: Required<PaginationData> = {
  page: 1,
  pageSize: 10,
  total: 0,
}

const sanitizeParams = (params: AgentListRequest = {}): AgentListRequest => {
  const result: AgentListRequest = {}
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return
    if (typeof value === 'string') {
      result[key] = value.trim()
      return
    }
    result[key] = value
  })
  return result
}

/**
 * 获取 Agent 列表
 */
export const getAgentList = async (
  params: AgentListRequest & { pagination?: PaginationData } = {},
): Promise<ICommonGetListRes<AgentListReplyAgentInfo[]>> => {
  try {
    const { pagination, ...rest } = params || {}
    const query: AgentListRequest = {
      ...rest,
      page: pagination?.page ?? rest.page ?? DEFAULT_PAGINATION.page,
      pageSize: pagination?.pageSize ?? rest.pageSize ?? DEFAULT_PAGINATION.pageSize,
    }
    const res = await request.get('/api/v1/logging/agent/list', {
      params: sanitizeParams(query),
    })
    const data: AgentListResponse = res?.data || {}
    return {
      list: data.list ?? [],
      pagination: {
        page: data.pagination?.page ?? query.page ?? DEFAULT_PAGINATION.page,
        pageSize: data.pagination?.pageSize ?? query.pageSize ?? DEFAULT_PAGINATION.pageSize,
        total: data.pagination?.total ?? DEFAULT_PAGINATION.total,
      },
    }
  } catch (error: any) {
    console.error(`获取 Agent 列表失败，失败原因：${error}`)
    return {
      list: [],
      pagination: { ...DEFAULT_PAGINATION },
    }
  }
}

/**
 * 获取 Agent 状态标签列表
 */
export const getAgentStatusLabels = async (): Promise<AgentStatusLabelItem[]> => {
  try {
    const res = await request.get<AgentStatusLabelResponse>('/api/v1/logging/agent/statusLabel')
    return res?.data?.list ?? []
  } catch (error: any) {
    console.error(`获取 Agent 状态标签失败，失败原因：${error}`)
    return []
  }
}
/**
 * 获取 Agent 日志列表
 */
export const getAgentLogsApi = async (params): Promise<any[]> => {
  try {
    const res = await request.get<AgentStatusLabelResponse>('/api/v1/logging/log/sample-agent-logs', { params })
    return res?.data?.list ?? []
  } catch (error: any) {
    console.error(`获取 Agent 日志失败，失败原因：${error}`)
    return []
  }
}
