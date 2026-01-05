import { InspectStatus, TaskType } from './constants'

/** 获取外层列表接口入参 */
export interface IGetListParams {
  /** 任务类型 */
  taskType: TaskType
  /** 监控对象 */
  domain: string
  /** 页码 */
  page: number
  /** 页面几条数据 */
  pageSize: number
  /** 任务创建起始时间 */
  startDate: string
  /** 任务创建截止时间 */
  endDate: string
  /** 任务状态 */
  inspectStatus: InspectStatus
}
