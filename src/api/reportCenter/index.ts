import getReqByProxyModule from '@/config/request'
import { PROXY } from '@/config/constants'

const request = getReqByProxyModule({ proxyModule: PROXY.GATEWAY_OBSERVE })

/** 获取报告类型列表 */
export const getReportTypes = () => {
  return request.get('/api/v1/configManager/report/types')
}

/** 获取所属模块列表 */
export const getReportModules = () => {
  return request.get('/api/v1/configManager/report/modules')
}

/** 获取报告记录列表 */
export const getReportRecordList = (params: any) => {
  return request.get('/api/v1/configManager/report/record/list', { params })
}

/** 预览报告 */
export const previewReport = (id: string | number) => {
  return request.get(`/api/v1/configManager/report/record/${id}/preview`)
}

/** 导出报告 */
export const exportReport = (id: string | number) => {
  return request.get(`/api/v1/configManager/report/export/${id}`, { responseType: 'blob' })
}

/** 重新生成报告 */
export const regenerateReport = (id: string | number) => {
  return request.get(`/api/v1/configManager/report/generate/${id}`)
}

/** 获取我的订阅列表 */
export const getMySubscriptionsList = (params: any) => {
  return request.get('/api/v1/configManager/report/subscribe/list', { params })
}

/** 订阅报告 */
export const subscribeReport = (data: {
  reportTypeId: number
  moduleTypeId: number
  subscriber: string
}) => {
  return request.post('/api/v1/configManager/report/subscribe', data)
}

/** 订阅操作（停止订阅/重新订阅/删除） */
export const subscribeAction = (data: {
  id: number
  action: 'ACTION_TYPE_CANCEL' | 'ACTION_TYPE_RESUBSCRIBE' | 'ACTION_TYPE_DEL'
}) => {
  return request.post('/api/v1/configManager/report/subscribe/action', data)
}

/** 获取报告发送记录列表 */
export const getReportLogList = (params: any) => {
  return request.get('/api/v1/configManager/report/send/list', { params })
}

/** 删除报告发送记录 */
export const deleteReportLog = (id: string | number) => {
  return request.delete(`/api/v1/configManager/report/send/${id}`)
}

/** 批量删除报告发送记录 */
export const batchDeleteReportLog = (ids: (string | number)[]) => {
  return Promise.all(ids.map((id) => deleteReportLog(id)))
}

/** 重新发送报告 */
export const resendReport = (id: string | number) => {
  return request.post('/api/v1/configManager/report/send', { id })
}

// ========== 域名周报相关接口 ==========

/** 域名周报-报告预览 */
export const getConfigManagerReportPreview = (id: string | number) => {
  return request.get(`/api/v1/configManager/report/preview/${id}`)
}

/** 域名周报-域名异常任务周环比柱状图 */
export const geConfigManagerReportWow = (id: string | number) => {
  return request.get(`/api/v1/configManager/report/wow/${id}`)
}

/** 域名周报-不同监测类型告警任务数时间趋势图 */
export const getConfigManagerReportTrend = (id: string | number) => {
  return request.get(`/api/v1/configManager/report/trend/${id}`)
}

/** 域名周报-任务详情列表 */
export const getConfigManagerReportDetail = (id: string | number) => {
  return request.get(`/api/v1/configManager/report/detail/${id}`)
}

/** 域名周报-AI智能分析 */
export const getConfigManagerReportAiAnalyze = (id: string | number) => {
  return request.get(`/api/v1/configManager/report/aiAnalyze/${id}`)
}
