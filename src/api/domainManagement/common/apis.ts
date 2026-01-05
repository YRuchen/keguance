import getReqByProxyModule from '~/config/request'
import { PROXY } from '~/config/constants'
import { formatNodes } from './utils'
import { TaskType } from './constants'

import type { ICommonObj } from '~/KeepUp'

const request = getReqByProxyModule({ proxyModule: PROXY.GATEWAY_OBSERVE })

/** 获取节点 */
export const getNodesApi = async () => {
  try {
    const res = await request.get('/api/v1/domain/nodes')
    return formatNodes(res.data.list)
  } catch (error: any) {
    console.error(`获取节点失败，失败原因：${error}`)
  }
}

/** 获取任务执行频率 */
export const getFrequencyApi = async (type: TaskType): Promise<ICommonObj> => {
  try {
    const res = await request.get('/api/v1/domain/task/frequency', { params: { type } })
    return res?.data
  } catch (error: any) {
    console.error(`获取节点失败，失败原因：${error}`)
  }
}
