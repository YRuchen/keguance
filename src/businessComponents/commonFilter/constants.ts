import type { ISchema } from '@formily/vue'
import type { IOperateActions } from './interfaces'

/** keepFilter存储localstorage的key */
export const KEEP_FILTER_KEY = 'FilterParams'

const commonStyle = {
  width: 'fit-content',
}

/** 查询和重置 */
export const operateActionsSchema = ({ query, reset }: IOperateActions): Record<string, ISchema> => ({
  operateBtns: {
    type: 'void',
    'x-decorator': 'FormGrid.GridColumn',
    'x-decorator-props': {
      gridSpan: 1,
    },
    'x-component': 'Space',
    'x-component-props': {
      style: {
        width: '100%',
        justifyContent: 'end',
      },
    },
    properties: {
      queryBtn: {
        type: 'void',
        'x-component': 'ElButton',
        'x-component-props': {
          type: 'primary',
          style: {
            ...commonStyle,
          },
          onClick: query,
        },
        'x-content': '查询',
      },
      resetBtn: {
        type: 'void',
        'x-component': 'ElButton',
        'x-component-props': {
          style: {
            ...commonStyle,
          },
          onClick: reset,
        },
        'x-content': '重置',
      },
    },
  },
})
