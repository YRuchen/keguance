import { InspectStatus } from '~/api/domainManagement/common/constants'

/** 监控状态 */
export const inspectStatusMap = {
  /** 全部 */
  [InspectStatus.ALL]: {
    text: '全部',
    type: 'info',
  },
  /** 异常 */
  [InspectStatus.ABNORMAL]: {
    text: '异常',
    type: 'warning',
  },
  /** 正常 */
  [InspectStatus.NORMAL]: {
    text: '正常',
    type: 'primary',
  },
}

/** 监控状态 */
export const inspectStatusOptions = [
  { label: '全部', value: InspectStatus.ALL },
  { label: '异常', value: InspectStatus.ABNORMAL },
  { label: '正常', value: InspectStatus.NORMAL },
]

/** 通知渠道 */
export enum NoticeChannel {
  /** TELEGRAM */
  TELEGRAM = 'telegram'
}

/** 通知渠道 */
export const noticeChannelOptions = [
  { label: 'telegram', value: NoticeChannel.TELEGRAM }
]

/** 运营商 */
export enum Isp {
  '全部' = '',
  '移动' = '移动',
  '联通' = '联通',
  '电信' = '电信',
  '网通' = '网通',
}

/** 运营商 */
export const ispOptions = [
  { label: '全部', value: Isp['全部'] },
  { label: '移动', value: Isp['移动'] },
  { label: '联通', value: Isp['联通'] },
  { label: '电信', value: Isp['电信'] },
  { label: '网通', value: Isp['网通'] },
]

/** 结果类型 */
export enum StatusType {
  /** 全部 */
  ALL = 'ALL',
  /** 成功 */
  NORMAL = 'NORMAL',
  /** 异常 */
  ABNORMAL = 'ABNORMAL',
}

/** 结果类型 */
export const statusOptions = [
  { label: '全部', value: StatusType.ALL },
  { label: '正常', value: StatusType.NORMAL },
  { label: '异常', value: StatusType.ABNORMAL },
]

/** 状态类型到文案的映射 */
export const statusTypeMap = {
  [StatusType.ALL]: {
    type: 'success',
    text: '全部',
  },
  [StatusType.NORMAL]: {
    type: 'success',
    text: '成功',
  },
  [StatusType.ABNORMAL]: {
    type: 'danger',
    text: '失败',
  },
}
