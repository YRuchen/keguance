import { STATUS, DOMAIN_TYPE } from './constants'

/** item */
export interface IListItem {
  /** 标识 */
  id: string
  /** 源地址 */
  sourceStation1: string
  /** 域名 */
  domain: string
  /** 域名类型 */
  domainType: DOMAIN_TYPE
  /** 备用域名 */
  backupDomain: string
  /** 所属项目 */
  projectName: string
  /** 使用服务 */
  service: string
  /** 状态 */
  status: STATUS
  /** 域名到期时间 */
  domainExpiryDate: string
  /** 证书到期时间 */
  sslExpiryDate: string
  /** 使用中 */
  isActive: boolean
  /** CDN接入商 */
  cdnInfo: Record<string, any>
  /** 责任人 */
  responsiblePerson: string
  /** 开放端口 */
  openPorts: string[]
}

/** 详情 */
export type IDetail = IListItem

/** 创建/编辑 */
export type IDetailReq = IListItem
