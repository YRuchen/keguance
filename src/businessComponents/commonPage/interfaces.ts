import { pagePreferencesToKeyMap } from './constants'

import type { Ref, ComputedRef } from 'vue'
import type { Column } from 'element-plus'
import type { ISchema } from '@formily/vue'
import type { Form } from '@formily/core'
import type { IFieldEffects, IEffectHooks } from '~/basicComponents/formilyCmps/formilyForm'
import type { IField } from '../commonPage'
import type { IPagination } from '../commonTable'

/** usePage入参 */
export interface IUsePageParams {
  /** fields配置 */
  fields: IField[] | Ref<IField[]>
  /** 页面标识 */
  pageKey: string
}

/** usePages出参 */
export interface IUsePageRes extends IUsePagePreferencesRes {
  /** 筛选项 */
  allFilterFields: Ref<ISchema['properties']>
  /** 编辑项 */
  allEditFields: Ref<ISchema['properties']>
  /** 列表项 */
  allColumns: Ref<Column[]>
  /** 配置有fetchConfig字段的effects（副作用） */
  fetchEffects: Ref<IEffectHooks>
}

/** 字段归类 */
export interface IFieldCategorize {
  /** 筛选项 */
  curFilterFields: ISchema['properties']
  /** 筛选项 */
  curEditFields: ISchema['properties']
  /** 表格列 */
  curColumns: IField[]
  /** 远程搜索配置 */
  curFetchEffects: IFieldEffects
}

/** 页面偏好字段 */
export interface IPagePreferenceItem {
  /** 字段标识 */
  key: string
  /** 标题 */
  label: string
  /** 选中 */
  selected: boolean
}

/** 页面偏好 */
export type IPagePreferences = {
  [K in typeof pagePreferencesToKeyMap[keyof typeof pagePreferencesToKeyMap]]: IPagePreferenceItem[]
}

/** usePagePreferencesParams入参 */
export interface IUsePagePreferencesParams {
  /** 页面标识 */
  pageKey: string
  /** 全量筛选项 */
  allFilterFields: Ref<ISchema['properties']>
  /** 全量表格列 */
  allColumns: Ref<Column[]>
}

/** usePagePreferencesParams出参 */
export interface IUsePagePreferencesRes {
  /** 显示的筛选项 */
  visibleFilterFields: ComputedRef<ISchema['properties']>
  /** 显示的表格列 */
  visibleColumns: ComputedRef<Column[]>
  /** 全量用户偏好-筛选项 */
  allVisibleFilterFields: IPagePreferenceItem[]
  /** 全量用户偏好-表格列 */
  allVisibleColumnFields: IPagePreferenceItem[]
  /** 设置页面偏好 */
  setPagePreferences: (p: IPagePreferences) => void
}

/** query入参 */
export interface IQueryParams {
  /** 页码 */
  page?: number
  /** query接口成功态提示文案的前缀 */
  text?: string
}

/** CommonPage出参 */
export interface IExpose {
  /** 查询 */
  query: (p?: IQueryParams) => Promise<void>
  /** 获取筛选区域表单实例 */
  getFilterForm: () => Form
  /** page信息 */
  getPagination: () => IPagination
  /** 更新table高度 */
  updateTableHeight: () => void
}
