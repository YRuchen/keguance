/** createChatIdApi入参 */
export interface ICreateChatIdParams {
  /** id */
  id: number
  /** 名称 */
  name: string
  /** chatId */
  chatId: string
}

/** 列表入参 */
export interface IGetChatIdListParams {
  /** 名称 */
  name: string
  /** 页码 */
  page: number
  /** 每页条数 */
  pageSize: number
}

/** 列 */
export interface IChatIdItem {
  /** id */
  id: number
  /** 名称 */
  name: string
  /** chatId */
  chatId: string
  /** 创建时间 */
  createdAt: string
  /** 创建人 */
  creator: string
}

/** createTokenApi入参 */
export interface ICreateTokenParams {
  /** id */
  id: number
  /** 名称 */
  name: string
  /** chatId */
  chatId: string
}

/** 列表入参 */
export interface IGetTokenListParams {
  /** 名称 */
  name: string
  /** 页码 */
  page: number
  /** 每页条数 */
  pageSize: number
}

/** 列 */
export interface ITokenItem {
  /** id */
  id: number
  /** 名称 */
  name: string
  /** chatId */
  chatId: string
  /** 创建时间 */
  createdAt: string
  /** 创建人 */
  creator: string
}
