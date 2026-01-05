import { NoticeChannel } from './formSectionsSchema/constants'
import { 
  Protocol, 
  Auth, 
  OAuth2Mode, 
  AuthMethod, 
  ReqContentType, 
  Method, 
  HttpVersion,
  AssertionsModeOptions,  // TODO: 下个版本是否需要上
  AssertionsRelation,
  MonitoringFrequencyType,
  MonitoringFrequency,
  Weeks,
  IntervalUnit,
  Priority,
  ReqContentMode,
  AssertionType,
  AssertionOperators,
} from './constants'
import { JsonPathFactor } from './formSectionsSchema/constants'

import type { Ref, VNode } from 'vue'
import type { Form } from '@formily/core'
import type { ISchema } from '@formily/vue'
import type { IUploadFile } from '~/interfaces/common'
import type { BasicTabs, ServiceDefinition } from './formSectionsSchema/defineRequest/constants'

/** commonUpload入参 */
export interface ICommonUploadParams {
  /** 标题 */
  label?: string
  /** 上传地址 */
  action?: string
  /** 按钮标题 */
  btnText: string
  /** 组件props */
  componentProps?: Record<string, any>
  /** 反射 */
  xReactions?: ISchema['x-reactions']
}

/** 生成通用tooltip入参 */
export interface ICommonToolTipParams {
  /** 默认插槽 */
  defaultSlot?: () => VNode
  /** 内容 */
  content: string
  /** 显示 */
  visible?: boolean
}

/** 生成末尾包含tooltip的container，入参 */
export interface ICommonToolTipContainer {
  /** schema */
  schema: Record<string, ISchema>
  /** container的x-reactions */
  xReactions?: ISchema['x-reactions']
  /** container的gap */
  size?: number
  /** tooltip icon */
  icon?: () => VNode
  /** tooltip 内容 */
  tooltip: string
}

/** 获取jsonSchema */
export interface IGetSchemaParams {
  /** 查看态 */
  isView: boolean
  /** label */
  label?: string
  /** 创建态 */
  isCreate?: boolean
  /** 表单实例 */
  form?: Ref<Form>
  /** 打开测试预览弹窗 */
  openEditor?: () => Promise<void>
}

/** 公共ArrayItem的item */
export interface ICommonArrayItem {
  /** key */
  key: string
  /** value */
  value: string
}

/** 代理 */
export interface IProxy {
  /** 代理请求头 */  
  header: ICommonArrayItem[]
  /** 代理服务器URL */
  url: string
}

/** formData类型的请求体内容 */
export interface IFormDataContent {
  /** 请求体内容类型 */
  type: string
  /** key */
  key: string
  /** value */
  value: string
}

/** 请求体内容 */
export interface IContent {
  /** multipart/form-data之外的内容 */
  content?: string
  /** multipart/form-data内容 */
  formData?: IFormDataContent[]
  /** 请求体类型 */
  type: ReqContentType
}

/** 断言 */
export interface IAssertion {
  /** 因子 */
  factor: string
  /** key */
  key: string
  /** 操作符 */
  operator: string
  /** 值 */
  value: string
  /** jsonpath因子 */
  jsonpathFactor: JsonPathFactor
  /** jsonpath值 */
  jsonpathValue: string
  /** jsonpath操作符 */
  jsonpathOperator: string
}

/** HTTP基本身份验证 */
export interface IBasic {
  /** userName */
  userName: string
  /** pwd */
  pwd: string
}

/** AWS 签名 */
export interface IAws {
  /** AWS 的访问密钥 ID（AccessKeyId） */
  keyId: string
  /** AWS 的访问密钥 Secret（Secret Access Key） */
  secret: string
  /** 目标 AWS 区域 */
  region: string
  /** AWS 服务名称 */
  service: string
  /** Session Token */
  token: string
}

/** oauth2 */
export interface IOauth2 {
  /** 授权类型 */
  mode: OAuth2Mode
  /** token 的URL（Access Token URL） */
  tokenUrl: string
  /** 用户名（Username） */
  userName: string
  /** 密码（Password） */
  pwd: string
  /** 客户端ID（Client ID） */
  clientId: string
  /** 客户端密匙（Client Secret） */
  clientSecret: string
  /** 认证方式（Token API Authentication） */
  authMethod: AuthMethod
  /** 【可选】客户端ID（Client ID） */
  optionalClientId: string
  /** 【可选】客户端密匙（Client Secret） */
  optionalClientSecret: string
  /** JWT令牌受众校验（Audience） */
  audience: string
  /** OAuth资源指示符 */
  resource: string
  /** 权限范围控制（Scope） */
  scope: string
}

