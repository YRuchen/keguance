/** 饼图数据项 */
export interface IPieChartDataItem {
  /** 值 */
  value: number
  /** 百分比 */
  percent: number
  /** 名称 */
  name: string
}

/** 饼图响应 */
export interface IPieChartResponse {
  /** 总数 */
  total: number
  /** 数据 */
  data: IPieChartDataItem[]
}

/** 柱状图响应 */
export interface IBarChartResponse {
  /** 摘要信息 */
  summary?: Array<{
    key: string
    value: string
  }>
  /** 分类 */
  category: string[]
  /** 系列数据 */
  series: Array<{
    name: string
    data: number[]
  }>
}

/** 折线图数据项 */
export interface ILineChartDataItem {
  /** 时间 */
  time: string
  /** 值 */
  value: number
}

/** 折线图响应 */
export interface ILineChartResponse {
  /** 系列数据 */
  series: Array<{
    name: string
    data: ILineChartDataItem[]
  }>
}

/** 表格数据项 */
export interface ITableDataItem {
  /** 排名 */
  rank: number
  /** 域名/地址 */
  domain: string
  /** 告警次数 */
  count: number
}

/** 表格响应 */
export interface ITableResponse {
  /** 列表 */
  list: ITableDataItem[]
}

/** 地图省份详情 */
export interface IMapProvinceDetail {
  /** 城市 */
  city: string
  /** 运营商 */
  isp: string
  /** 值 */
  value: number
}

/** 地图省份数据 */
export interface IMapProvinceData {
  /** 平均值 */
  avg: number
  /** 详情 */
  detail: IMapProvinceDetail[]
}

/** 地图最快/最慢 */
export interface IMapFastestSlowest {
  /** 城市 */
  city: string
  /** 运营商 */
  isp: string
  /** 值 */
  value: number
}

/** 地图响应 */
export interface IMapResponse {
  /** 节点数 */
  num: number
  /** 省份数据 */
  subdivisions: Record<string, IMapProvinceData>
  /** 平均值 */
  avg: number
  /** 最快 */
  fastest: IMapFastestSlowest
  /** 最慢 */
  slowest: IMapFastestSlowest
}

/** 运营商响应时间响应 */
export interface IOperatorResponseTimeResponse {
  /** 分类 */
  category: string[]
  /** 系列数据 */
  series: Array<{
    name: string
    data: number[]
    label?: string[]
  }>
}

/** 请求参数 */
export interface IChartRequest {
  /** 域名/地址 */
  domain?: string
  /** 执行任务的开始时间（ISO RFC-3339 格式） */
  fromTime?: string
  /** 搜索关键字 */
  keyword?: string
  /** 面板ID */
  panelId?: string
  /** 面板宽度（单位px） */
  panelWidth?: number
  /** 执行节点运营商 */
  probeIspName?: string
  /** 执行节点所属地区 */
  probeRegionName?: string
  /** 执行节点所属省份 */
  probeSubdivision?: string
  /** 任务类型 */
  subType?: 'SUB_TYPE_UNKNOWN' | 'HTTP' | 'TCP' | 'UDP' | 'ALL' | 'GRPC' | 'SSL' | 'DNS' | 'WEBSOCKET'
  /** 任务 ID */
  testId?: string
  /** 执行时间 */
  time?: string
  /** 执行任务的结束时间（ISO RFC-3339 格式） */
  toTime?: string
  [property: string]: any
}

