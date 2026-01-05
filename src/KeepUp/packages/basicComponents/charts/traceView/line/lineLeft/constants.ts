import type { PropType } from 'vue'
import type { IVisibleDataItem } from '../../interfaces'

export const props = {
  /** span数据 */
  span: {
    type: Object as PropType<IVisibleDataItem>,
    default: () => ({}),
  },
  /** 宽度比例 */
  width: {
    type: String,
    default: '0%',
  },
}

/** 方块Rect信息 */
export const blockRectConfig = {
  width: 16,
  size: 28,
}