/** 身份认证 */
export interface IAuth {
  /** 私钥（MVP不需要） */  
  privateKey: File
  /** 证书（MVP不需要） */  
  cert: File
  /** 身份认证类型 */  
  type: Auth
  /** HTTP基本身份验证 */
  basic: IBasic
  /** AWS 签名 */
  aws: IAws
  /** oauth2 */
  oauth2: IOauth2
}

/** http配置 */
export interface IHttp {
  /** 请求头 */  
  requestHeaders: ICommonArrayItem[]
  /** 身份认证 */
  auth: IAuth
  /** 证书 */
  cert: IUploadFile[]
  /** 私钥 */
  privateKey: IUploadFile[]
  /** 查询参数 */
  params: ICommonArrayItem[]
  /** 请求体内容 */
  content: IContent
  /** 代理 */
  proxy: IProxy
  /** 请求类型 */
  method: Method
  /** 请求地址 */
  url: string
  /** HTTP版本 */
  httpVersion: HttpVersion
  /** 跟随重定向 */
  followRedirects: boolean
  /** 跨域重定向保留cookie */
  keepCookie: boolean
  /** 跨域重定向时保留认证头信息 */
  keepAuth: boolean
  /** 忽略HTTP证书错误 */
  ignoreSSL: boolean
  /** 请求超时时间 */
  timeout: number
  /** cookie */
  cookie: string
  /** 不保存响应内容 */
  privacy: boolean
}

/** tcp配置 */
export interface ITcp {
  /** 主机ip地址 */
  host: string
  /** 端口 */
  port: string
  /** 超时时间 */
  timeout: number
  /** 路由跟踪 */
  track: boolean
}

/** udp配置 */
export interface IUdp {
  /** 主机ip地址 */
  host: string
  /** 端口 */
  port: string
  /** 要发送的UDP数据内容 */
  msg: string
  /** 超时时间 */
  timeout: number
}

/** grpc配置 */
export interface IGrpc {
  /** 主机ip地址 */
  host: string
  /** 端口 */
  port: string
  /** 超时时间 */
  timeout: string
  /** 忽略服务器证书错误 */
  insecureSkipVerify: string
  /** 证书（文件url） */
  cert: IUploadFile[]
  /** 私钥（文件url） */
  privateKey: IUploadFile[]
  /** 检查类型  */
  checkType: string
  /** grpc请求元数据 */
  metadata: Record<string, string>[]
  /** 服务定义类型 */
  serviceDefinitionType: ServiceDefinition
  /** 原型文件 */
  protoFile: IUploadFile[]
  /** grpc服务器名 */
  serviceName: string
  /** 调用方法 */
  method: string
  /** 请求消息体 */
  message: string
}

/** ssl配置 */
export interface ISsl {
  /** 主机ip地址 */
  host: string
  /** 端口 */
  port: string
  /** 超时时间 */
  timeout: string
  /** 允许自签名证书通过检测 */
  allowSelfSignedCert: string
  /** 发现吊销（revoked）证书判定任务失败 */
  failOnRevokedCert: string
  /** 证书链不完整时判定任务失败 */
  failOnIncompleteChain: string
  /** 服务器名称（SNI） */
  serverName: string
  /** 证书（文件url） */
  cert: IUploadFile[]
  /** 私钥（文件url） */
  privateKey: IUploadFile[]
}

/** dns配置 */
export interface IDns {
  /** 主机ip地址 */
  host: string
  /** 端口 */
  port: string
  /** 超时时间 */
  timeout: string
  /** DNS服务器 */
  dnsServer: string
}

/** websocket身份认证配置 */
interface IWebsocketAuth {
  /** 用户名 */
  username: string
  /** 密码 */
  password: string
}

/** websocket配置 */
export interface IWebsocket {
  /** 任务的目标地址 */
  url: string
  /** 测试消息 */
  message: string
  /** 超时时间 */
  timeout: number
  /** 请求头 */
  requestHeaders: Record<string, string>[]
  /** 测试消息是否采用base64格式编码 */
  messageBase64Encoded: boolean
  /** 身份认证 */
  auth: IWebsocketAuth
}

/** 请求定义 */
export interface IRequest {
  /** http配置 */
  http?: IHttp
  /** tcp配置 */
  tcp?: ITcp
  /** udp配置 */
  udp?: IUdp
  /** grpc配置 */
  grpc?: IGrpc
  /** ssl配置 */
  ssl?: ISsl
  /** dns配置 */
  dns?: IDns
  /** websocket配置 */
  websocket?: IWebsocket
}

