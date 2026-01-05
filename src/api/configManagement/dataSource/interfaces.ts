// 数据源类型枚举
export enum DataSourceType {
  TYPE_UNKNOWN = 'TYPE_UNKNOWN',
  STAR_VIEW = 'STAR_VIEW',
  ELASTIC_SEARCH = 'ELASTIC_SEARCH',
  OPEN_SEARCH = 'OPEN_SEARCH',
  PROMETHEUS = 'PROMETHEUS',
}

// 数据源类型选项
export const dataSourceTypeOptions = [
  { label: '全部', value: 'All' },
  { label: 'Prometheus', value: DataSourceType.PROMETHEUS },
  { label: 'ES', value: DataSourceType.ELASTIC_SEARCH },
  { label: 'OpenSearch', value: DataSourceType.OPEN_SEARCH },
]

// 数据类型枚举
export enum DataType {
  DATA_TYPE_UNKNOWN = 'DATA_TYPE_UNKNOWN',
  METRICS = 'METRICS',
  LOG = 'LOG',
}

// 数据源类型选项
export const dataTypeOptions = [
  { label: '全部', value: 'All' },
  { label: '日志', value: DataType.LOG },
  { label: '指标', value: DataType.METRICS },
]

// 来源枚举
export enum Source {
  SOURCE_UNKNOWN = 'SOURCE_UNKNOWN',
  BUILT_IN = 'BUILT_IN',
  EXTERNAL = 'EXTERNAL',
}

// 认证方式枚举
export enum AuthType {
  AUTH_TYPE_UNKNOWN = 'AUTH_TYPE_UNKNOWN',
  NONE = 'NONE',
  BASIC_AUTH = 'BASIC_AUTH',
}

// 版本枚举
export enum Version {
  VERSION_UNKNOWN = 'VERSION_UNKNOWN',
  UPTO_ES710_SERIES = 'UPTO_ES710_SERIES',
  ES8_SERIES = 'ES8_SERIES',
  ES9_SERIES = 'ES9_SERIES',
}

// HTTP标头接口
export interface HttpHeader {
  key: string
  value: string
}

// ElasticSearch配置接口
export interface ElasticSearchConfig {
  url: string
  authType: AuthType
  username?: string
  password?: string
  skipTlsVerify: boolean
  httpHeader: HttpHeader[]
  timeout: number
  version: Version
  maxShard: number
  timeFieldName: string
}

export interface PrometheusConfig {
  url: string
  authType: AuthType
  username?: string
  password?: string
  skipTlsVerify: boolean
  httpHeader: HttpHeader[]
  timeout: number
  type: PrometheusType
}

export enum PrometheusType {
  TYPE_UNKNOWN = 'TYPE_UNKNOWN',
  PROMETHEUS = 'PROMETHEUS',
  VICTORIA_METRICS = 'VICTORIA_METRICS',
}

export interface OpenSearchConfig {
  url: string
  authType: AuthType
  username?: string
  password?: string
  skipTlsVerify: boolean
  httpHeader: HttpHeader[]
  timeout: number
  version: OpenSearchVersion
  maxShard: number
  timeFieldName: string
}

export enum OpenSearchVersion {
  VERSION_UNKNOWN = 'VERSION_UNKNOWN',
  OS1_SERIES = 'OS1_SERIES',
  OS2_SERIES = 'OS2_SERIES',
  OS3_SERIES = 'OS3_SERIES',
}

// StarView配置接口
export interface StarViewConfig {
  url: string
  authType: AuthType
  username?: string
  password?: string
  skipTlsVerify: boolean
  httpHeader: HttpHeader[]
  timeout: number
}

// 数据源详情接口
export interface DataSourceDetailResponse {
  data: {
    id?: string
    datasource?: {
      id: string
      name: string
      type: DataSourceType
      dataType: DataType
      description: string
      source: Source
      createdAt: string
      updatedAt: string
      elasticSearch?: ElasticSearchConfig
      prometheus?: PrometheusConfig
      openSearch?: OpenSearchConfig
      starView?: StarViewConfig
    }
  }
}

// 数据源详情
export interface DataSourceDetail {
  id: string
  name: string
  type: DataSourceType
  dataType: DataType
  description: string
  source: Source
  createdAt: string
  updatedAt: string
  elasticSearch?: ElasticSearchConfig
  prometheus?: PrometheusConfig
  openSearch?: OpenSearchConfig
  starView?: StarViewConfig
}

// 数据源列表查询参数
export interface DataSourceListParams {
  page?: number
  pageSize?: number
  name?: string
  type?: DataSourceType
  dataType?: DataType
  pagination?: {
    page: number
    pageSize: number
    total: number
  }
}

// 数据源列表响应
export interface DataSourceListResponse {
  data?: {
    list?: [
      {
        id: string
        name: string
      },
    ]
    total?: number
    page?: number
    pageSize?: number
  }
}

// 数据源列表响应2
export interface IDataSourceItem {
  [key: string]: any
}

// 创建数据源参数
export interface CreateDataSourceParams {
  id?: string
  name: string
  type: DataSourceType
  dataType: DataType
  description?: string
  elasticSearch?: ElasticSearchConfig
  prometheus?: PrometheusConfig
  openSearch?: OpenSearchConfig
  starView?: StarViewConfig
}

// 更新数据源参数
export interface UpdateDataSourceParams extends CreateDataSourceParams {
  id: string
}
