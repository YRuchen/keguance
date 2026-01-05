import { MODE } from './constants'

import type { Form } from '@formily/core'

/** 打开侧边栏入参 */
export interface IOpenParams {
  /** 查看/创建/编辑态 */
  mode: MODE
  /** 行内容 */
  rowData: any
  /** 行下标 */
  rowIndex: number
}

/** formilyFormExpose */
export type ICommonEditorExpose = {
  /** 打开抽屉 */
  open: (p: IOpenParams) => Promise<void>
  /** 获取Form实例 */
  getForm: () => Promise<Form>
}
