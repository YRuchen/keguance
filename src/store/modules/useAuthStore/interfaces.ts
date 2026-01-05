import { AccountType } from './constants'

/** 用户信息 */
export interface IUserInfo {
  /** 用户名 */
  username: string
  /** 用户id */
  userId: string
  /** token */
  token: string
  /** 邮箱 */
  email: string
  /** 权限点 */
  roles: string[]
  /** 用户身份类型 */
  accountType: AccountType
  /** 组织id */
  orgId: string
  /** 租户id */
  tenantId: string
}
