import getReqByProxyModule from '@/config/request'
import { PROXY } from '@/config/constants'

import type { ICommonGetListRes } from '~/interfaces/common'
import type {
  DataSourceListParams,
  DataSourceListResponse,
  IDataSourceItem,
  DataSourceDetail,
  CreateDataSourceParams,
  UpdateDataSourceParams,
  DataSourceDetailResponse,
} from './interfaces'

// 创建请求实例
const request = getReqByProxyModule({ proxyModule: PROXY.GATEWAY_OBSERVE })

// 获取数据源列表
export const getDataSourceList = async (
  params: DataSourceListParams,
): Promise<ICommonGetListRes<IDataSourceItem>> => {
  try {
    const res = await request.get('/config/v1/datasourceManagement/list', {
      params: { ...params.pagination },
    })
    return Promise.resolve({
      list: res.data.list,
      pagination: res.data.pagination,
    })
  } catch (error: any) {
    console.error(`获取列表失败，失败原因：${error}`)
    return {
      list: [],
      pagination: {
        page: 1,
        pageSize: 10,
        total: 0,
      },
    }
  }
}

// 创建数据源
export const createDataSource = (data): Promise<DataSourceDetailResponse> => {
  return request.post('/config/v1/datasourceManagement', { datasource: data })
}

// 获取数据源详情
export const getDataSourceDetail = (id): Promise<DataSourceDetailResponse> => {
  return request.get(`/config/v1/datasourceManagement/${id}`)
}

// 更新数据源
export const updateDataSource = (
  id: string,
  data: UpdateDataSourceParams,
): Promise<DataSourceDetailResponse> => {
  return request.put(`/config/v1/datasourceManagement/${id}`, { id, datasource: data })
}

// 删除数据源
export const deleteDataSource = (id: string): Promise<void> => {
  return request.delete(`/config/v1/datasourceManagement/${id}`)
}

// 测试数据源连接
export const testDataSourceConnection = (
  data: CreateDataSourceParams,
): Promise<{ success: boolean; message: string; data: { ok: boolean; message: string } }> => {
  return request.post('/config/v1/datasourceManagement/connect', { datasource: data })
}

// 可用数据源列表
export const getDatasourceUseList = (): Promise<DataSourceListResponse> => {
  return request.get('/config/v1/datasource/list')
}
