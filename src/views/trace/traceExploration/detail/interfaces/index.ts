import { DataQueryResponse } from './dataFrame'
export * from './common'
export * from './dataFrame'
export * from './res'
export * from './data'

/** 数据转换后的出参 */
export interface IFormattedResResult {
  /** 图表格式 */
  chart: DataQueryResponse
  /** 键值对格式 */
  custom: Record<string, any>[]
}
