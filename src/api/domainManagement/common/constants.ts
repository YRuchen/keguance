/** 域名状态 */
export enum DOMAIN_STATUS {
  /** 全部 */
  EXPIRY_STATUS_ALL = 'EXPIRY_STATUS_ALL',
  /** 已过期 */
  EXPIRY_STATUS_EXPIRED = 'EXPIRY_STATUS_EXPIRED',
  /** 马上到期:小于1天 */
  EXPIRY_STATUS_ALMOST_EXPIRED = 'EXPIRY_STATUS_ALMOST_EXPIRED',
  /** 即将到期:1到7天 */
  EXPIRY_STATUS_NEAR_EXPIRED = 'EXPIRY_STATUS_NEAR_EXPIRED',
  /** 未到期:大于等于7天 */
  EXPIRY_STATUS_NORMAL = 'EXPIRY_STATUS_NORMAL',
  /** 失败:除前4种状态的兜底状态 */
  EXPIRY_STATUS_FAIL = 'EXPIRY_STATUS_FAIL',
}
/** 域名状态options */
export const domainStatusOptions = [
  { label: '全部', value: DOMAIN_STATUS.EXPIRY_STATUS_ALL },
  { label: '已过期', value: DOMAIN_STATUS.EXPIRY_STATUS_EXPIRED },
  { label: '马上到期', value: DOMAIN_STATUS.EXPIRY_STATUS_ALMOST_EXPIRED },
  { label: '即将到期', value: DOMAIN_STATUS.EXPIRY_STATUS_NEAR_EXPIRED },
  { label: '未到期', value: DOMAIN_STATUS.EXPIRY_STATUS_NORMAL },
  { label: '失败', value: DOMAIN_STATUS.EXPIRY_STATUS_FAIL },
]
/** 域名状态 */
export const domainStatusMap = {
  [DOMAIN_STATUS.EXPIRY_STATUS_ALL]: {
    label: '全部', type: 'info',
  },
  [DOMAIN_STATUS.EXPIRY_STATUS_EXPIRED]: {
    label: '已过期', type: 'danger',
  },
  [DOMAIN_STATUS.EXPIRY_STATUS_ALMOST_EXPIRED]: {
    label: '马上到期', type: 'warning',
  },
  [DOMAIN_STATUS.EXPIRY_STATUS_NEAR_EXPIRED]: {
    label: '即将到期', type: 'primary',
  },
  [DOMAIN_STATUS.EXPIRY_STATUS_NORMAL]: {
    label: '未到期', type: 'success',
  },
  [DOMAIN_STATUS.EXPIRY_STATUS_FAIL]: {
    label: '失败', type: 'danger',
  },
}
/** ssl状态 */
export enum SSL_STATUS {
  /** 全部 */
  EXPIRY_STATUS_ALL = 'EXPIRY_STATUS_ALL',
  /** 已过期 */
  EXPIRY_STATUS_EXPIRED = 'EXPIRY_STATUS_EXPIRED',
  /** 马上到期:小于1天 */
  EXPIRY_STATUS_ALMOST_EXPIRED = 'EXPIRY_STATUS_ALMOST_EXPIRED',
  /** 即将到期:1到7天 */
  EXPIRY_STATUS_NEAR_EXPIRED = 'EXPIRY_STATUS_NEAR_EXPIRED',
  /** 未到期:大于等于7天 */
  EXPIRY_STATUS_NORMAL = 'EXPIRY_STATUS_NORMAL',
  /** 失败:除前4种状态的兜底状态 */
  EXPIRY_STATUS_FAIL = 'EXPIRY_STATUS_FAIL',
}
/** ssl状态options */
export const sslStatusOptions = [
  { label: '全部', value: DOMAIN_STATUS.EXPIRY_STATUS_ALL },
  { label: '已过期', value: DOMAIN_STATUS.EXPIRY_STATUS_EXPIRED },
  { label: '马上到期', value: DOMAIN_STATUS.EXPIRY_STATUS_ALMOST_EXPIRED },
  { label: '即将到期', value: DOMAIN_STATUS.EXPIRY_STATUS_NEAR_EXPIRED },
  { label: '未到期', value: DOMAIN_STATUS.EXPIRY_STATUS_NORMAL },
  { label: '失败', value: DOMAIN_STATUS.EXPIRY_STATUS_FAIL },
]

/** ssl状态 */
export const sslStatusMap = {
  [DOMAIN_STATUS.EXPIRY_STATUS_ALL]: {
    label: '全部', type: 'info',
  },
  [DOMAIN_STATUS.EXPIRY_STATUS_EXPIRED]: {
    label: '已过期', type: 'danger',
  },
  [DOMAIN_STATUS.EXPIRY_STATUS_ALMOST_EXPIRED]: {
    label: '马上到期', type: 'warning',
  },
  [DOMAIN_STATUS.EXPIRY_STATUS_NEAR_EXPIRED]: {
    label: '即将到期', type: 'primary',
  },
  [DOMAIN_STATUS.EXPIRY_STATUS_NORMAL]: {
    label: '未到期', type: 'success',
  },
  [DOMAIN_STATUS.EXPIRY_STATUS_FAIL]: {
    label: '失败', type: 'danger',
  },
}

