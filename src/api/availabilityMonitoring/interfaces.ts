import { BasicTabs } from '~/views/availabilityMonitoring/detail/formSectionsSchema/defineRequest/constants'
import { AssertionType } from '~/views/availabilityMonitoring/detail/formSectionsSchema/constants'

import type { TaskType, TaskResultStatus, HttpVersion, Protocol, runningStatusMap, RunningStatus, resultStatusTextMap, ResultStatus } from './constants'
import type { IResponse } from '~/views/availabilityMonitoring/detail/interfaces'

/** 监测节点 */
export interface IMonitoringNode {
  label: string
  value: string
  key: string
  children?: IMonitoringNode[]
}

/** 监测节点列表 */
export type IMonitoringNodeList = IMonitoringNode[]

/** listItem */
export interface IListItem {
  /** id */
  id: string
  /** 拨测结果 */
  testResults: typeof resultStatusTextMap[keyof typeof ResultStatus]
  /** 拨测结果Code */
  testResultsCode: ResultStatus
  /** 任务名称 */
  taskName: string
  /** 请求类型 */
  requestType: string
  /** 地址 */
  domainAndAddress: string
  /** 运行状态 */
  runningStatus: typeof runningStatusMap[keyof typeof RunningStatus]
  /** 运行状态Code */
  runningStatusCode: RunningStatus
  /** 创建人 */
  creator: string
  /** 最后修改时间 */
  lastModifiedTime: string
}

/** list */
export type IList = IListItem[]

/** 位置（接口数据） */
export interface ILocationItem {
  /** 节点id */
  nodeId: string
  /** 所属地区id */
  regionId: string
  /** 所属地区名称 */
  regionName: string
  /** 所属省份 */
  subdivision: string
  /** 所属城市 */
  city: string
  /** 运营商唯一标识 */
  asn: string
  /** 运营商 */
  ispName: string
  /** 用于前端友好展示的区域名称，比如：浙江杭州电信 */
  friendlyArea: string
}

/** 位置接口出参 */
export type ILocationsRes = Record<'locations', ILocationItem[]>

/** 
 * 接口返回的数据格式
 * TODO: 其实应该放在当前文件中，由页面去引用类型，但是这些常量不好挪，正常应该是，常量也放在当前api文件夹中，毕竟是接口返回的常量。
 * 下次开始就注意
 */
export type IResponseDTO = IResponse

/** 创建详情接口入参 */
export type ICreateParams = Record<'test', Omit<IResponseDTO, 'testId'>>

/** 获取详情接口出参 */
export type IDetailRes = Record<'test', IResponseDTO>


/** 任务item */
export interface ITaskItem {
  /** 标题 */
  label: string
  /** 值 */
  value: number
}

/** 任务信息 */
export interface ITaskInfo {
  /** 任务类型 */
  type: TaskType
  /** 总任务信息 */
  total: ITaskItem
  /** http任务信息 */
  http: ITaskItem
  /** tcp任务信息 */
  tcp: ITaskItem
  /** udp任务信息 */
  udp: ITaskItem
  /** grpc任务信息 */
  grpc: ITaskItem
  /** ssl任务信息 */
  ssl: ITaskItem
  /** dns任务信息 */
  dns: ITaskItem
  /** websocket任务信息 */
  websocket: ITaskItem
  /** icon src */
  icon: string
  /** 任务列表 */
  taskList?: ITaskItem[]
}

/** 任务组 */
export type ITaskGroup = ITaskInfo[]

/** 快速筛查item */
export interface IFilterFastItem {
  /** 标题 */
  label: string
  /** 值 */
  value: string
  /** 键名 */
  key: string
  /** 子集 */
  children?: IFilterFastItem[]
}

/** 快速筛查 */
export type IFilterFast = IFilterFastItem[]

/** 可用性列表额外信息 */
export interface IExtra {
  /** 任务组 */
  taskGroup: ITaskGroup
  /** 快速筛查 */
  filterFast: IFilterFast
}

/** 历史任务item */
export interface IHistoryTaskItem {
  /** 执行结果 */
  resultStatus: TaskResultStatus
  /** 执行时间 */
  execTime: string
  /** 域名/监测地址 */
  monitoringUrl: string
  /** 监测节点 */
  monitoringNodeName: string
  /** 总耗时 */
  duration: number
  /** 测试id */
  testId: string
}

/** 历史任务 */
export type IHistoryTaskList = IHistoryTaskItem[]

