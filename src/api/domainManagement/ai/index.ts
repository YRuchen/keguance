import getReqByProxyModule from '~/config/request'
import { PROXY } from '~/config/constants'
import type {
  GetSessionListRsp,
  CreateSessionReq,
  ChatSession,
  SendMsgReq,
  ChatRsp,
  GetChatMsg,
  SetName
} from './interfaces'

const request = getReqByProxyModule({ proxyModule: PROXY.GATEWAY_OBSERVE })

/**
 * 获取会话历史列表
 * @param chatScene 会话场景
 */
export const getSessionListApi = async (
  chatScene: string,
): Promise<GetSessionListRsp> => {
  try {
    const res = await request.get('/api/v1/aichat/session/list', {
      params: { chatScene },
    })
    return res?.data || { list: [] }
  } catch (error: any) {
    console.error(`获取会话历史列表失败，失败原因：${error}`)
    return { list: [] }
  }
}
/**
 * 获取会话详情
 * @param sessionId 会话id
 */
export const getSessionDetailApi = async (
  sessionId: string,
): Promise<GetChatMsg> => {
  try {
    const res = await request.get('/api/v1/aichat/session/detail/' + sessionId)
    return res?.data || { list: [] }
  } catch (error: any) {
    console.error(`获取会话详情失败，失败原因：${error}`)
    return { list: [] }
  }
}

/**
 * 新建会话
 * @param params 创建会话参数
 */
export const createSessionApi = async (
  params: CreateSessionReq,
): Promise<ChatSession> => {
  try {
    const res = await request.post('/api/v1/aichat/session/create', params)
    return res?.data
  } catch (error: any) {
    console.error(`新建会话失败，失败原因：${error}`)
    throw error
  }
}

/**
 * 重命名
 * @param params 发送消息参数
 */
export const setNameApi = (params: SetName) => {
  return request.post('/api/v1/aichat/session/set-name', params)
}

/**
 * 删除会话
 * @param params 发送消息参数
 */
export const deteleNameApi = (params: SetName) => {
  return request.delete('/api/v1/aichat/session/' + params)
}

