import type { PropType } from 'vue'
import type { IVisibleDataItem, ISpanItem } from '../../interfaces'

export const props = {
  /** span数据 */
  span: {
    type: Object as PropType<IVisibleDataItem>,
    default: () => ({}),
  },
  /** 时间轴刻度划分 */
  timeColumns: {
    type: Number,
    default: 5,
  },
  /** 基准span */
  rootSpan: {
    type: Object as PropType<ISpanItem>,
    default: () => ({}),
  },
  /** 宽度比例 */
  width: {
    type: String,
    default: '0%',
  },
}
