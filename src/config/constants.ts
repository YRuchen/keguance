/** 代理枚举 */
export const PROXY = {
  GATEWAY_OBSERVE: import.meta.env.VITE_APP_GATEWAY_OBSERVE,
  /** 指标和监控模块地址 */
  METRICS: import.meta.env.VITE_APP_BASE_API_METRICS,
  /** 追踪 */
  TRACE: import.meta.env.VITE_APP_BASE_API_TRACE
}
