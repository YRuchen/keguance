import getReqByProxyModule from '~/config/request'
import { PROXY } from '~/config/constants'

import type { ICommonGetListRes, ICommonObj } from '~/KeepUp'
import type { 
  ICreateChatIdParams, 
  IGetChatIdListParams, 
  IChatIdItem,
  ICreateTokenParams,
  IGetTokenListParams,
  ITokenItem,
} from './interfaces'

const request = getReqByProxyModule({ proxyModule: PROXY.GATEWAY_OBSERVE })

/** 创建ChatId */
export const createChatIdApi = (params: ICreateChatIdParams): Promise<ICommonObj> => {
  return request.post('/api/v1/configManager/channel/chatId', params)
}

/** ChatId列表 */
export const getChatIdListApi = async (params?: IGetChatIdListParams): Promise<ICommonGetListRes<IChatIdItem[]>> => {
  try {
    const res = await request.get('/api/v1/configManager/channel/chatId/list', { params })
    return res.data || {}
  } catch (error: any) {
    console.error(`获取ChatId列表失败，失败原因：${error}`)
  }
}

/** 删除ChatId */
export const deleteChatIdAPi = (id: string) => {
  return request.delete(`/api/v1/configManager/channel/chatId/${id}`)
}

/** 创建Token */
export const createTokenApi = (params: ICreateTokenParams): Promise<ICommonObj> => {
  return request.post('/api/v1/configManager/channel/chatToken', params)
}

/** Token列表 */
export const getTokenListApi = async (params?: IGetTokenListParams): Promise<ICommonGetListRes<ITokenItem[]>> => {
  try {
    const res = await request.get('/api/v1/configManager/channel/chatToken/list', { params })
    return res.data || {}
  } catch (error: any) {
    console.error(`获取ChatId列表失败，失败原因：${error}`)
  }
}

/** 删除Token */
export const deleteTokenAPi = (id: string) => {
  return request.delete(`/api/v1/configManager/channel/chatToken/${id}`)
}