/** 劫持状态 */
enum HijackStatus {
  /** 全部 */
  HIJACK_STATUS_ALL = 'HIJACK_STATUS_ALL',
  /** 被劫持 */
  HIJACK_STATUS_TRUE = 'HIJACK_STATUS_TRUE',
  /** 未被劫持，正常 */
  HIJACK_STATUS_FALSE = 'HIJACK_STATUS_FALSE',
  /** 失败：是兜底状态 */
  HIJACK_STATUS_FAIL = 'HIJACK_STATUS_FAIL',
}
/** 劫持状态options */
export const hijackStatusOptions = [
  { label: '全部', value: HijackStatus.HIJACK_STATUS_ALL },
  { label: '被劫持', value: HijackStatus.HIJACK_STATUS_TRUE },
  { label: '未被劫持', value: HijackStatus.HIJACK_STATUS_FALSE },
  { label: '失败', value: HijackStatus.HIJACK_STATUS_FAIL },
]

/** 劫持状态 */
export const hijackStatusMap = {
  [HijackStatus.HIJACK_STATUS_ALL]: {
    label: '全部', type: 'info',
  },
  [HijackStatus.HIJACK_STATUS_TRUE]: {
    label: '被劫持', type: 'danger',
  },
  [HijackStatus.HIJACK_STATUS_FALSE]: {
    label: '未被劫持', type: 'success',
  },
  [HijackStatus.HIJACK_STATUS_FAIL]: {
    label: '失败', type: 'danger',
  },
}

/** 被墙检测状态 */
export enum WallStatus {
  /** 全部 */
  WALL_STATUS_ALL = 'WALL_STATUS_ALL',
  /** 被墙 */
  WALL_STATUS_TRUE = 'WALL_STATUS_TRUE',
  /** 未被墙，正常 */
  WALL_STATUS_FALSE = 'WALL_STATUS_FALSE',
  /** 失败：是兜底状态 */
  WALL_STATUS_FAIL = 'WALL_STATUS_FAIL',
}
/** 被墙检测状态options */
export const wallStatusOptions = [
  { label: '全部', value: WallStatus.WALL_STATUS_ALL },
  { label: '被墙', value: WallStatus.WALL_STATUS_TRUE },
  { label: '未被墙', value: WallStatus.WALL_STATUS_FALSE },
  { label: '失败', value: WallStatus.WALL_STATUS_FAIL },
]

/** 被墙检测状态 */
export const wallStatusMap = {
  [WallStatus.WALL_STATUS_ALL]: {
    label: '全部', type: 'info',
  },
  [WallStatus.WALL_STATUS_TRUE]: {
    label: '被墙', type: 'danger',
  },
  [WallStatus.WALL_STATUS_FALSE]: {
    label: '未被墙', type: 'success',
  },
  [WallStatus.WALL_STATUS_FAIL]: {
    label: '失败', type: 'danger',
  },
}

/** 污染检测状态 */
export enum PolluteStatus {
  /** 全部 */
  POLLUTE_STATUS_ALL = 'POLLUTE_STATUS_ALL',
  /** 被污染 */
  POLLUTE_STATUS_TRUE = 'POLLUTE_STATUS_TRUE',
  /** 未被污染，正常 */
  POLLUTE_STATUS_FALSE = 'POLLUTE_STATUS_FALSE',
  /** 不存在或错误的域名 */
  POLLUTE_STATUS_WRONG_DOMAIN = 'POLLUTE_STATUS_WRONG_DOMAIN',
  /** 失败：是兜底状态 */
  POLLUTE_STATUS_FAIL = 'POLLUTE_STATUS_FAIL',
}
/** 污染检测状态options */
export const polluteStatusOptions = [
  { label: '全部', value: PolluteStatus.POLLUTE_STATUS_ALL },
  { label: '被污染', value: PolluteStatus.POLLUTE_STATUS_TRUE },
  { label: '未被污染', value: PolluteStatus.POLLUTE_STATUS_FALSE },
  { label: '不存在或错误的域名', value: PolluteStatus.POLLUTE_STATUS_WRONG_DOMAIN },
  { label: '失败', value: PolluteStatus.POLLUTE_STATUS_FAIL },
]

/** 污染检测状态 */
export const polluteStatusMap = {
  [PolluteStatus.POLLUTE_STATUS_ALL]: {
    label: '全部', type: 'info',
  },
  [PolluteStatus.POLLUTE_STATUS_TRUE]: {
    label: '被污染', type: 'danger',
  },
  [PolluteStatus.POLLUTE_STATUS_FALSE]: {
    label: '未被污染', type: 'success',
  },
  [PolluteStatus.POLLUTE_STATUS_WRONG_DOMAIN]: {
    label: '不存在或错误的域名', type: 'warning',
  },
  [PolluteStatus.POLLUTE_STATUS_FAIL]: {
    label: '失败', type: 'danger',
  },
}

