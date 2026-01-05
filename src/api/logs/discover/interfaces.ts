import { IndexType } from './constants'

/** 查询索引日志列表接口参数 */
export interface IGetIndexLogListApiParams {
  /** 数据源ID */
  dataSourceId: string
  /** 查询索引类型 */
  indexType: string
  /** 原始索引或者索引模板的ID */
  indexId: number
  /** 分页参数，查第几页 */
  page: number
  /** 分页参数，一页大小 */
  pageSize: number
  /** 排序类型 */
  sortOrder: 'SORT_ORDER_ASC' | 'SORT_ORDER_DESC'
  /** 绝对时间查询，开始时间戳 */
  startTimestamp: number
  /** 绝对时间查询，结束时间戳 */
  endTimestamp: number
  /** 查询条件 */
  queryCondition: {
    logic: 'LOGIC_AND' | 'LOGIC_OR'
    conditions: {
      field: string
      operator: string
      value: string
    }[]
    conditionGroups: []
  }
  filterConditions: []
}

/** 查询日志快速筛查结构入参 */
export interface IGetFastFilterSchemaApi {
  /** 数据源id */
  dataSourceId: string
  /** 查询索引类型 */
  indexType: string
  /** 原始索引或索引模版的id */
  indexId: number
  /** 开始时间时间戳 */
  startTimestamp: number
  /** 结束时间时间戳 */
  endTimestamp: number
}

export interface LogField {
  name: string
  type: string
  selected: boolean
  isSystemField?: boolean // 是否为系统字段，系统字段不可手动删除
}

export interface LogDocument {
  timestamp: string
  logJson: string
  _id?: string
  _index?: string
  _score?: number
  _type?: string
  '@timestamp'?: string
  agent_hostname?: string
  event?: string
  fcservice?: string
  fcsource?: string
  [key: string]: any
}

export interface logChartData {
  time: string
  level: string
  count: string
}

export interface FilterCondition {
  field: string
  operator: string
  value: string
  isValid?: boolean // 是否为有效的过滤条件
}

// 检索日志柱状图查询参数
export interface FilterCondition {
  field: string
  operator: string
  value: string
}
// ICondition 格式（从 QueryBuilder 导入）
export interface ICondition {
  logic: 'AND'
  conditions: {
    field: string
    operator: string
    value: string
  }[]
}

export interface LogHistogramParams {
  dataSourceId?: string
  indexName?: string
  searchTimeType?: string
  startTimestamp?: number
  endTimestamp?: number
  minutesPast?: number
  queryCondition?: string | ICondition // 支持字符串和 ICondition 格式
  filterConditions?: FilterCondition[]
  id?: number
}

// 检索日志柱状图响应
export interface LogHistogramResponse {
  data: {
    summary: []
    histogram: []
  }
}

// 分页检索列表查询参数
export interface LogListParams {
  dataSourceId?: string
  indexName: string
  searchTimeType?: string
  startTimestamp?: string
  endTimestamp?: string
  minutesPast?: number
  queryCondition?: string | ICondition // 支持字符串和 ICondition 格式
  filterConditions?: []
  page?: number
  pageSize?: number
  sortOrder?: string
}

// 分页检索列表响应
export interface LogListResponse {
  data: {
    total?: number
    list: []
  }
}
// 保存的视图项
export interface SavedView {
  id: number
  dataSourceId?: string
  indexName: string
  searchTimeType: string
  startTimestamp?: string
  endTimestamp?: string
  minutesPast?: number
  queryCondition?: string
  filterConditions?: []
  page?: number
  pageSize?: number
  sortOrder?: string
  viewName?: string
  content?: string // 保存的筛选条件 JSON 字符串
}

// 检索日志视图查询参数
export interface QueryCondsResponse {
  data: {
    views: SavedView[]
  }
}
// 保存检索条件查询参数
export interface SaveCondsResponse {
  data: {
    details: SavedView
  }
}
// 索引列表查询参数
export interface IndexListParams {
  dataSourceId: string
}
// 索引列表响应
export interface IndexListResponse {
  data: {
    total?: number
    list?: []
  }
}

/** option */
export interface IOptionsItem {
  /** id */
  id: string
  /** 名称 */
  name: string
}

/** 获取索引列表入参 */
export interface IGetIndexListApiParams {
  /** 数据源id */
  dataSourceId: string
  /** 索引类型 */
  indexType: IndexType
}
