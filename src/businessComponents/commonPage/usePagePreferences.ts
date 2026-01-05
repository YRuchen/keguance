import { ref, computed } from 'vue'
import { useStorage } from '@vueuse/core'
import { pagePreferencesToKeyMap, Common_Page_Preferences_Type } from './constants'

import type { IUsePagePreferencesParams, IUsePagePreferencesRes, IPagePreferences } from './interfaces'

const usePagePreferences = ({
  pageKey,
  allFilterFields,
  allColumns,
}: IUsePagePreferencesParams): IUsePagePreferencesRes => {
  try {
    if (!pageKey) { // 不阻塞
      console.error('缺少pageKey')
    }
    const pagePreferencesKey = `${pageKey}PagePreferences` // 页面偏好标识
    /** 页面偏好: 筛选项标识 */
    const FILTER_KEY = pagePreferencesToKeyMap[Common_Page_Preferences_Type.FILTER]
    /** 页面偏好: 表格列标识 */
    const COLUMN_KEY = pagePreferencesToKeyMap[Common_Page_Preferences_Type.COLUMN]
    const allVisibleFilterFields = Object.entries(allFilterFields.value).map(([k, v]) => ({ key: k, label: v.title, selected: true })) // 页面偏好-筛选项
    const allVisibleColumnFields = allColumns.value.map((v) => ({ key: v.prop, label: v.label, selected: true })) // 页面偏好-表格列
    const basicVisibleFields: IPagePreferences = {
      [FILTER_KEY]: allVisibleFilterFields,
      [COLUMN_KEY]: allVisibleColumnFields,
    } // 页面偏好
    const pagePreferences = pageKey ? useStorage<IPagePreferences>(pagePreferencesKey, basicVisibleFields) : ref(basicVisibleFields) // 从localStorage获取当前页面的pagePreferences，如果之前没存，则存储全量的数据
    const allVisibleFilterFieldKeys = computed<string[]>(() => pagePreferences.value[FILTER_KEY].filter(v => v.selected).map(v => v.key)) // 页面偏好key-用于渲染的筛选项
    const allVisibleColumnFieldKeys = computed<string[]>(() => pagePreferences.value[COLUMN_KEY].filter(v => v.selected).map(v => v.key)) // 页面偏好key-用于渲染的表格列
    const visibleFilterFields = computed(() => Object.fromEntries(allVisibleFilterFieldKeys.value
      .map(v => Object.entries(allFilterFields.value).find(([k]) => k === v))
      .filter(Boolean)
    )) // 用于渲染的筛选项
    const visibleColumns = computed(() => allVisibleColumnFieldKeys.value
      .map(v => allColumns.value.find(v1 => v1.prop === v))
      .filter(Boolean)
    ) // 用于渲染的表格列
    const setPagePreferences = (val: IPagePreferences): void => {
      if (!pageKey) {
        return
      }
      pagePreferences.value = val
    }
    return {
      visibleFilterFields,
      visibleColumns,
      allVisibleFilterFields: pagePreferences.value[FILTER_KEY],
      allVisibleColumnFields: pagePreferences.value[COLUMN_KEY],
      setPagePreferences,
    }
  } catch (error: any) {
    // TODO：当改变了表格或筛选项key后，新的key与localStorage中不同时，两边数据会不同步，后面看下怎么解决。
    console.error(`用户偏好设置失败，失败原因：${error}`)
  }
}

export default usePagePreferences
