// 告警列表
export interface IOverviewAlarmListRequest {
  activeRange: string
  inspectType?: number | string
}

export interface IOverviewAlarmListResponse {
  list?: IOverviewAlarmItem[]
  [property: string]: any
}

export interface IOverviewAlarmItem {
  id?: string
  region?: string
  taskName?: string
  time?: string
  type: string
  typeLabel?: string
  [property: string]: any
}

// 探测次数柱状图
export interface IOverviewRecordHistogramResponse {
  list?: IOverviewRecordHistogramHist[]
  [property: string]: any
}

export interface IOverviewRecordHistogramHist {
  failed?: number
  name?: string
  total?: number
  [property: string]: any
}

// 汇总数据
export interface IOverviewSummaryResponse {
  list?: IOverviewSummaryItem[]
  [property: string]: any
}

export interface IOverviewSummaryItem {
  errorCount?: number
  key: string
  status?: string
  title?: string
  [property: string]: any
}

// 任务柱状图

export interface IOverviewTaskHistogramResponse {
  list?: IOverviewTaskHistogramHist[]
}

export interface IOverviewTaskHistogramHist {
  disabled?: number
  name?: string
  open?: number
}
