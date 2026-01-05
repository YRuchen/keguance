/** 面板ID枚举 */
export enum PanelId {
  /** 累计监测总任务数 */
  INSIGHT_1 = 'insight-1',
  /** 累计监测域名/地址 */
  INSIGHT_2 = 'insight-2',
  /** 累计监测异常次数 */
  INSIGHT_3 = 'insight-3',
  /** 总的告警实例数 */
  INSIGHT_4 = 'insight-4',
  /** 不同运营商异常统计 */
  INSIGHT_5 = 'insight-5',
  /** 不同协议异常统计 */
  INSIGHT_6 = 'insight-6',
  /** 异常域名/地址TOP10 */
  INSIGHT_7 = 'insight-7',
  /** 不同地区平均响应时间 */
  RESPONSE_TIME_MAP = 'response_time_map',
  /** 平均响应时间趋势图 */
  INSIGHT_9 = 'insight-9',
  /** 平均耗时分析统计图 */
  INSIGHT_10 = 'insight-10',
  /** 不同运营商平均响应时间 */
  INSIGHT_11 = 'insight-11',
  /**告警：异常域名 / 地址 TOP10 */
  ALERT_4 = 'alert-4',
  /**告警：不同运营商异常统计 */
  ALERT_5 = 'alert-5',
  /**告警：不同区域告警统计 */
  ALERT_6 = 'alert-6',
}

/** 时间类型枚举 */
export enum TimeType {
  /** 今天 */
  TODAY = 'TODAY',
  /** 昨天 */
  YESTERDAY = 'YESTERDAY',
  /** 近30天 */
  LAST_30_DAYS = '30d',
  /** 自定义 */
  CUSTOM = 'CUSTOM',
}

/** 时间类型选项 */
export const timeTypeOptions = [
  { label: '今天', value: TimeType.TODAY },
  { label: '昨天', value: 'YESTERDAY' },
  { label: '近30天', value: TimeType.LAST_30_DAYS },
  { label: '自定义', value: TimeType.CUSTOM },
]

/** 刷新频率枚举 */
export enum RefreshRate {
  /** 30秒 */
  SECOND_30 = '30s',
  /** 1分钟 */
  MINUTE_1 = '1min',
  /** 5分钟 */
  MINUTE_5 = '5min',
  /** 30分钟 */
  MINUTE_30 = '30min',
  /** 1小时 */
  HOUR_1 = '1h',
}

/** 刷新频率选项 */
export const refreshRateOptions = [
  { label: '30s', value: RefreshRate.SECOND_30 },
  { label: '1min', value: RefreshRate.MINUTE_1 },
  { label: '5min', value: RefreshRate.MINUTE_5 },
  { label: '30min', value: RefreshRate.MINUTE_30 },
  { label: '1h', value: RefreshRate.HOUR_1 },
]

/** 协议类型枚举 */
export enum ProtocolType {
  /** 全部 */
  ALL = 'ALL',
  /** HTTP */
  HTTP = 'HTTP',
  /** GRPC */
  GRPC = 'GRPC',
  /** SSL */
  SSL = 'SSL',
  /** WEBSOCKET */
  WEBSOCKET = 'WEBSOCKET',
  /** TCP */
  TCP = 'TCP',
  /** UDP */
  UDP = 'UDP',
}

/** 协议类型选项 */
export const protocolOptions = [
  { label: '全部', value: ProtocolType.ALL },
  { label: 'HTTP', value: ProtocolType.HTTP },
  { label: 'GRPC', value: ProtocolType.GRPC },
  { label: 'SSL', value: ProtocolType.SSL },
  { label: 'WEBSOCKET', value: ProtocolType.WEBSOCKET },
  { label: 'TCP', value: ProtocolType.TCP },
  { label: 'UDP', value: ProtocolType.UDP },
]

/** Tab协议类型 */
export const protocolTabs = [
  { label: 'HTTP', value: ProtocolType.HTTP },
  { label: 'GRPC', value: ProtocolType.GRPC },
  { label: 'SSL', value: ProtocolType.SSL },
  { label: 'WEBSOCKET', value: ProtocolType.WEBSOCKET },
  { label: 'TCP', value: ProtocolType.TCP },
  { label: 'UDP', value: ProtocolType.UDP },
]

