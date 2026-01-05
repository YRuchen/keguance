import { RunningStatus, Protocol } from '~/api/availabilityMonitoring/constants'

/** 执行时间快捷选项 */
export enum ExecTimeFilter {
  /** 全部 */
  ALL = 'ALL',
  /** 今天 */
  TODAY = 'TODAY',
  /** 明天 */
  YESTERDAY = 'YESTERDAY',
}

/** 执行时间快捷选项 */
export const execTimeFilterOptions = [
  { label: '全部', value: ExecTimeFilter.ALL },
  { label: '今天', value: ExecTimeFilter.TODAY },
  { label: '昨天', value: ExecTimeFilter.YESTERDAY },
]

/** 运行状态映射 */
export const runningStatusMap = {
  [RunningStatus.LIVE]: {
    type: 'success',
    text: '运行中',
  },
  [RunningStatus.PAUSED]: {
    type: 'danger',
    text: '已暂停',
  },
}

/** 请求类型到建连耗时label的map */
export const tcpTimeLabelMap = {
  [Protocol.HTTP]: '建连耗时（connection）',
  [Protocol.TCP]: '建连耗时（connection）',
  [Protocol.UDP]: '建连耗时（connection）',
  [Protocol.GRPC]: '建连耗时（TCP+TLS握手）',
  [Protocol.SSL]: '建连耗时（TCP建连）',
  [Protocol.WEBSOCKET]: '建连耗时（TCP建连）',
}