
import { VNode } from 'vue'
import { ROLE } from './constants'
export interface ChatSession {
  /**
   * 创建时间戳
   */
  createTimestamp?: number
  /**
   * 会话ID
   */
  sessionId: number
  /**
   * 会话名称
   */
  sessionName: string
  /**
   * 更新时间戳
   */
  updateTimestamp?: number
  [property: string]: any
}

export interface GetSessionListRsp {
  list?: ChatSession[]
  [property: string]: any
}

export interface CreateSessionReq {
  /**
   * 会话场景：
   * - `CHAT_SCENE_GENERAL=1` 通用场景聊天，
   * - `CHAT_SCENE_DOMAIN=2` 域名场景提问，
   * - `CHAT_SCENE_LINE=3` 线路场景提问，
   * - `CHAT_SCENE_LOGGING=4` 日志场景提问
   */
  chatScene: string
  /**
   * 会话名称
   */
  metaData?: string
  /**
   * 会话名称
   */
  sessionName?: string
  [property: string]: any
}

export interface SendMsgReq {
  /**
   * 用户输入内容，若为重新生成回答不需要
   */
  message?: string
  /**
   * 消息ID，若为重新生成回答需要
   */
  messageId?: number
  /**
   * 会话ID，从接口/api/v1/aichat/session/create  获取sessionId
   */
  sessionId: number
  [property: string]: any
}

export interface ChatRsp {
  /**
   * 模型返回内容
   */
  message: string
  /**
   * 消息ID
   */
  messageId: number
  [property: string]: any
}
/**
 * GetSessionDetailRsp
 */
export interface GetChatMsg {
  list?: ChatMsg[];
  [property: string]: any;
}


/**
 * ChatMsg
 */
export interface ChatMsg {
  /**
   * 消息内容
   */
  message: string | VNode;
  /**
   * 消息ID
   */
  messageId: number;
  /**
   * 排序类型：
   * - `CHAT_ROLE_USER=1` 用户，
   * - `CHAT_ROLE_ASSISTANT=2` 大模型
   */
  role: ROLE;
  loading?: boolean
  // [property: string]: any;
}

/**
 * SetSessionNameReq
 */
export interface SetName {
  /**
   * 会话ID
   */
  sessionId: number;
  /**
   * 会话名称
   */
  sessionName: string;
}