/** DNS状态 */
export enum DNSStatus {
  /** 全部 */
  DNS_STATUS_ALL = 'DNS_STATUS_ALL',
  /** 正常 */
  DNS_STATUS_NORMAL = 'DNS_STATUS_NORMAL',
  /** 自定义DNS服务器不可用 */
  DNS_STATUS_SERVER_UNAVAILABLE = 'DNS_STATUS_SERVER_UNAVAILABLE',
  /** DNS解析错误 */
  DNS_STATUS_RESOLVE_ERROR = 'DNS_STATUS_RESOLVE_ERROR',
  /** 失败：是兜底状态 */
  DNS_STATUS_FAIL = 'DNS_STATUS_FAIL',
}
/** DNS状态 */
export const dnsStatusOptions = [
  { label: '全部', value: DNSStatus.DNS_STATUS_ALL },
  { label: '正常', value: DNSStatus.DNS_STATUS_NORMAL },
  { label: '自定义DNS服务器不可用', value: DNSStatus.DNS_STATUS_SERVER_UNAVAILABLE },
  { label: 'DNS解析错误', value: DNSStatus.DNS_STATUS_RESOLVE_ERROR },
  { label: '失败', value: DNSStatus.DNS_STATUS_FAIL },
]

/** DNS状态 */
export const dnsStatusMap = {
  [DNSStatus.DNS_STATUS_ALL]: {
    label: '全部', type: 'info',
  },
  [DNSStatus.DNS_STATUS_NORMAL]: {
    label: '正常', type: 'success',
  },
  [DNSStatus.DNS_STATUS_SERVER_UNAVAILABLE]: {
    label: '自定义DNS服务器不可用', type: 'warning',
  },
  [DNSStatus.DNS_STATUS_RESOLVE_ERROR]: {
    label: 'DNS解析错误', type: 'danger',
  },
  [DNSStatus.DNS_STATUS_FAIL]: {
    label: '失败', type: 'danger',
  },
}

/** ICP状态 */
export enum ICPStatus {
  /** 全部 */
  ICP_STATUS_ALL = 'ICP_STATUS_ALL',
  /** 已备案 */
  ICP_STATUS_TRUE = 'ICP_STATUS_TRUE',
  /** 未备案 */
  ICP_STATUS_FALSE = 'ICP_STATUS_FALSE',
  /** 失败：是兜底状态 */
  ICP_STATUS_FAIL = 'ICP_STATUS_FAIL',
}
/** ICP状态 */
export const icpStatusOptions = [
  { label: '全部', value: ICPStatus.ICP_STATUS_ALL },
  { label: '已备案', value: ICPStatus.ICP_STATUS_TRUE },
  { label: '未备案', value: ICPStatus.ICP_STATUS_FALSE },
  { label: '失败', value: ICPStatus.ICP_STATUS_FAIL },
]

/** ICP状态 */
export const icpStatusMap = {
  [ICPStatus.ICP_STATUS_ALL]: {
    label: '全部', type: 'info',
  },
  [ICPStatus.ICP_STATUS_TRUE]: {
    label: '已备案', type: 'success',
  },
  [ICPStatus.ICP_STATUS_FALSE]: {
    label: '未备案', type: 'danger',
  },
  [ICPStatus.ICP_STATUS_FAIL]: {
    label: '失败', type: 'danger',
  },
}

/** 监控状态 */
export enum InspectStatus {
  /** 全部 */
  ALL = 'INSPECT_STATUS_ALL',
  /** 异常 */
  ABNORMAL = 'INSPECT_STATUS_ABNORMAL',
  /** 正常 */
  NORMAL = 'INSPECT_STATUS_NORMAL',
}

/** 任务类型 */
export enum TaskType {
  /** ICP检测任务 */
  TASK_TYPE_ICP = 'TASK_TYPE_ICP',
  /** DNS检测任务 */
  TASK_TYPE_DNS = 'TASK_TYPE_DNS',
  /** 劫持检测任务 */
  TASK_TYPE_HIJACK = 'TASK_TYPE_HIJACK',
  /** SSL 过期检测任务 */
  TASK_TYPE_SSL = 'TASK_TYPE_SSL',
  /** 域名过期检测任务 */
  TASK_TYPE_DOMAIN = 'TASK_TYPE_DOMAIN',
  /** 被墙检测任务 */
  TASK_TYPE_WALL = 'TASK_TYPE_WALL',
  /** 污染检测任务 */
  TASK_TYPE_POLLUTION = 'TASK_TYPE_POLLUTION',
}

/** 通知渠道 */
export enum NoticeChannel {
  /** TELEGRAM */
  TELEGRAM = 'telegram'
}
