/** 状态 */
export enum STATUS {
  /** 正常 */
  NORMAL = 'NORMAL',
  /** 未备案 */
  UNREG = 'UNREG',
  /** 快到期 */
  NEAR = 'NEAR',
  /** 已到期 */
  EXPIRED = 'EXPIRED',
}

/** 域名类型 */
export enum DOMAIN_TYPE {
  /** 生产 */
  PRO = 'PRO',
  /** 预生产 */
  PRE_PRO = 'PRE_PRO',
  /** 测试 */
  TEST = 'TEST',
  /** 开发 */
  DEV = 'DEV',
}
