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

/** 拨测结果 */
export enum ResultStatus {
  /** 正常 */
  PASSED = 'PASSED',
  /** 告警 */
  FAILED = 'FAILED',
  /** 全部 */
  ALL = 'ALL',
}
