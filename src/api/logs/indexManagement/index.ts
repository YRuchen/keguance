import getReqByProxyModule from '~/config/request'
import { PROXY } from '~/config/constants'

import type { ICommonObj, ICommonGetListRes } from '~/KeepUp'
import type { 
  IIndexTemplateListItem, 
  IRawIndexListItem, 
  IOptionsItem, 
  IGetLogSampingListParams,
  IGetLogSampingListRes,
  ICreateIndexApiParams,
} from './interfaces'

const request1 = getReqByProxyModule({ proxyModule: PROXY.GATEWAY_OBSERVE })

/** 获取数据源列表 */
export const getDataSourceListApi = (): Promise<IOptionsItem[]> => {
  return request1.get('/config/v1/datasource/list')
}

/** 获取索引模版创建人列表 */
export const getIndexTemplateCreatorListApi = (): Promise<IOptionsItem[]> => {
  return request1.get('/api/v1/logging/index-template/creator/list')
}

/** 获取原始索引创建人列表 */
export const getRawIndexCreatorListApi = (): Promise<IOptionsItem[]> => {
  return request1.get('/api/v1/logging/index/creator/list')
}

/** 获取原始索引前缀列表 */
export const getRawIndexPrefixListApi = (dataSourceId: string) => {
  return request1.get('/api/v1/logging/index/original-index-prefix-list', { params: { dataSourceId } })
}

/** 获取索引模版列表 */
export const getIndexTemplateListApi = async (params: ICommonObj): Promise<ICommonGetListRes<IIndexTemplateListItem[]>> => {
  try {
    const res = await request1.get('/api/v1/logging/index-template/list', { params })
    return res.data
  } catch (error) {
    console.error('获取索引模版列表失败，失败原因:', error)
  }
}

/** 创建索引模版 */
export const createIndexTemplateApi = (params: ICommonObj): Promise<ICommonObj> => {
  return request1.post('/api/v1/logging/index-template/create', params)
}

/** 编辑索引模版 */
export const editIndexTemplateApi = (params: ICommonObj): Promise<ICommonObj> => {
  return request1.post('/api/v1/logging/index-template/edit', params)
}

/** 索引模版详情 */
export const getIndexTemplateDetailApi = async (templateId: string): Promise<ICommonObj> => {
  try {
    const res = await request1.get(`/api/v1/logging/index-template/${templateId}`)
    return res.data
  } catch (error: any) {
    console.error(`获取索引模版详情失败，失败原因：${error}`)
  }
}

/** 索引模版-获取日志采样列表 */
export const getLogSamplingList = async (params: IGetLogSampingListParams): Promise<ICommonGetListRes<IGetLogSampingListRes[]>> => {
  try {
    const res = await request1.post('/api/v1/logging/log/sample-index-template-logs', params)
    return res.data
  } catch (error: any) {
    console.error(`获取日志采样列表失败，失败原因：${error}`)
  }
}

/** 删除索引模版 */
export const deleteIndexTemplateApi = (params: Record<'templateIds', string[]>) => {
  return request1.post('/api/v1/logging/index-template/batch-delete', params)
}

/** 获取原始索引列表 */
export const getRawIndexListApi = async (params: ICommonObj): Promise<ICommonGetListRes<IRawIndexListItem[]>> => {
  try {
    const res = await request1.get('/api/v1/logging/index/original-index-list', { params })
    return res.data
  } catch (error) {
    console.error('获取原始索引列表，失败原因:', error)
  }
}

/** 创建原始索引 */
export const createRawIndexApi = (params: ICreateIndexApiParams): Promise<ICommonObj> => {
  return request1.post('/api/v1/logging/index/create', params)
}

/** 删除原始索引 */
export const deleteRawIndexApi = (params: Record<'indexIds', string[]>): Promise<ICommonObj> => {
  return request1.post('/api/v1/logging/index/batch-delete', params)
}
