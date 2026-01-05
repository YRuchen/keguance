/** 运行状态 */
export enum RunningStatus {
  /** 已暂停 */
  PAUSED = 'PAUSED',
  /** 运行中 */
  LIVE = 'LIVE',
}

/** 运行状态 */
export const runningStatusMap = {
  /** 已暂停 */
  [RunningStatus.PAUSED]: '已暂停',
  /** 运行中 */
  [RunningStatus.LIVE]: '运行中',
}

/** 任务类型 */
export enum TaskType {
  /** 成功 */
  SUCCESS = 'SUCCESS',
  /** 警告 */
  WARNING = 'WARNING',
}

/** 拨测结果 */
export enum ResultStatus {
  /** 正常 */
  PASSED = 'PASSED',
  /** 告警 */
  FAILED = 'FAILED',
  /** 全部 */
  ALL = 'ALL',
}

/** 拨测结果 */
export const resultStatusTextMap = {
  /** 正常 */
  [ResultStatus.PASSED]: '正常',
  /** 告警 */
  [ResultStatus.FAILED]: '告警',
  /** 全部 */
  [ResultStatus.ALL]: '全部',
}

/** 任务类型到拨测结果的映射 */
export const resultStatusMap = {
  /** 成功 */
  [TaskType.SUCCESS]: ResultStatus.PASSED,
  /** 警告 */
  [TaskType.WARNING]: ResultStatus.FAILED,
}

/** 任务类型label映射 */
export const taskTypeMap = {
  /** 成功 */
  [TaskType.SUCCESS]: '近1小时拨测正常任务数',
  /** 警告 */
  [TaskType.WARNING]: '近1小时拨测告警任务数',
}

/** 任务信息method */
export enum TaskMethod {
  /** HTTP */
  HTTP = 'http',
  /** TCP */
  TCP = 'tcp',
  /** UDP */
  UDP = 'udp',
  /** GRPC */
  GRPC = 'grpc',
  /** SSL */
  SSL = 'ssl',
  /** DNS */
  DNS = 'dns',
  /** WEBSOCKET */
  WEBSOCKET = 'websocket',
}

/** 任务信息method label映射 */
export const taskMethodMap = {
  [TaskMethod.HTTP]: 'http任务',
  [TaskMethod.TCP]: 'tcp任务',
  [TaskMethod.UDP]: 'udp任务',
  [TaskMethod.GRPC]: 'grpc任务',
  [TaskMethod.SSL]: 'ssl任务',
  [TaskMethod.DNS]: 'dns任务',
  [TaskMethod.WEBSOCKET]: 'websocket任务',
}

/** 任务执行结果 */
export enum TaskResultStatus {
  /** 成功 */
  PASSED = 'PASSED',
  /** 失败 */
  FAILED = 'FAILED',
  /** 全部（筛选项用） */
  ALL = 'ALL', // 后端要求 ‘全部’ 传空字符串
}

/** 任务执行结果 */
export const taskResultStatusOptions = [
  { label: '成功', value: TaskResultStatus.PASSED },
  { label: '失败', value: TaskResultStatus.FAILED },
  { label: '全部', value: TaskResultStatus.ALL },
]

/** 任务执行结果 */
export const taskResultStatusMap = {
  [TaskResultStatus.PASSED]: '成功',
  [TaskResultStatus.FAILED]: '失败',
  [TaskResultStatus.ALL]: '全部',
}

/** 任务执行结果 */
export const taskResultStatusStyleMap = {
  [TaskResultStatus.PASSED]: 'success',
  [TaskResultStatus.FAILED]: 'danger',
  [TaskResultStatus.ALL]: '全部',
}

/** HTTP版本 */
export enum HttpVersion {
  /** 仅HTTP/1.1 */
  HTTP1 = 'HTTP1',
  /** 仅HTTP/2 */
  HTTP2 = 'HTTP2',
  /** HTTP2回退到HTTP1.1 */
  any = 'ANY',
}

/** 协议类型 */
export enum Protocol {
  /** HTTP */
  HTTP = 'HTTP',
  /** TCP */
  TCP = 'TCP',
  /** UDP */
  UDP = 'UDP',
  /** GRPC */
  GRPC = 'GRPC',
  /** SSL */
  SSL = 'SSL',
  /** DNS */
  DNS = 'DNS',
  /** WEBSOCKET */
  WEBSOCKET = 'WEBSOCKET',
}
