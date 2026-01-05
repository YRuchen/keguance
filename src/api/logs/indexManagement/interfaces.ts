/** option */
export interface IOptionsItem {
  /** id */
  id: string
  /** 名称 */
  name: string
}
/** 过滤条件 */
interface IFilterCondition {
  /** 外层关系逻辑 */
  logic: string
  /** 条件 */
  conditions: IConditionItem[]
}
/** 条件 */
interface IConditionItem {
  /** 字段名 */
  field: string
  /** 操作符 */
  operator: string
  /** 值 */
  value: string
}
/** 索引模版-列 */
export interface IIndexTemplateListItem {
  /** 索引模板id */
  templateId: string
  /** 索引模板名称 */
  templateName: string
  /** 原始索引前缀 */
  indexPrefix: string
  /** 数据源ID */
  dataSourceId: string
  /** 数据源名称 */
  dataSourceName: string
  /** 过滤条件 */
  filterCondition: IFilterCondition
  /** 存储策略：数据保留天数 */
  retentionDays: number
  /** 权限配置：可见范围 */
  visibilityScope: string
  /** 创建人 */
  creator: string
  /** 更新人 */
  updater: string
  /** 创建时间 */
  createTime: string
  /** 更新时间 */
  updateTime: string
}

/** 获取日志采样列表接口入参 */
export interface IGetLogSampingListParams {
  /** 数据源id */
  dataSourceId: string
  /** 索引前缀 */
  indexPrefix: string
  /** 过滤条件 */
  filterConditions?: IConditionItem[]
}

/** 获取日志采样列表接口出参 */
export interface IGetLogSampingListRes {
  /** 时间 */
  timestamp: string
  /** json格式日志 */
  logJson: string
}

/** 原始索引-列 */
export interface IRawIndexListItem {
  /** 索引id */
  indexId: number
  /** 索引名 */
  indexName: string
  /** 数据源ID */
  dataSourceId: string
  /** 数据源名称 */
  dataSourceName: string
  /** 索引分片数 */
  numberOfShards: number
  /** 分片备份数 */
  numberOfReplicas: number
  /** 创建时间 */
  createTime: string
}

/** 新建索引 */
export interface ICreateIndexApiParams {
  /** 数据源ID */
  dataSourceId: string
  /** 索引名 */
  indexName: string
  /** 索引分片数 */
  numberOfShards: 0
  /** 分片备份数 */
  numberOfReplicas: 0
}
