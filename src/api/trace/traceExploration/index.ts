import getRequestInstance from '~/config/request'
import { PROXY } from '~/config/constants'
import { formatListRes, formatSpansListRes } from './utils'

import type { ICommonGetListRes, ICommonObj } from '~/interfaces/common'
import type { ITraceDetailRes } from '~/views/trace/traceExploration/detail/interfaces'
import type { ISpanItem, ITraceInfo, IResList } from './interfaces'

const request = getRequestInstance({ proxyModule: PROXY.TRACE })

/** 列表 */
export const getListApi = async (params: ICommonObj): Promise<ICommonGetListRes<ITraceInfo[]>> => {
  try {
    const res: IResList = await request.get('/api/datasources/proxy/uid/tempo/api/search', { params })
    return formatListRes(res)
  } catch (error: any) {
    console.error(`列表获取失败，失败原因：${error}`)
  }
}

/** spans列表 */
export const getSpansListApi = async (params: ICommonObj): Promise<ICommonGetListRes<ISpanItem[]>> => {
  try {
    const res: IResList = await request.get('/api/datasources/proxy/uid/tempo/api/search', { params })
    return formatSpansListRes(res)
  } catch (error: any) {
    console.error(`列表获取失败，失败原因：${error}`)
  }
}

/** 详情 */
export const getDetailApi = (params: ICommonObj): Promise<ITraceDetailRes> => {
  return request.post('/api/ds/query?ds_type=tempo', params)
}

/** 获取日志 */
export const getLogApi = (params: ICommonObj): Promise<ITraceDetailRes> => {
  return request.post('/api/ds/query?ds_type=grafana-opensearch-datasource', params)
}
