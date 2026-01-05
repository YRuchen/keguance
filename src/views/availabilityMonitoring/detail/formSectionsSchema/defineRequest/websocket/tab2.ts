import { requiredText } from '~/constants/common'
import styles from '../../../index.module.scss'

import type { ISchema } from '@formily/vue'
import type { IGetSchemaParams } from '../../../interfaces'

const getSchema = ({ isView }: IGetSchemaParams): ISchema => ({
  type: 'void',
  'x-decorator': 'Space',
  'x-decorator-props': {
    direction: 'column',
    align: 'start',
  },
  'x-component': 'FormTab.TabPane',
  'x-component-props': {
    label: '身份认证',
  },
  properties: {
    /** 身份验证配置 */
    auth: {
      type: 'object',
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        style: { width: '100%' },
      },
      'x-component': 'Space',
      'x-component-props': {
        fill: true,
        style: { width: '100%' },
      },
      properties: {
        /** 用户名 */
        username: {
          type: 'string',
          'x-component': 'Input',
          'x-component-props': {
            placeholder: '用户名',
            class: styles.leftRadius,
            style: {
              width: '180px',
            },
          },
        },
        /** 密码 */
        password: {
          type: 'string',
          'x-component': isView ? 'ReadPrettyPwd' : 'Password',
          'x-component-props': {
            placeholder: '密码',
            class: styles.rightRadius,
          },
        }
      },
      // 'x-validator': (value: Record<string, string> = {}) => {
      //   if (!value?.username && !value?.password) {
      //     return requiredText
      //   }
      // }
    },
  },
})

export default getSchema
