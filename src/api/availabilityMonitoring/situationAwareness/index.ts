import getReqByProxyModule from '~/config/request'
import { PROXY } from '~/config/constants'

import type {
  IPieChartResponse,
  IBarChartResponse,
  ILineChartResponse,
  ITableResponse,
  IMapResponse,
  IOperatorResponseTimeResponse,
  IChartRequest,
} from './interfaces'

const request = getReqByProxyModule({ proxyModule: PROXY.GATEWAY_OBSERVE })

/** 获取面板数据 */
export const getPanelDataApi = (
  panelId: string,
  params?: IChartRequest
): Promise<
  | IPieChartResponse
  | IBarChartResponse
  | ILineChartResponse
  | ITableResponse
  | IMapResponse
  | IOperatorResponseTimeResponse
> => {
  return request.get(`/line/api_test/v1/chart/${panelId}/data`, { params })
}

