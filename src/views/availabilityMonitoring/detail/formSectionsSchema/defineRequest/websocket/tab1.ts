import { requiredText } from '~/constants/common'
import { commonRemoveVisible } from '../../../utils'
import { commonToolTipContainer, commonTimeout } from '../../commonFields'
import styles from '../../../index.module.scss'

import type { ISchema } from '@formily/vue'

const getSchema = (): ISchema => ({
  type: 'void',
  'x-decorator': 'Space',
  'x-decorator-props': {
    direction: 'column',
    align: 'start',
  },
  'x-component': 'FormTab.TabPane',
  'x-component-props': {
    label: '请求设置',
  },
  properties: {
    messageBase64Encoded: commonToolTipContainer({
      schema: {
        messageBase64Encoded: {
          type: 'boolean',
          'x-decorator': 'FormItem',
          'x-component': 'Checkbox',
          'x-component-props': {
            label: '消息使用Base64编码',
          },
          // 'x-validator': (value: string) => {
          //   if (!value) {
          //     return requiredText
          //   }
          // },
        }
      },
      tooltip: '勾选后，发送的测试消息将按 Base64 编码格式处理。一般用于发送二进制或特殊字符内容。',
    }),
    timeout: commonTimeout(),
    /** 请求头 */
    requestHeaders: {
      type: 'array',
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        label: '请求头',
        colon: false,
        layout: 'vertical',
        labelAlign: 'left',
        labelWidth: '60',
        style: {
          width: '100%',
        },
      },
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
                  }
                },
              },
              /** value */
              value: {
                type: 'string',
                'x-component': 'Input',
                'x-component-props': {
                  placeholder: '值',
                  class: styles.rightRadius,
                },
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
    },
  },
})

export default getSchema
