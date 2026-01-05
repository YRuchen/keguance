import getReqByProxyModule from '~/config/request'

import type { ICommonGetListRes, ICommonObj } from '~/interfaces/common'
import type { IListItem } from './interfaces'

// const request = getReqByProxyModule({ proxyModule: PROXY.TEST })
const request = getReqByProxyModule({ proxyModule: '' as any }) // TODO: 本地mock数据，上线前注释

/** 检测结果列表 */
export const getListApi = async (params: ICommonObj): Promise<ICommonGetListRes<IListItem[]>> => {
  try {
    const res: ICommonObj = await request.get('/inspect/page')
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

/** 删除 */
export const deleteApi = ({ id }: Record<'id', string>): Promise<Record<'status', boolean>> => { // 与真实的返回体不同，因为真实的数据类型太lowb
  return request.post(`/inspect/page/{${id}}/`)
}

/** 启用 */
export const enableApi = ({ id }: Record<'id', string>) => {
  return request.put(`/inspect/page/{${id}}/`, { taskStatus: true })
}

/** 禁用 */
export const disabledApi = ({ id }: Record<'id', string>) => {
  return request.put(`/inspect/page/{${id}}/`, { taskStatus: false })
}
