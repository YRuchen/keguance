import getReqByProxyModule from '~/config/request'
import { PROXY, exportByCsv } from '~/config'
import { TaskType } from '../common/constants'

import type { ICommonGetListRes, ICommonObj } from '~/interfaces/common'
import type { IListItem } from './interfaces'

const request = getReqByProxyModule({ proxyModule: PROXY.GATEWAY_OBSERVE })

/** 导出 */
export const exportApi = async (params: ICommonObj) => {
  try {
    const res = await request.get('/api/v1/domain/pollution/record/export', { params })
    exportByCsv(res, params.name)
  } catch (error: any) {
    console.error(`导出详情失败，失败原因：${error}`)
  }
}

/** 列表 */
export const getListApi = async (params: ICommonObj): Promise<ICommonGetListRes<IListItem[]>> => {
  try {
    params = {
      ...params,
      ...params.pagination,
    }
    delete params.total
    delete params.pagination
    const res: ICommonObj = await request.get('/api/v1/domain/task/list', { params })
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

/** 创建 */
export const createApi = async (params: ICommonObj) => {
  return request.post('/api/v1/domain/task', { ...params, taskType: TaskType.TASK_TYPE_POLLUTION })
}

/** 获取详情 */
export const getDetailApi = async (params: ICommonObj) => {
  try {
    const res = await request.get(`/api/v1/domain/task/info/${params.id}/`)
    return res?.data
  } catch (error: any) {
    console.error(`获取节点失败，失败原因：${error}`)
  }
}

/** 编辑详情 */
export const editApi = async (params: ICommonObj) => {
  return request.post('/api/v1/domain/task', { ...params, taskType: TaskType.TASK_TYPE_POLLUTION })
}

/** 获取所属项目下拉选 */
export const getUsersProjectApi = (params: ICommonObj) => {
  params = {
    page: 1,
    pageSize: 1000,
  }
  return request.get('/api/v1/domain/users/project/', { params })
}

/** 删除 */
export const deleteApi = (id: string): Promise<Record<'status', boolean>> => { // 与真实的返回体不同，因为真实的数据类型太lowb
  return request.delete(`/api/v1/domain/task/${id}`)
}

/** 启用 */
export const enableApi = ({ id }: Record<'id', string>) => {
  return request.put(`/api/v1/domain/task/status/${id}`, { taskStatus: true })
}

/** 禁用 */
export const disabledApi = ({ id }: Record<'id', string>) => {
  return request.put(`/api/v1/domain/task/status/${id}`, { taskStatus: false })
}

/** 获取历史快照 */
export const getHistoryListApi = async (params: ICommonObj): Promise<ICommonGetListRes<IListItem[]>> => {
  try {
    const res: ICommonObj = await request.get('/api/v1/domain/pollution/record', { params })
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

/** 历史快照左侧节点列表 */
export const getHistoryNodeListApi = async (params: ICommonObj) => {
  try {
    const sendData = {
      ...params,
      page: params.pagination?.page,
      pageSize: params.pagination?.pageSize,
    }
    delete sendData.pagination // TODO
    const res = await request.get('/api/v1/domain/nodes/listTable', { params: sendData })
    console.log({ res })
    return Promise.resolve({
      list: res.data.list.map((v: ICommonObj, index: number) => ({ ...v, index: index })),
      pagination: res.data.pagination,
    })
  } catch (error: any) {
    console.error(`获取节点失败，失败原因：${error}`)
  }
}
