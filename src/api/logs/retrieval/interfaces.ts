import { IndexType } from './constants'

/** option */
export interface IOptionsItem {
  /** id */
  id: string
  /** 名称 */
  name: string
}

/** 获取索引列表入参 */
export interface IGetIndexListApiParams {
  /** 数据源id */
  dataSourceId: string
  /** 索引类型 */
  indexType: IndexType
}
