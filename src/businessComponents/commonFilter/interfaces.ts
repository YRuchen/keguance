import type { Ref } from 'vue'
import type { RemovableRef } from '@vueuse/core'
import type { Form } from '@formily/core'
import type { ICommonObj } from '@/interfaces/common'

/** CommonFilter出参 */
export type ICommonFilterExpose = {
  /** 可折叠 */
  collapsible: Ref<boolean>
  /** 展开收起 */
  visible: Ref<boolean>
  /** 展开收起 */
  collapse: () => void
  /** 获取form实例 */
  getForm: () => Form
  /** 重置筛选条件 */
  reset: () => void
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
}

/** useKeepFilter出参 */
export interface IUseKeepFilterRes {
  /** 筛选数据 */
  filterParams: RemovableRef<{}>
  /** 保存筛选数据 */
  keepFilter: (p: ICommonObj) => void
}