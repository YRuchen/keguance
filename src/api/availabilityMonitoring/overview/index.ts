import getReqByProxyModule from '~/config/request'
import { PROXY } from '~/config/constants'

import type { ICommonObj, IOptionItem, ICommonGetListRes } from '~/KeepUp'
import type { ILineModuleGetChartParams, ILineModuleGetLineChartRes, ILineModuleGetBarChartRes } from '~/interfaces/common'
import type { IGetListParams, NetworkLatencyData, TimeSeriesData, IListItem } from './interfaces'

const request = getReqByProxyModule({ proxyModule: PROXY.GATEWAY_OBSERVE })

/** get grafana */
export const getGrafanaApi = (params: ICommonObj): Promise<Record<'grafanaUrl', string>> => {
  return request.get('/line/api_test/v1/chart/overview', { params })
}

/** 获取【域名/地址】列表 */
export const getDomainListApi = (subType: string): Promise<ICommonGetListRes<IOptionItem[]>> => {
  return request.get('/line/api_test/v1/optional_domains', { params: { subType } })
}

/** 根据【域名/地址】获取对应任务列表 */
export const getTaskListByDomainApi = (domain: string): Promise<ICommonGetListRes<IOptionItem[]>> => {
  return request.get('/line/api_test/v1/optional_tests', { params: { domain } })
}

/** 获取列表 */
export const getListApi = (params: IGetListParams): Promise<ICommonGetListRes<[]>> => {
  return request.get('/line/api_test/v1/node_performance', { params })
}

/** 获取柱状图、折线图数据 */
export const getOverviewChartApi = (params: ILineModuleGetChartParams, panelId: string): Promise<ILineModuleGetBarChartRes | ILineModuleGetLineChartRes> => {
  return request.get(`/line/api_test/v1/chart/${panelId}/data`, { params })
}

/** 获取响应时间地图数据 */
export const getOverview0ChartApi = (params: ICommonObj): Promise<NetworkLatencyData> => {
  return request.get('/line/api_test/v1/chart/response_time_map/data', { params })
}
/** 获取响应时间时序图数据 */
export const getResponseTime = (params: ICommonObj): Promise<TimeSeriesData> => {
  return request.get('/line/api_test/v1/chart/response_time/data', { params })
}
/** 获取可用率地图数据 */
export const getOverview8ChartApi = (params: ICommonObj): Promise<NetworkLatencyData> => {
  return request.get('/line/api_test/v1/chart/availability_map/data', { params })
}
/** 获获取可用率时序图数据 */
export const getAvailability = (params: ICommonObj): Promise<TimeSeriesData> => {
  return request.get('/line/api_test/v1/chart/availability/data', { params })
}
