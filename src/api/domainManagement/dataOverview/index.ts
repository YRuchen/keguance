import getReqByProxyModule from '~/config/request'
import { PROXY } from '~/config/constants'
import type {
  IOverviewAlarmListRequest,
  IOverviewAlarmListResponse,
  IOverviewRecordHistogramResponse,
  IOverviewSummaryResponse,
  IOverviewTaskHistogramResponse,
} from './interfaces'

const request = getReqByProxyModule({ proxyModule: PROXY.GATEWAY_OBSERVE })

/** 概览-告警列表 */
export const getOverviewAlarmListApi = async (
  params: IOverviewAlarmListRequest,
): Promise<IOverviewAlarmListResponse> => {
  try {
    const res = await request.get('/api/v1/domain/overview/alarm-list', { params })
    return res?.data || { list: [] }
  } catch (error) {
    console.error('获取告警列表失败: ', error)
    return { list: [] }
  }
}
/** 概览-根据告警列表查询频率 */
export const getTackInfoApi = async (
  id: number,
) => {
  try {
    const res = await request.get('/api/v1/domain/task/info/' + id,)
    return res?.data || { list: [] }
  } catch (error) {
    console.error('获取告警信息失败: ', error)
    return { list: [] }
  }
}

/** 概览-探测次数柱状图 */
export const getOverviewRecordHistogramApi = async (
  params: IOverviewAlarmListRequest,
): Promise<IOverviewRecordHistogramResponse> => {
  try {
    const res = await request.get('/api/v1/domain/overview/record-histogram', { params })
    return res?.data || { list: [] }
  } catch (error) {
    console.error('获取探测次数柱状图失败: ', error)
    return { list: [] }
  }
}

/** 概览-汇总数据 */
export const getOverviewSummaryApi = async (
  params: IOverviewAlarmListRequest,
): Promise<IOverviewSummaryResponse> => {
  try {
    const res = await request.get('/api/v1/domain/overview/summary', { params })
    return res?.data || { list: [] }
  } catch (error) {
    console.error('获取汇总数据失败: ', error)
    return { list: [] }
  }
}

/** 概览-任务柱状图 */
export const getOverviewTaskHistogramApi = async (
  params: IOverviewAlarmListRequest,
): Promise<IOverviewTaskHistogramResponse> => {
  try {
    const res = await request.get('/api/v1/domain/overview/task-histogram', { params })
    return res?.data || { list: [] }
  } catch (error) {
    console.error('获取任务柱状图失败: ', error)
    return { list: [] }
  }
}

/** 概览-导出 */
export const exportApi = (
  params: IOverviewAlarmListRequest,
) => {
  return request.get('/api/v1/domain/overview/export', { responseType: 'blob', params: params })
}