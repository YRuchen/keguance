import getReqByProxyModule from '~/config/request'
import { PROXY } from '~/config/constants'
import { ICommonObj } from '~/interfaces/common'

const request = getReqByProxyModule({ proxyModule: PROXY.GATEWAY_OBSERVE })

/** get grafana */
export const getGrafanaApi = (params: ICommonObj): Promise<Record<'grafanaUrl', string>> => {
  return request.get('/line/api_test/v1/chart/runstats', { params })
}
