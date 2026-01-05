import type { ISpanItem } from '~/KeepUp'
import type { ICommonObj } from '~/interfaces/common'

/** log出参 */
export interface ILogExpose {
  /** 打开 */
  open: () => void
  /** 关闭 */
  close: () => void
}

/** 日志区域数据 */
export interface ILogData {
  basicData: Partial<ISpanItem>
  log: ICommonObj[]
}
