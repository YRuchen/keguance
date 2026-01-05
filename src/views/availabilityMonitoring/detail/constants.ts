/**
 * 常量：全大写 + 下划线，例子：AA_BB_CC
 * enum：大驼峰，例子：AaBbCc
 * options：小驼峰，例子：aaBbCc
*/
/** TODO: 注意命名 */
import { HttpVersion, Protocol } from '~/api/availabilityMonitoring/constants'
export {
  AssertionsModeOptions,
  assertionsModeOptions,
  AssertionsRelation,
  assertionsRelationOptions,
  AssertionType,
  AssertionOperators,
  hashMap,
  ResponseTimeKey,
  responseTimeKeyOptions,
  Connection,
  assertionTypeOptionsMap2,
  protocolToAssertionMap,
} from './formSectionsSchema/constants'
export { HttpVersion, Protocol }

/** 协议类型枚举与实际key的映射 */
export const protocolKeyMap = {
  [Protocol.HTTP]: 'http',
  [Protocol.TCP]: 'tcp',
  [Protocol.UDP]: 'udp',
  [Protocol.GRPC]: 'grpc',
  [Protocol.SSL]: 'ssl',
  [Protocol.DNS]: 'dns',
  [Protocol.WEBSOCKET]: 'websocket',
}

/** 协议类型 */
export const protocolOptions = [
  { label: 'HTTP协议', value: Protocol.HTTP },
  { label: 'TCP协议', value: Protocol.TCP },
  { label: 'UDP协议', value: Protocol.UDP },
  { label: 'GRPC协议', value: Protocol.GRPC },
  { label: 'SSL协议', value: Protocol.SSL },
  { label: 'DNS协议', value: Protocol.DNS },
  { label: 'WEBSOCKET协议', value: Protocol.WEBSOCKET },
]

/** 请求类型 */
export enum Method {
  /** GET */
  GET = 'GET',
  /** POST */
  POST = 'POST',
  /** PUT */
  PUT = 'PUT',
  /** DELETE */
  DELETE = 'DELETE',
  /** PATCH */
  PATCH = 'PATCH',
  /** HEAD */
  HEAD = 'HEAD',
  /** OPTIONS */
  OPTIONS = 'OPTIONS',
}

/** 请求类型 */
export const methodOptions = [
  { label: 'GET', value: Method.GET },
  { label: 'POST', value: Method.POST },
  { label: 'PUT', value: Method.PUT },
  { label: 'DELETE', value: Method.DELETE },
  { label: 'PATCH', value: Method.PATCH },
  { label: 'HEAD', value: Method.HEAD },
  { label: 'OPTIONS', value: Method.OPTIONS },
]

/** HTTP版本 */
export const httpVersionOptions = [
  { label: '仅HTTP/1.1', value: HttpVersion.HTTP1 },
  { label: '仅HTTP/2', value: HttpVersion.HTTP2 },
  { label: 'HTTP2回退到HTTP1.1', value: HttpVersion.any },
]

/** 身份验证类型 */
export enum Auth {
  /** HTTP Basic Auth */
  BASIC = 'WEB',
  /** AWS Signature */
  AWS = 'SIGV4',
  /** OAuth2.0 */
  OAUTH2 = 'OAUTH',
}

/** 身份验证类型 */
export const authOptions = [
  { label: 'HTTP Basic Auth', value: Auth.BASIC },
  { label: 'AWS Signature', value: Auth.AWS },
  { label: 'OAuth2.0', value: Auth.OAUTH2 },
]

/** 授权类型 oauth2的选择资源类型 */
export enum OAuth2Mode {
  /** 客户端模式 */
  CLIENT = 'OAUTH_CLIENT',
  /** 密码模式 */
  PWD = 'OAUTH_ROP'
}

/** 授权类型 oauth2的选择资源类型 */
export const oAuth2ModeOptions = [
  { label: '客户端模式（Client credentials）', value: OAuth2Mode.CLIENT },
  { label: '资源所有者密码模式（Resource owner password）', value: OAuth2Mode.PWD },
]

