// 相对时间选项常量
export const RELATIVE_TIME_OPTIONS = [
  // 过去时间选项
  { label: '秒前', value: 'seconds' },
  { label: '分钟前', value: 'minutes' },
  { label: '小时前', value: 'hours' },
  { label: '天前', value: 'days' },
  { label: '周前', value: 'weeks' },
  { label: '月前', value: 'months' },
  { label: '年前', value: 'years' },
  // 未来时间选项
  { label: '秒后', value: 'seconds_from_now' },
  { label: '分钟后', value: 'minutes_from_now' },
  { label: '小时后', value: 'hours_from_now' },
  { label: '天后', value: 'days_from_now' },
  { label: '周后', value: 'weeks_from_now' },
  { label: '月后', value: 'months_from_now' },
  { label: '年后', value: 'years_from_now' },
] as const

// 相对时间单位类型
export type RelativeTimeUnit = (typeof RELATIVE_TIME_OPTIONS)[number]['value']

// 默认相对时间设置
export const DEFAULT_RELATIVE_AMOUNT = 3
export const DEFAULT_RELATIVE_UNIT: RelativeTimeUnit = 'weeks'

// 时间格式化选项
export const DATE_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'short',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
}

// 弹框配置
export const POPOVER_CONFIG = {
  width: 520,
  placement: 'bottom-start' as const,
}

// 时间选择器标签页
export const TIME_TABS = [
  { label: 'Absolute', value: 'absolute' },
  { label: 'Relative', value: 'relative' },
  { label: 'Now', value: 'now' },
] as const

export type TimeTab = (typeof TIME_TABS)[number]['value']

// 预定义时间范围选项
export const PREDEFINED_TIME_OPTIONS = [
  { label: '15m', description: '过去15分钟', value: 15 },
  { label: '1h', description: '过去1小时', value: 60 },
  { label: '4h', description: '过去4小时', value: 240 },
  { label: '1d', description: '过去一天', value: 1440 },
  { label: '2d', description: '过去2天', value: 2880 },
  { label: '3d', description: '过去3天', value: 4320 },
  { label: '1w', description: '过去7天', value: 10080 },
  { label: '15d', description: '过去15天', value: 21600 },
  { label: '1mo', description: '过去1个月', value: 43200 },
] as const

export type PredefinedTimeOption = (typeof PREDEFINED_TIME_OPTIONS)[number]
