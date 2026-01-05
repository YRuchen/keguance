import { requiredText } from '~/constants/common'

import type { ISchema } from "@formily/vue"
import type { IGetSchemaParams } from '../../../interfaces'

export const getSchema = ({ isView }: IGetSchemaParams): ISchema => ({
  type: 'void',
  'x-component': 'FormTab.TabPane',
  'x-component-props': {
    label: '隐私',
  },
  properties: {
    privacy: {
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'Checkbox',
      'x-component-props': {
        label: '不保存响应内容',
      },
      // 'x-validator': (value: string) => {
      //   if (!value) {
      //     return requiredText
      //   }
      // },
    },
  },
})

export default getSchema