/** 认证方式（Token API Authentication） */
export enum AuthMethod {
  /** HEAD */
  HEADER = 'HEADER',
  /** BODY */
  BODY = 'BODY',
}

/** 认证方式（Token API Authentication） */
export const authMethodOptions = [
  { label: 'Send as Basic Auth header', value: AuthMethod.HEADER },
  { label: 'Send client credentials in body', value: AuthMethod.BODY },
]

/** 请求体类型 */
export enum ReqContentType {
  /** application/json */
  APPLICATION_JSON = 'application/json',
  /** application/octet-stream TODO: MVP没有 */
  // APPLICATION_OCTET_STREAM = 'application/octet-stream',
  /** application/x-www-form-urlencoded */
  APPLICATION_X_WWW_FORM_URLENCODED = 'application/x-www-form-urlencoded',
  /** multipart/form-data */
  MULTIPART_FORM_DATA = 'multipart/form-data',
  /** text/html */
  TEXT_HTML = 'text/html',
  /** text/plain */
  TEXT_PLAIN = 'text/plain',
  /** text/xml */
  TEXT_XML = 'text/xml',
  /** GraphQL */
  GRAPHQL = 'GraphQL',
  /** None */
  NONE = 'None',
}

/** 请求体类型 */
export const reqContentTypeOptions = [
  { label: 'application/json', value: ReqContentType.APPLICATION_JSON, component: 'Input.TextArea', default: '' },
  // { label: 'application/octet-stream', value: ReqContentType.APPLICATION_OCTET_STREAM, component: 'Upload', default: {} },
  { label: 'application/x-www-form-urlencoded', value: ReqContentType.APPLICATION_X_WWW_FORM_URLENCODED, component: 'Input.TextArea', default: '' },
  { label: 'multipart/form-data', value: ReqContentType.MULTIPART_FORM_DATA, component: 'ArrayItems', default: [{ key: '', value: '' }] },
  { label: 'text/html', value: ReqContentType.TEXT_HTML, component: 'Input.TextArea', default: '' },
  { label: 'text/plain', value: ReqContentType.TEXT_PLAIN, component: 'Input.TextArea', default: '' },
  { label: 'text/xml', value: ReqContentType.TEXT_XML, component: 'Input.TextArea', default: '' },
  { label: 'GraphQL', value: ReqContentType.GRAPHQL, component: 'Input.TextArea', default: '' },
  { label: 'None', value: ReqContentType.NONE, component: 'Input.TextArea', default: '' },
]

/** 请求正文类型 */
export enum ReqContentMode {
  TEXT = 'TEXT',
  FILE = 'FILE',
}

/** 请求正文类型 TODO：内部的componentProps根本没用，考虑去除 */
export const reqContentModeOptions = [
  {
    label: '文本', 
    value: ReqContentMode.TEXT, 
  },
  {
    label: '文件', 
    value: ReqContentMode.FILE, 
  },
]

/** 任务监测频率类型 */
export enum MonitoringFrequencyType {
  /** 默认 */
  DEFAULT = 'DEFAULT',
  /** 自定义 */
  CUSTOM = 'ADVANCED',
}

/** 任务监测频率类型 */
export const monitoringFrequencyTypeOptions = [
  { label: '默认', value: MonitoringFrequencyType.DEFAULT },
  { label: '自定义', value: MonitoringFrequencyType.CUSTOM },
]

/** 任务监测频率 */
export enum MonitoringFrequency {
  /** 1分钟 */
  ONE_MIN = 60,
  /** 5分钟 */
  FIVE_MIN = 300,
  /** 15分钟 */
  FIFTEEN_MIN = 900,
  /** 30分钟 */
  THIRTY_MIN = 1800,
  /** 1小时 */
  ONE_H = 3600,
  /** 6小时 */
  SIX_H = 21600,
  /** 12小时 */
  TWELVE_H = 43200,
  /** 24小时 */
  TWENTY_FOUR_H = 86400,
}

