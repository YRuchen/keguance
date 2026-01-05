/** 监控状态 */
export enum InspectStatus {
  /** 异常 */
  ABNORMAL = 'abnormal',
  /** 正常 */
  NORMAL = 'normal',
}

/** 监控状态 */
export const inspectStatusMap = {
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
