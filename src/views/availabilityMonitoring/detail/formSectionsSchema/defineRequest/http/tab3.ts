import { requiredText } from '~/constants/common'
import { commonRemoveVisible } from '../../../utils'
import styles from '../../../index.module.scss'

import type { ISchema } from "@formily/vue"
import type { IGetSchemaParams } from '../../../interfaces'

export const getSchema = ({ isView }: IGetSchemaParams): ISchema => ({
  type: 'void',
  'x-component': 'FormTab.TabPane',
  'x-component-props': {
    label: '查询参数',
  },
  properties: {
    /** 查询参数 */
    title: {
      type: 'void',
      'x-decorator': 'FormItem',
      'x-content': () => '其他配置（选填）',
    },
    /** 描述 */
    desc: {
      type: 'void',
      'x-decorator': 'FormItem',
      'x-content': '在下方输入参数的名称和值，这些参数会被添加到URL中，供HTTP请求使用，通常用于传递过滤条件。如只查找活跃用户，Name：status，Value：active。',
    },
    params: {
      type: 'array',
      'x-decorator': 'FormItem',
      'x-component': 'ArrayItems',
      default: [{ key: '', value: '' }],
      items: {
        type: 'object',
        'x-decorator': 'ArrayItems.Item',
        properties: {
          space: {
            type: 'void',
            'x-component': 'Space',
            'x-component-props': {
              size: 0,
            },
            properties: {
              /** key */
              key: {
                type: 'string',
                'x-component': 'Input',
                'x-component-props': {
                  placeholder: '参数名称',
                  class: styles.leftRadius,
                  style: {
                    width: '180px',
                  },
                }
              },
              /** value */
              value: {
                type: 'string',
                'x-component': 'Input',
                'x-component-props': {
                  placeholder: '值',
                  class: styles.rightRadius,
                }
              },
              remove: {
                type: 'void',
                'x-component': 'ArrayItems.Remove',
                'x-reactions': commonRemoveVisible,
              },
            },
          },
        },
      },
      properties: {
        add: {
          type: 'void',
          'x-component': 'ArrayItems.Addition',
          'x-component-props': {
            title: '添加条件',
            type: 'primary',
            link: true,
            style: {
              display: 'flex',
              justifyContent: 'flex-start',
              marginTop: '10px',
              padding: 0,
              fontSize: '14px',
              color: '#409EFF',
              background: 'none',
              border: 'none',
            },
          },
        },
      },
      // 'x-validator': (value: Record<string, string>[] = []) => {
      //   const isEmpty = value.every(v => !v.key && !v.value)
      //   if (isEmpty) {
      //     return requiredText
      //   }
      // },
    }
  },
})

export default getSchema
