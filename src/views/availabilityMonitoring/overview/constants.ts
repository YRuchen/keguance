/** 时间类型枚举 */
export enum TimeType {
  /** 最近一次 */
  LATEST = 'LATEST',
  /** 今天 */
  TODAY = 'TODAY',
  /** 全部 */
  ALL = 'ALL',
}

/** 时间类型 */
export const timeTypeOptions = [
  { label: '最近一次', value: TimeType.LATEST },
  { label: '今天', value: TimeType.TODAY },
  { label: '全部', value: TimeType.ALL },
]

/** 刷新频率 */
export enum RefreshRate {
  /** 30s */
  SECOND_30 = '30s',
  /** 1m */
  MINUTE_1 = '1m',
  /** 5m */
  MINUTE_5 = '5m',
  /** 30m */
  MINUTE_30 = '30m',
  /** 1h */
  HOUR_1 = '1h',
}

/** 刷新频率 */
export const refreshRateOptions = [
  { label: '30s', value: RefreshRate.SECOND_30 },
  { label: '1m', value: RefreshRate.MINUTE_1 },
  { label: '5m', value: RefreshRate.MINUTE_5 },
  { label: '30m', value: RefreshRate.MINUTE_30 },
  { label: '1h', value: RefreshRate.HOUR_1 },
]
