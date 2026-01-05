/** 获取列表入参 */
export interface IGetListParams {
  /** 执行时间 */
  time: 'LATEST' | 'TODAY' | 'YESTERDAY' | 'THIS_WEEK' | '30D'
  /** 开始时间 */
  fromTime: string
  /** 结束时间 */
  toTime: string
  /** 执行节点所属地区 */
  probeRegionName: string
  /** 执行节点所属省份 */
  probeSubdivision: string
  /** 执行节点运营商 */
  probeIspName: string
  /** 任务类型 */
  subType: 'SUB_TYPE_UNKNOWN' | 'HTTP' | 'TCP' | 'UDP' | 'ALL' | 'GRPC' | 'SSL' | 'DNS' | 'WEBSOCKET'
  /** 任务 ID */
  testId: string
  /** 域名/地址 */
  domain: string
}

/** 列 */
export interface IListItem {
  /** 监测节点名称 */
  monitoringNodeName: string
  /** 执行时间 */
  execTime: string
  /** 域名/监测地址 */
  monitoringUrl: string
  /** 总耗时 */
  duration: number
}

// 定义最快的响应数据
export interface FastestSlowestData {
  city: string;
  isp: string;
  value: number;
}

// 定义单个详细数据项的类型
export interface DetailItem {
  city: string;
  isp: string;
  value: number;
}

// 定义每个省份/直辖市的数据类型
export interface SubdivisionData {
  avg: number;
  detail: DetailItem[];
}

// 定义完整的响应数据类型
export interface NetworkLatencyData {
  num: number;
  subdivisions: {
    [province: string]: SubdivisionData;
  };
  fastest?: FastestSlowestData | number;
  slowest?: FastestSlowestData | number;
  avg: number;
  value: number;
  abnormalNum: number;
  normalNum: number;  
}

// 定义单个数据点的类型
interface DataPoint {
  value: number;
  time: string; // 格式: "YYYY-MM-DD HH:mm:ss"
}

// 定义完整的数据结构
export interface TimeSeriesData {
  values: DataPoint[];
  valueType: string;
}