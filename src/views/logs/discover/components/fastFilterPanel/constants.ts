/** 快速筛查类型枚举 */
export enum FastFilterType {
  /** 容器名 */
  containerName = 'containerName',
  /** 环境标签 */
  env = 'env',
  /** 主机 */
  host = 'host',
  /** Pod名称 */
  podName = 'podName',
  /** 服务 */
  service = 'service',
  /** 数据来源 */
  source = 'source',
  /** 日志等级 */
  status = 'status',
}

/** 快速筛查类型枚举到标题的映射 */
export const fastFilterTypeToLabelMap = {
  [FastFilterType.containerName]: '容器名',
  [FastFilterType.env]: '环境标签',
  [FastFilterType.host]: '主机',
  [FastFilterType.podName]: 'Pod名称',
  [FastFilterType.service]: '服务',
  [FastFilterType.source]: '数据来源',
  [FastFilterType.status]: '日志等级',
}
