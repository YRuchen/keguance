import getReqByProxyModule from '~/config/request'
import { PROXY } from '~/config/constants'

import type { ICommonGetListRes, ICommonObj } from '~/interfaces/common'
import type { IListItem } from './interfaces'

const request = getReqByProxyModule({ proxyModule: PROXY.GATEWAY_OBSERVE })
// const request = getReqByProxyModule({ proxyModule: '' as any }) // TODO: 本地mock数据，上线前注释

/** 检测结果列表 */
export const getListApi = async (params: ICommonObj): Promise<ICommonGetListRes<IListItem[]>> => {
  try {
    const res: ICommonObj = await request.get('/api/v1/domain/task/status/list', { params })
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

/** 详情 */
export const getDetail = async (params: ICommonObj) => {
  try {
    const sendData = {
      ...params,
      page: params.pagination?.page,
      pageSize: params.pagination?.pageSize,
    }
    delete sendData.pagination // TODO
    const res: ICommonObj = await request.get('/domain/api/v1/inspect/status/', { params: sendData })
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

/** 替换域名 */
export const editApi = (params: ICommonObj) => {
  return request.post('/domain/api/v1/domain/replace-domain/', params)
}

/** 替换记录 */
export const getRecordApi = async (params: ICommonObj) => {
  try {
    const sendData = {
      ...params,
      page: params.pagination?.page,
      pageSize: params.pagination?.pageSize,
    }
    delete sendData.pagination // TODO
    const res: ICommonObj = await request.get('/domain/api/v1/domain/replace-domain-record/', { params: sendData })
    return Promise.resolve({
      list: res.data.data,
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
