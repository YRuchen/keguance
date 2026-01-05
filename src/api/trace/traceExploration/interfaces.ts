/** 单个span简要信息 */
export interface ISpanItem {
  /** id */
  spanID: string
  /** 开始时间（Unix 时间戳（纳秒）） */
  startTimeUnixNano: string
  /** 持续时间（纳秒） */
  durationNanos: string
}

/** 根据limit截取的部分span数据 */
export interface ISpanSet {
  /** 根据limit截取的部分数据 */
  spans: ISpanItem[]
  /** 全量数据length，让用户知道全量数据有多少 */
  matched: 1
}

/** 追踪数据 */
export interface ITraceInfo {
  /** 追踪id */
  traceID: string
  /** 链路根服务名称 */
  rootServiceName: string
  /** 追踪名称 */
  rootTraceName: string
  /** 开始时间 */
  startTimeUnixNano: string
  /** 耗时 */
  durationMs: number
  /** 根据limit截取的部分span数据 */
  spanSet: ISpanSet
  /** 前端不消费 */
  spanSets: ISpanSet[]
  /** 前端不消费 */
  serviceStats: Record<string, string>
}

/** 接口出参列表项 */
export interface IResList {
  /** 追踪数据 */
  traces: ITraceInfo[]
  /** 前端不消费 */
  metrics: Record<string, any>
}
