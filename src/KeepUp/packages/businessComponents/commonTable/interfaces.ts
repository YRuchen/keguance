import { props } from './props'

import type { Ref, UnwrapNestedRefs, ExtractPropTypes } from 'vue'
import type { TableRefs } from 'element-plus'
import type { ICommonFilterExpose } from '../commonFilter'

/** CommonTable内获取列表方法 */
type IGetList = (currentPage?: number, pageSize?: number, text?: string) => Promise<void>

/** usePagination入参 */
export interface IUsePaginationParams {
  /** 当前页码 */
  currentPage: Ref<number>
  /** commonFilterRef */
  commonFilterRef: Ref<ICommonFilterExpose>
  /** 设置选中值 */
  setSelected: (p: any[]) => void
  /** props */
  props: ExtractPropTypes<typeof props>
}

/** page信息  */
export interface IPagination {
  /** 当前页码 */
  page: number
  /** 每页展示的条数 */
  pageSize: number
  /** 总条数 */
  total?: number
}

/** usePagination出参 */
export interface IUsePaginationRes {
  /** table数据源 */
  data: Ref<any[]>
  /** page信息  */
  pagination: UnwrapNestedRefs<IPagination | null>
  /** CommonTable内获取列表方法 */
  getList: IGetList
}

/** 设置选中值入参 */
export interface ISetSelectedParams {
  /** tableRef */
  tableRef: Ref<TableRefs>
  /** 选中值 */
  selected: any[]
  /** 行标识 */
  rowKey: string
  /** table数据源 */
  data: any[]
}

/** commonTable出参 */
export interface ICommonTableExpose {
  /** page信息 会自动解包，所以无需Ref  */
  pagination: IPagination | null
  /** CommonTable内获取列表方法 */
  getList: IGetList
}
