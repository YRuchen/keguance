

/** 时间类型枚举 */
export enum TimeType {
  /** 今天 */
  TODAY = 'TODAY',
  /** 昨天 */
  YESTERDAY = 'YESTERDAY',
  /** 近30天 */
  RECENT_7_DAYS = 'RECENT_7_DAYS',
  /** 自定义 */
  RECENT_30_DAYS = 'RECENT_30_DAYS',
}
/** 时间类型选项 */
export const timeTypeOptions = [
  { label: '今天', value: TimeType.TODAY },
  { label: '昨天', value: TimeType.YESTERDAY },
  { label: '近7天', value: TimeType.RECENT_7_DAYS },
  { label: '近30天', value: TimeType.RECENT_30_DAYS },
]


export enum TaskType {
  TASK_TYPE_ALL = 'TASK_TYPE_ALL', // 全部
  TASK_TYPE_ICP = 'TASK_TYPE_ICP',// ICP 检测任务
  TASK_TYPE_DNS = 'TASK_TYPE_DNS', // DNS 检测任务
  TASK_TYPE_HIJACK = 'TASK_TYPE_HIJACK', // 劫持检测任务
  TASK_TYPE_SSL = 'TASK_TYPE_SSL', // SSL 过期检测任务
  TASK_TYPE_DOMAIN = 'TASK_TYPE_DOMAIN', // 域名过期检测任务
  TASK_TYPE_WALL = 'TASK_TYPE_WALL', // 被墙检测任务
  TASK_TYPE_POLLUTION = 'TASK_TYPE_POLLUTION' // 污染检测任务
}
export const taskTypeOptions = [
  { label: '全部', value: TaskType.TASK_TYPE_ALL },
  { label: '劫持检测', value: TaskType.TASK_TYPE_HIJACK },
  { label: 'DNS检测', value: TaskType.TASK_TYPE_DNS },
  { label: '域名过期检测', value: TaskType.TASK_TYPE_DOMAIN },
  { label: 'SSL过期检测', value: TaskType.TASK_TYPE_SSL },
  { label: '被墙检测', value: TaskType.TASK_TYPE_WALL },
  { label: '污染检测', value: TaskType.TASK_TYPE_POLLUTION },
  { label: 'ICP检测', value: TaskType.TASK_TYPE_ICP },
]

export const InspectTypeMap: Partial<Record<TaskType, { url: string, localStorageName: string, iconName: string }>> = {
  [TaskType.TASK_TYPE_HIJACK]: { url: 'hijackDetectionView', localStorageName: 'hijackDetectionViewFilterParams', iconName: 'brightness_alert' },
  [TaskType.TASK_TYPE_DNS]: { url: 'dnsInspectOverview', localStorageName: 'dnsInspectViewFilterParams', iconName: 'dns' },
  [TaskType.TASK_TYPE_DOMAIN]: { url: 'domainDetail', localStorageName: 'domainInspectDetailFilterParams', iconName: 'domain_verification_off' },
  [TaskType.TASK_TYPE_SSL]: { url: 'sslDetail', localStorageName: 'sslInspectViewFilterParams', iconName: 'calendar_clock' },
  [TaskType.TASK_TYPE_WALL]: { url: 'inspectionWallDetail', localStorageName: 'inspectionWallInspectViewFilterParams', iconName: 'brick' },
  [TaskType.TASK_TYPE_POLLUTION]: { url: 'inspectionPollutionDetail', localStorageName: 'pollutionInspectionViewFilterParams', iconName: 'health_and_safety' },
  [TaskType.TASK_TYPE_ICP]: { url: 'inspectionICPDetail', localStorageName: 'ICPViewFilterParams', iconName: 'bookmark_manager' },
}

export type IconName = typeof InspectTypeMap[keyof typeof InspectTypeMap]['iconName']
export type DetectionStatus = 'normal' | 'error'


export interface DetectionCard {
  key: TaskType
  title: string
  status: DetectionStatus
  errorCount?: number
  iconName?: IconName
}

export interface DetectionStat {
  name: string
  total: number
  failed: number
}