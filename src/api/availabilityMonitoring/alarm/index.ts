import getReqByProxyModule from '~/config/request'
import { PROXY } from '~/config/constants'

import type { ICommonGetListRes, ICommonObj, ILineModuleGetChartParams, ILineModuleGetPieChartRes, ILineModuleGetBarChartRes } from '~/interfaces/common'
import type { IListItem, IEchartsLineRes,LineListItem } from './interfaces'

const request = getReqByProxyModule({ proxyModule: PROXY.GATEWAY_OBSERVE })

/** 获取列表 */
export const getListApi = (params: ICommonObj): Promise<ICommonGetListRes<IListItem[]>> => {
  return request.get(`/line/api_test/v1/alerts`, { params })
}

/** 获取GrafanaUrl */
export const getGrafanaUrlApi = (params: ICommonObj): Promise<Record<'grafanaUrl', string>> => {
  return request.get(`/line/api_test/v1/chart/alerts`, { params })
}

/** 获取告警监测图API */
export const getEchartsLineApi = (params: ICommonObj): Promise<IEchartsLineRes<LineListItem[]>> => {
  return request.get(`/line/api_test/v1/chart/alerts/data`, { params });
}

/** 获取饼图图表 */
export const getLineChartApi = (params: ILineModuleGetChartParams, panelId: string): Promise<ILineModuleGetPieChartRes> => {
  return request.get(`/line/api_test/v1/chart/${panelId}/data`, { params })
}

/** 获取柱状图图表 */
export const getBarChartApi = (params: ILineModuleGetChartParams, panelId: string): Promise<ILineModuleGetBarChartRes> => {
  return request.get(`/line/api_test/v1/chart/${panelId}/data`, { params })
}