/** 任务监测频率 */
interface IMonitoringFrequency {
  /** 任务监测频率类型 */
  type: MonitoringFrequencyType
  /** 默认 TODO: 这里的default key是否合适 */
  default: MonitoringFrequency
  /** 间隔 */
  value: number
  /** 任务监测频率单位 */
  unit: IntervalUnit
  /** 指定时间和日期 */
  useTimeRange: boolean
  /** weeks */
  weeks: Weeks[]
  /** 开始时间 */
  start: Date
  /** 结束时间 */
  end: Date
}

/** 告警配置 */
interface IWarning {
  /** 告警方式 */
  noticeChannel: NoticeChannel
  /** 渠道id */
  chatId: string
  /** token */
  token: string
  /** 告警优先级 */
  priority: Priority
  /** 通知内容 */
  content: string
}

/** 表单数据 */
export interface IFormData {
  /** 任务名称 */
  name: string
  /** grpc的检查类型 */
  basicActiveKey: BasicTabs
  /** 请求协议 */
  protocol: Protocol
  /** 请求定义 */
  request: IRequest
  /** 断言模式 */
  // assertionsMode: AssertionsModeOptions // TODO: 下个版本是否需要上
  /** 断言间关系 */
  relation: AssertionsRelation
  /** 断言 */
  assertion: IAssertion[]
  /** 位置 */
  locations: string[]
  /** 任务监测频率 */
  monitoringFrequency: IMonitoringFrequency
  /** 告警配置 */
  warningConfig: IWarning
}

/** HTTP基本身份验证 */
export interface IResBasic {
  /** 基本身份验证使用的用户名 */
  username: string
  /** 基本身份验证使用的密码 */
  password: string
}

/** AWS 签名 */
export interface IResAws {
  /** 访问密钥 ID */
  accessKey: string
  /** 访问密钥 Secret */
  secretKey: string
  /** 目标 AWS 区域 */
  region: string
  /** AWS 服务名称 */
  serviceName: string
  /** 会话令牌 */
  sessionToken: string
}

/** oauth2 */
export interface IResOauth2 {
  /** 获取访问令牌的 URL */
  accessTokenUrl: string
  /** 用户名 */
  username: string
  /** 密码 */
  password: string
  /** 客户端 ID（可选） */
  clientId: string
  /** 客户端密钥（可选） */
  clientSecret: string
  /** 使用的身份验证受众 */
  audience: string
  /** 使用的身份验证资源 */
  resource: string
  /** 使用的身份验证作用域 */
  scope: string
  /** 用于身份验证的令牌类型 */
  tokenApiAuthentication: AuthMethod
  /** 授权类型 TODO：等后端加字段 */
  type: OAuth2Mode
}

/** -- 接口返回的表单数据格式 -- */
export interface IResAuth {
  /** 使用的身份验证类型 */
  type: Auth
  /** 处理基本身份验证的对象（HTTP Basic Auth，对应type为WEB） */
  web: IResBasic
  /** 处理 SIGV4 身份验证的对象（AWS Signature，对应type为SIGV4） */
  sigv4: IResAws
  /** oauth2 */
  oauth: IResOauth2
}

/** 出参multipart/form-data的请求体内容 */
export type IResBodyContentForm = Record<string, {
  /** 文本/文件 */
  type: ReqContentMode
  /** 文本 */
  value: string
  /** 文件 */
  file: IUploadFile
}>

/** Res HTTP */
export interface IResHttp {
  /** 执行请求的 URL */
  url: string
  /** 要使用的 HTTP 方法/动词 */
  method: Method
  /** 请求体的类型 TODO: 问后端能否把枚举改回去，还是大写符合规范 */
  bodyType: ReqContentType
  /** 请求体内容 */
  bodyContent: {
    /** 请求中要包含的请求体 */
    body: string
    /** 在测试中作为请求一部分使用的表单数据。仅在 bodyType 是 multipart/form-data 时有效 */
    form: IResBodyContentForm
  }
  /** 请求中使用的查询参数。 */
  query: Record<string, string>
  /** 执行请求时要包含的请求头 */
  requestHeaders: Record<string, string>
  /** 执行任务时处理身份验证的对象 */
  auth: IResAuth
  /** 证书 */
  cert: IUploadFile
  /** 私钥 */
  privateKey: IUploadFile
  /** 使用的 HTTP 版本 */
  httpVersion: HttpVersion
  /** 是否生效重定向 */
  followRedirects: boolean
  /** 重定向时传递 cookies */
  persistCookies: boolean
  /** 重定向时传递鉴权头 */
  persistAuthorizationHeaders: boolean
  /** 不保存响应体 */
  noSavingResponseBody: boolean
  /** 检查证书撤销 */
  insecureSkipVerify: boolean
  /** Cookies */
  cookies: string
  /** 表示请求中使用的代理 */
  proxy: {
    /** 代理 URL */
    url: string
    /** 执行请求时要包含的请求头 */
    headers: Record<string, string>
  }
  /** 超时时间 */
  timeout: number
}