/** 基础信息 */
interface IBasicData {
  /** 执行时间 */
  execTime?: string
  /** 监测节点 */
  monitoringNodeName?: string
  /** 监测频率 unit: 秒 */
  frequency?: number
  /** 执行结果 */
  resultStatus?: string
  /** 总耗时 */
  duration?: string
  /** 失败原因：1:请求失败 */
  failCode?: number
  /** URL */
  url?: string
  /** 解析URL */
  resolvedUrl?: string
  /** host */
  host?: string
  /** 端口号 */
  port?: string
  /** 检查类型 */
  checkType?: BasicTabs
  /** 服务名 */
  serviceName?: string
  /** 服务定义 */
  serviceDefinitionType?: string
  /** 调用方法 */
  method?: string
  /** 解析时间 */
  resolveTime?: string
  /** 最终解析域名 */
  resolvedDomain?: string
  /** 解析端口号 */
  resolvedPort?: string
  /** 解析地址 */
  resolvedAddress?: string
  /** DNS服务器 */
  dnsServer?: string
  /** 解析IP */
  resolvedIpAddress?: string
  /** HTTP版本 */
  httpVersion?: HttpVersion
}

/** 耗时分析 */
interface IDurationInfo {
  /** DNS解析耗时 */
  dnsTime?: number
  /** 建连耗时（connection） */
  tcpTime?: number
  /** SSL握手耗时 */
  sslTime?: number
  /** TLS握手耗时 【ssl】 */
  tlsTime?: string
  /** 首字节时间（time to first byte） */
  timeToFirstByte?: number
  /** 下载耗时 */
  downloadTime?: number
  /** WebSocket连接建立完成时间 【新字段】 */
  wsConnectedAt?: number
  /** WebSocket连接建立完成时间 【新字段】 */
  wsFirstResponseAt?: number
}

/** 任务结果判断条件 */
export interface IResultConfig {
  /** 设置条件 */
  condition?: string
  /** 实际值 */
  value?: number | string
  /** 值类型（和断言类型一一对应） */
  type?: AssertionType
}

/** 请求详情 */
export interface IHistoryTaskRequest {
  /** 请求消息体 */
  content?: string
  /** 元数据 */
  metadata?: Record<string, any>
  /** 服务器名称 【ssl】 */
  serverName?: string
  /** websocket测试消息 【新字段】 */
  message?: Record<string, string>
}

/** 响应详情 */
export interface IHistoryTaskResponse {
  /** 状态码 */
  code?: number
  /** 响应时间 */
  duration?: number
  /** tcp连接状态 【new】 */
  tcpStatus?: string
  /** 响应体 */
  content?: string
  /** 元数据 【new】 */
  metadata?: Record<string, any>
  /** 证书颁发对象 */
  certSubject?: Record<string, string>
  /** 证书颁发者信息 */
  certIssuerInfo?: Record<string, string> 
  /** 证书详细信息 */
  certDetailInfo?: Record<string, string>
  /** 连接信息 */
  connectionInfo?: Record<string, string>
  /** ws响应内容 */
  websocketResponse?: Record<string, string>
  /** ws响应头 */
  websocketResponseHeader?: string
}

/** 历史任务详情 */
export interface IHistoryTaskResult {
  /** 任务名称 */
  taskName: string
  /** 请求类型 */
  method: Protocol
  /** 失败原因简介 */
  failSummary: string
  /** 任务执行概览 */
  basicData: IBasicData
  /** 耗时分析 */
  durationInfo: IDurationInfo
  /** 任务结果判断条件 */
  resultConfig: IResultConfig[]
  /** 请求详情 */
  request: IHistoryTaskRequest
  /** 响应详情 */
  response: IHistoryTaskResponse
  /** 请求头 */
  requestHeader: Record<string, string>
  /** 响应内容 */
  responseContent: string
}

/** 任务基础信息 */
export interface IBasicTaskData {
  /** id */
  id: string
  /** 拨测结果 */
  testResults: string
  /** 任务名称 */
  taskName: string
  /** 请求类型 */
  requestType: Protocol
  /** 地址 */
  domainAndAddress: string
  /** 运行状态 */
  runningStatus: RunningStatus
  /** 创建人 */
  creator: string
  /** 最后修改时间 */
  lastModifiedTime: string
  /** 监测频率 */
  monitoringFrequency: string
  /** url */
  url: string
  /** host */
  host: string
  /** port 端口号 */
  port: string
}