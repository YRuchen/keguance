import type { QueryResultMeta } from './meta'
import type { FieldSchema } from './field'

/**
 * （暂不消费）
 * Since JSON cannot encode NaN, Inf, -Inf, and undefined, the locations
 * of these entities in field value arrays are stored here for restoration
 * after JSON.parse()
*/
export interface FieldValueEntityLookup {
  NaN?: number[]
  Undef?: number[] // Missing because of absence or join
  Inf?: number[]
  NegInf?: number[]
}
/** 图表ui层schema配置 */
export interface DataFrameSchema {
  /** 元数据 */
  meta?: QueryResultMeta
  /** 字段定义schema */
  fields: FieldSchema[]
  /** （暂不消费）与查询目标的 refId 对应 */
  refId?: string
  /** （暂不消费）数据所属对象的名称 */
  name?: string
}
/** 图表每行真实数据 */
export type FieldValues = unknown[]
/** 图表数据层data */
export interface DataFrameData {
  /** 按列存储的图表数据，与schema中的fields一一对应 */
  values: FieldValues[]
  /**
   * （暂不消费）
   * 由于 JSON 无法编码 NaN、Inf、-Inf 和 undefined，
   * 这些实体会在 JSON.parse() 后通过该结构进行解码
   */
  entities?: Array<FieldValueEntityLookup | null>
  /**
   * （暂不消费）
   * 保存每个字段的基准值，用于从定点数编码数字
   * 例如 [1612900958, 1612900959, 1612900960] -> 1612900958 + [0, 1, 2]
   */
  bases?: number[]
  /**
   * （暂不消费）
   * 保存每个字段的乘数，用于简洁地编码大数字
   * 例如 [4900000000, 35000000000] -> 1e9 + [4.9, 35]
   */
  factors?: number[]
  /**
   * （暂不消费）
   * 保存每个字段的枚举值，用整数表示重复的字符串值
   * 例如 ["foo", "foo", "baz", "foo"] -> ["foo", "baz"] + [0,0,1,0]
   *
   * 注意：目前只实现了解码
   */
  enums?: Array<string[] | null>
  /**
   * （暂不消费）
   * 保存介于 0 和 999999 之间的整数，用于时间字段
   * 存储无法通过基准值（以毫秒为单位）表示的纳秒精度
   */
  nanos?: Array<number[] | null>
}
/** 分布式图表接口出参:图表信息 */
export interface DataFrameJSON {
  /** 图表ui层schema配置 */
  schema?: DataFrameSchema
  /** 图表数据层data */
  data?: DataFrameData
}
/** 分布式图表接口出参 */
export interface DataResponse {
  /** 图表列表 */
  frames?: DataFrameJSON[]
  /** 响应状态 */
  status?: number
  /** （暂不消费）错误信息 */
  error?: string
  /** （暂不消费）关系 */
  refId?: string
}
/** 接口完整出参 */
export interface ITraceDetailRes {
  results: {
    A: DataResponse
  }
}
