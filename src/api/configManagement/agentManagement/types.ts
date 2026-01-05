/** Agent 列表请求参数 */
export interface AgentListRequest {
  /**
   * agent名称, 最大长度100
   */
  agentName?: string
  /**
   * 主机名称, 最大长度100
   */
  hostname?: string
  /**
   * 页码，默认为: 1
   */
  page?: number
  /**
   * 每页显示数量，默认为: 10
   */
  pageSize?: number
  /**
   * agent状态。 `ONLINE = 1` 在线  `OFFLINE = -1` 下线
   */
  status?: number
  [property: string]: any
}

/**
 * AgentListReply_statusType
 */
export interface AgentListReplyStatusType {
  /**
   * 状态标签
   */
  label?: string
  /**
   * 是否在线
   */
  online?: boolean
  [property: string]: any
}

/**
 * AgentListReply_AgentInfo
 */
export interface AgentListReplyAgentInfo {
  /**
   * agent 名称
   */
  agentName?: string
  /**
   * 主机名称
   */
  hostName?: string
  /**
   * id
   */
  id?: number
  /**
   * 上次心跳时间
   */
  lastBeatTime?: string
  /**
   * 运行时长
   */
  runTime?: string
  status?: AgentListReplyStatusType
  [property: string]: any
}

/**
 * PaginationData，分页 data
 */
export interface PaginationData {
  /**
   * 当前页码
   */
  page?: number
  /**
   * 每页大小
   */
  pageSize?: number
  /**
   * 总记录数
   */
  total?: number
  [property: string]: any
}

/**
 * AgentListReply
 */
export interface AgentListResponse {
  /**
   * agent列表，按注册时间倒序排列
   */
  list?: AgentListReplyAgentInfo[]
  pagination?: PaginationData
  [property: string]: any
}

/** Agent 状态标签 */
export interface AgentStatusLabelItem {
  status: number
  label: string
  [property: string]: any
}

export interface AgentStatusLabelResponse {
  list?: AgentStatusLabelItem[]
  [property: string]: any
}
