import type { Ref, ComputedRef } from 'vue'
import type { RemovableRef } from '@vueuse/core'
import type { ISchema } from '@formily/vue'
import type { Form } from '@formily/core'
import type { ICommonObj } from '~/interfaces/common'

/** CommonFilter出参 */
export type ICommonFilterExpose = {
  /** 可折叠 */
  collapseData: ICollapseData
  /** 展开收起 */
  visible: boolean
  /** 展开收起 */
  collapse: () => void
  /** 缓存筛选项数据 */
  keepFilter: (params: ICommonObj) => void
  /** 获取form实例 */
  getForm: () => Form
  /** 重置筛选条件 */
  reset: () => Promise<void>
  /** 获取筛选器高度 */
  getCommonFilterHeight: () => number
}

/** 操作 */
export interface IOperateActions {
  /** 查询 */
  query: () => Promise<void>
  /** 重置 */
  reset: () => Promise<void>
}

/** useKeepFilter入参 */
export interface IUseKeepFilterParams {
  /** pageKey */
  pageKey: string
  /** form实例 */
  formRef: Ref<Form>
}

/** useKeepFilter出参 */
export interface IUseKeepFilterRes {
  /** 筛选数据 */
  filterParams: RemovableRef<{}>
  /** 保存筛选数据 */
  keepFilter: (p: ICommonObj) => void
  /** 初始化 */
  init: () => void
}

/** 展开收起所需数据 */
export interface ICollapseData {
  /** 全量字段 */
  allFields: ISchema
  /** 全量字段keys */
  allFieldKeys: string[]
  /** 可见字段keys */
  visibleFieldKeys: string[]
  /** 全量字段占位 */
  totalGridSpan: number
  /** 可折叠 */
  collapsible: boolean
}

/** useFieldsParser出参 */
export interface IUseFieldsParserRes {
  /** 展开收起所需所有数据 */
  collapseData: ComputedRef<ICollapseData>
}

/** useCollapse入参 */
export interface IUseCollapseParams {
  formRef: Ref<Form>
  collapseData: Ref<ICollapseData>
}

/** useCollapse出参 */
export interface IUseCollapseRes {
  /** 展开 */
  visible: Ref<boolean>
  /** 展开收起 */
  collapse: () => void
}