/** Res TCP */
export interface IResTcp {
  /** 执行请求的主机名 */
  host: string
  /** 执行请求时要使用的端口 */
  port: string
  /** 是否开启探针以发现到目标主机路径上的所有网关 */
  shouldTrackHops: boolean
  /** 超时时间 */
  timeout: number
}

/** Res UDP */
export interface IResUdp {
  /** 执行请求的主机名 */
  host: string
  /** 执行请求时要使用的端口 */
  port: string
  /** 发送给 UDP 的消息 */
  message: string
  /** 超时时间 */
  timeout: number
}

/** Res GRPC */
export interface IResGrpc {
  /** 主机名 */
  host: string
  /** 端口 */
  port: string
  /** 超时时间 */
  timeout: string
  /** 忽略服务器证书错误 */
  insecureSkipVerify: string
  /** 证书 */
  cert: IUploadFile
  /** 私钥 */
  privateKey: IUploadFile
  /** 检查类型 */
  checkType: BasicTabs
  /** grpc请求元数据 */
  metadata: Record<string, string>
  /** 服务定义类型 */
  serviceDefinitionType: ServiceDefinition
  /** 原型文件 */
  protoFile: IUploadFile
  /** grpc服务器名 */
  serviceName: string
  /** 调用方法 */
  method: string
  /** 请求消息体 */
  message: string
}

/** Res SSL */
export interface IResSsl extends Omit<ISsl, 'cert' | 'privateKey'> {
  /** 证书 */
  cert: IUploadFile
  /** 私钥 */
  privateKey: IUploadFile
}

/** Res DNS */
export type IResDns = IDns

/** Res WEBSOCKET */
export type IResWebsocket = Omit<IWebsocket, 'requestHeaders'> & {
  /** 请求头 */
  requestHeaders: Record<string, any>
}

/** 接口请求定义 */
export interface IResRequest {
  /** IResHttp */
  http?: IResHttp
  /** IResTcp */
  tcp?: IResTcp
  /** IResUdp */
  udp?: IResUdp
  /** IResGrpc */
  grpc?: IResGrpc
  /** IResSsl */
  ssl?: IResSsl
  /** IResDns */
  dns?: IResDns
  /** IResWebsocket */
  websocket?: IResWebsocket
}

/** 接口返回的数据格式 */
export interface IResponse {
  /** id */
  testId: string
  /** 名称 */
  name: string
  /** 协议类型 */
  subType: Protocol
  /** 请求定义 */
  param: IResRequest
  /** 断言 */
  assertions: {
    /** 因子 */
    type: AssertionType
    /** 属性 */
    property: string
    /** 操作符 */
    operator: AssertionOperators
    /** 值 */
    value: string
    /** jsonpath */
    jsonpath: null | {
      /** jsonpath因子 */
      elementsOperator: JsonPathFactor
      /** jsonpath值 */
      path: string
      /** jsonpath操作符 */
      operator: string
    }
  }[]
  /** 断言 */
  assertionCondition: AssertionsRelation
  /** 位置 */
  locations: string[]
  /** 任务监测节点 */
  scheduling: {
    /** 类型 */
    type: MonitoringFrequencyType
    /** 运行频率单位 */
    unit: IntervalUnit
    /** 运行频率（单位由 unit 字段决定） */
    tickEvery: number
    /** 是否指定时间范围。 */
    useTimeframe: boolean
    /** 指定的时间范围 */
    timeframe: {
      days: Weeks[]
      from: Date
      to: Date
    }
  }
  /** 监视器信息  告警配置 */
  monitor: {
    /** 通知渠道 */
    noticeChannel: NoticeChannel
    /** 渠道id */
    chatId: string
    /** token */
    token: string
    /** 数字 1 (最高) 到 5 (最低) 表示告警优先级 */
    priority: Priority
    /** 通知消息内容 */
    message: string
  }
}
/** -- 接口返回的表单数据格式 -- */