/** 图表提示信息 */
export const chartTips = {
  [PanelId.INSIGHT_1]:
    '此租户下总共建的线路监测任务数，分类展示数量和占比，支持查看哪一类协议任务数最多?着重关注优化此类任务的域名/地址。',
  [PanelId.INSIGHT_2]:
    '去重统计所有任务中，被监测的域名或地址的总数。帮助您了解整体的监控要盖面。',
  [PanelId.INSIGHT_3]:
    '统计所有任务在近30天触发异常状态的总次数。通过分类占比可快速定位最常出错的协议类型，便于集中排查治理。',
  [PanelId.INSIGHT_4]:
    '默认展示今日告喾实例数，分类型展示告警占比哪一类更多，点击查看详情会跳转到告警页面，可以查看今日具体的告誉实例列表。',
  [PanelId.INSIGHT_5]:
    '展示告警事件在不同运营商网络中的分布情况:快速定位故障是否集中于特定运营商线路，帮助您判断是全局性故障还是运营商局部网络质量问题，为网络选型与运昔商交涉提供数据依据。',
  [PanelId.INSIGHT_6]:
    '展示各协议类型（如HTTP、SSL、TCP等）的告警分布占比。直观揭示哪类协议或服务最不稳定，便于您优先投入资源进行排查与优化（例如，SSL协议占比过高可能需集中检查证书或加密链路问题），点击查看详情可跳转到告警页面进行下转定位查看。',
  [PanelId.INSIGHT_7]:
    '列出触发告曾次数最多的监控目标:该列表直接指向最不稳定的具体服务端点，您应关注并优先对这些排名等前的域名或地址进行深度故障诊断与优化。',
  [PanelId.RESPONSE_TIME_MAP]:
    '展示HTTP任务从不同地区检测节点的平均响应时间。通过地理色彩深浅直观呈现性能优劣区域，帮助您识别用户访问的地理瓶颈，为CDN调度与区域资源部署提供决策依据。',
  [PanelId.INSIGHT_9]:
    '展示HTTP任多在一段时间内平均响应时间的变化曲线，用于观案性能的长期趋势、周期性波动(如每日高峰)以及与系统变更的关联性，及时发现性能劣化等异常趋势，是进行容量规划和故障回溯的关键数据支撑。',
  [PanelId.INSIGHT_10]:
    '展示HTTP任务在一段时间内平均响应时间的变化曲线:用于观案性能的长期趋势、周期性波动(如每日高峰)以及与系统变更的关联性，及时发现性能劣化等异常趋势，是进行容量规划和故障回溯的关键数据支撑。',
  [PanelId.INSIGHT_11]:
    '平均响应时间可对比不同运营商的性能差异，最慢的响应时间可识别潜在的性能瓶颈。精准识别因运营商网络质量差异导致的性能拒颈，作为用户网络选型和多线接入优化的直接依据。',
  [PanelId.ALERT_4]:
    '列出在该协议下，触发告警次数最多的10个具体监控目标:此列表直接指出该协议服务中最不稳定的具体端点，您应关注并优先对这些域名或地址进行代码、配或依赖服务的深度排查，点击某个域名/地址可以在搜索框里面进行搜卖',
  [PanelId.ALERT_5]:
    '对比该协议告警在不同运营商网络中的分布数量。精准识别故障是否由特定运营商(如移动、联通、电信)的网络质量问题引起。',
  [PanelId.ALERT_6]:
    '展示该协议告警在不同地理区域的分布情况。用于快速识别告警是否集中在特定省份或地区，帮助您判断是全局性服务问题还是区域性网络故障，并指导进行区域性的资源调度或网络优化。',
}

/** 刷新频率转毫秒 */
export const refreshRateToMs = (rate: RefreshRate): number => {
  const map: Record<RefreshRate, number> = {
    [RefreshRate.SECOND_30]: 30 * 1000,
    [RefreshRate.MINUTE_1]: 60 * 1000,
    [RefreshRate.MINUTE_5]: 5 * 60 * 1000,
    [RefreshRate.MINUTE_30]: 30 * 60 * 1000,
    [RefreshRate.HOUR_1]: 60 * 60 * 1000,
  }
  return map[rate] || 30 * 1000
}

