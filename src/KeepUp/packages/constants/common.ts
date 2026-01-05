import type { ISchema } from '@formily/vue'
import type { IGetRootSchema } from '../interfaces/common'

/** CommonFilter & CommonEditor 公用根节点配置 */
export const getRootSchema = ({ maxColumns, properties }: IGetRootSchema): ISchema => ({ // TODO: ts,并且抽成公共的数据
  type: 'object',
  properties: {
    space: {
      type: 'void',
      'x-component': 'FormLayout',
      properties: {
        grid: {
          type: 'void',
          'x-component': 'FormGrid',
          'x-component-props': {
            maxColumns: maxColumns,
            minColumns: maxColumns,
            columnGap: 16,
            rowGap: 12,
          },
          properties: properties as ISchema['properties'],
        }
      }
    }
  }
})
