/** commonFilter的provide key */
export const COMMON_FILTER_INJECTION_KEY = 'COMMON_FILTER_INJECTION_KEY'

/** 页面偏好类型 */
export enum Common_Page_Preferences_Type {
  /** 筛选项 */
  FILTER = 'FILTER',
  /** 表格列 */
  COLUMN = 'COLUMN',
}

/** 页面偏好类型到key的映射 */
export const pagePreferencesToKeyMap = {
  /** 筛选项 */
  [Common_Page_Preferences_Type.FILTER]: 'filters',
  /** 表格列 */
  [Common_Page_Preferences_Type.COLUMN]: 'columns',
} as const

/** 页面偏好标识 */
export const PAGE_PREFERENCES_KEY = 'PagePreferences'
