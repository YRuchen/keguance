import type { Form } from '@formily/core'
import type { ICommonObj } from '~/interfaces/common'

/** 打开侧边栏入参 */
export interface IOpenParams {
  /** 查看/创建/编辑态 */
  mode: 'VIEW' | 'CREATE' | 'EDIT'
  /** 行内容 */
  rowData: any
  /** 行下标 */
  rowIndex: number
}

/** CommonEditor出参 */
export type ICommonEditorExpose = {
  /** 打开抽屉 */
  open: (p: IOpenParams) => Promise<void>
  /** 获取Form实例 */
  getForm: () => Form
}

/** useModeMap入参 */
export interface IUseModeMapParams {
  /** 创建Api */
  createApi: (p: ICommonObj) => Promise<void>
  /** 编辑Api */
  editApi: (p: ICommonObj) => Promise<void>
}

/** useModeMap item */
export interface IUseModeMapResItem {
  /** 文案 */
  text: string
  /** api */
  api: (p: ICommonObj) => Promise<void>
}

/** useModeMap出参 */
export type IUseModeMapRes = Record<'VIEW' | 'CREATE' | 'EDIT', IUseModeMapResItem>

/** IEditorLayout */
export interface IEditorLayout {
  /** 栅格列数 */
  columns: number
  /** labelStyle */
  labelStyle: {
    /** 宽度 */
    width: string
    /** 外边距 */
    margin: string
  }
}
