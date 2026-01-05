import type { PropType } from 'vue'
import type { ISchema } from '@formily/vue'
import type { IEffectHooks } from '../../basicComponents/formilyCmps/formilyForm'
import type { IOperateActions } from './interfaces'

export const props = {
  /** 筛选项 */
  filterFields: {
    type: Object as PropType<ISchema>,
    default: () => ({}),
  },
  /** 栅格数量 */
  maxColumns: {
    type: Number,
    default: 3,
  },
  /** 操作 */
  operateActions: {
    type: Object as PropType<IOperateActions>,
    default: () => ({}),
  },
  /** effectHooks */
  effectHooks: {
    type: Object as PropType<IEffectHooks>,
    default: () => ({}),
  },
  /** 页面标识 */
  pageKey: {
    type: String,
    default: '',
  },
}
