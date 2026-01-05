import { DOMAIN_STATUS, SSL_STATUS, IS_WALL } from '~/api/domainManagement/common/constants'

/** 获取列表入参 */
export interface IGetListParams {
  /** 监控对象 */
  domain: string
  /** 页码 */
  page: number
  /** 每页几条 */
  pageSize: number
  /** 域名状态 */
  domainStatus: DOMAIN_STATUS
  /** ssl状态 */
  sslStatus: SSL_STATUS
  /** 是否被墙 */
  isWall: IS_WALL
}

/** item */
export interface IListItem {
  /** 标识 */
  id: string
  /** 域名 */
  domain: string
  /** 域名到期时间 */
  domainExpiryDate: string
  /** 域名状态 */
  domainStatus: DOMAIN_STATUS
  /** 证书到期时间 */
  certExpiryDate: string
  /** 证书状态 */
  certStatus: SSL_STATUS
  /** 是否被污染 */
  polluted: boolean
  /** 是否被阻断（可达性） */
  blocked: boolean
  /** 页面访问 http 消息 */
  httpMessage: string
  /** DNS 信息 */
  dnsInfo: Record<string, any>
  /** 备案信息 */
  filingInfo: Record<string, any>
}

/** 域名替换记录 */
export interface IRecordItem {
  /** 标识 */
  id: string
  /** 时间 */
  time: string
  /** 旧域名 */
  oldDomain: string
  /** 新域名 */
  newDomain: string
  /** 替换状态 */
  status: string
}

/** 替换域名 */
export interface IReplaceDomainReq {
  /** 标识 */
  id: string
  /** 旧域名 */
  oldDomain: string
  /** 新域名 */
  newDomain: string
}
