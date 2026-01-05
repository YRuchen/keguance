import getReqByProxyModule from '~/config/request'
import { PROXY } from '~/config/constants'

import type { ICommonObj, ICommonGetListRes } from '~/KeepUp'
import type { IOptionsItem, IGetIndexListApiParams } from './interfaces'

const request1 = getReqByProxyModule({ proxyModule: PROXY.GATEWAY_OBSERVE })

/** 获取数据源列表 */
export const getDataSourceListApi = (): Promise<IOptionsItem[]> => {
  return request1.get('/config/v1/datasource/list')
}

/** 获取索引列表 */
export const getIndexListApi = (params: IGetIndexListApiParams): Promise<IOptionsItem[]> => {
  return request1.get('/api/v1/logging/log/index-select-list', { params })
}