/** 任务监测频率 */
export const monitoringFrequencyOptions = [
  { label: '1min', value: MonitoringFrequency.ONE_MIN },
  { label: '5min', value: MonitoringFrequency.FIVE_MIN },
  { label: '15min', value: MonitoringFrequency.FIFTEEN_MIN },
  { label: '30min', value: MonitoringFrequency.THIRTY_MIN },
  { label: '1h', value: MonitoringFrequency.ONE_H },
  { label: '6h', value: MonitoringFrequency.SIX_H },
  { label: '12h', value: MonitoringFrequency.TWELVE_H },
  { label: '24h', value: MonitoringFrequency.TWENTY_FOUR_H },
]

/** 任务监测频率，任务间隔的时间单位 */
export enum IntervalUnit {
  /** 秒 */
  SECOND = 'SECOND',
  /** 分钟 */
  MINUTE = 'MINUTE',
  /** 小时 */
  HOUR = 'HOUR',
  /** 天 */
  DAY = 'DAY',
}

/** 各单位对应的秒数 */
export const unitToSecondMap = {
  [IntervalUnit.SECOND]: 1,
  [IntervalUnit.MINUTE]: 60,
  [IntervalUnit.HOUR]: 3600,
  [IntervalUnit.DAY]: 86400,
}

/** 任务监测频率，任务间隔的时间单位 */
export const intervalUnitOptions = [
  { label: '秒', value: IntervalUnit.SECOND },
  { label: '分钟', value: IntervalUnit.MINUTE },
  { label: '小时', value: IntervalUnit.HOUR },
  { label: '天', value: IntervalUnit.DAY },
]

/** weeks */
export enum Weeks {
  /** Monday */
  Monday = 0,
  /** Tuesday */
  Tuesday = 1,
  /** Wednesday */
  Wednesday = 2,
  /** Thursday */
  Thursday = 3,
  /** Friday */
  Friday = 4,
  /** Saturday */
  Saturday = 5,
  /** Sunday */
  Sunday = 6,
}

/** weeks */
export const weeksOptions = [
  { label: '周一', value: Weeks.Monday },
  { label: '周二', value: Weeks.Tuesday },
  { label: '周三', value: Weeks.Wednesday },
  { label: '周四', value: Weeks.Thursday },
  { label: '周五', value: Weeks.Friday },
  { label: '周六', value: Weeks.Saturday },
  { label: '周日', value: Weeks.Sunday },
]

/** 告警优先级 */
export enum Priority {
  P1 = '1',
  P2 = '2',
  P3 = '3',
  P4 = '4',
}

/** 告警优先级 */
export const priorityOptions = [
  { label: 'p1（严重）', value: Priority.P1 },
  { label: 'p2（高）', value: Priority.P2 },
  { label: 'p3（中）', value: Priority.P3 },
  { label: 'p4（低）', value: Priority.P4 },
]

/** http默认值 */
export const httpDefault = {
  http: {
    timeout: 60,
    requestHeaders: [
      {
        key: '',
        value: ''
      }
    ],
    auth: {
      type: 'WEB'
    },
    params: [
      {
        key: '',
        value: ''
      }
    ],
    proxy: {
      header: [
        {
          key: '',
          value: ''
        }
      ]
    }
  }
}

/** tcp默认值 */
export const tcpDefault = {
  tcp: {
    "timeout": 60,
  },
}

/** udp默认值 */
export const udpDefault = {
  udp: {
    "timeout": 60,
  },
}

/** grpc默认值 TODO： 是否全量 */
export const grpcDefault = {
  grpc: {
    "timeout": 60,
  },
}

/** ssl默认值 TODO： 是否全量 */
export const sslDefault = {
  ssl: {
    "timeout": 60,
  },
}

/** dns默认值 TODO： 是否全量 */
export const dnsDefault = {
  dns: {
    "timeout": 60,
  },
}

/** 请求定义默认值map */
export const requestDefault = {
  [Protocol.HTTP]: httpDefault,
  [Protocol.TCP]: tcpDefault,
  [Protocol.UDP]: udpDefault,
  [Protocol.GRPC]: grpcDefault,
  [Protocol.SSL]: sslDefault,
  [Protocol.DNS]: dnsDefault,
}
