import { requiredText } from '~/constants/common'
import { commonRemoveVisible } from '../../../utils'
import styles from '../../../index.module.scss'

import type { ISchema } from "@formily/vue"
import type { IGetSchemaParams } from '../../../interfaces'

export const getSchema = ({ isView }: IGetSchemaParams): ISchema => ({
  type: 'void',
  'x-decorator': 'Space',
  'x-decorator-props': {
    direction: 'column',
    align: 'start',
  },
  'x-component': 'FormTab.TabPane',
  'x-component-props': {
    label: '代理',
  },
  properties: {
    proxy: {
      type: 'object',
      properties: {
        url: {
          type: 'string',
          'x-decorator': 'FormItem',
          'x-decorator-props': {
            label: '代理服务器URL',
            colon: false,
            layout: 'vertical',
            labelWidth: 115,
            labelAlign: 'left',
            style: {
              width: '100%',
            },
          },
          'x-component': 'Input',
          'x-component-props': {
            placeholder: '请输入URL'
          },
          // 'x-validator': (value: string) => {
          //   if (!value) {
          //     return requiredText
          //   }
          // },
        },
        header: {
          type: 'array',
          'x-decorator': 'FormItem',
          'x-decorator-props': {
            label: '发送给代理服务器的请求头部内容',
            colon: false,
            layout: 'vertical',
            labelWidth: 235,
            labelAlign: 'left',
            style: {
              width: '100%',
            },
          },
          'x-component': 'ArrayItems',
          default: [{ key: '', value: '' }],
          items: { // TODO: 相同的部分抽出去，传字段进来
            type: 'object',
            'x-decorator': 'ArrayItems.Item',
            properties: {
              space: {
                type: 'void',
                'x-component': 'div',
                'x-component-props': {
                  style: {
                    width: '100%',
                    display: 'flex',
                  },
                },
                properties: {
                  /** key */
                  key: {
                    type: 'string',
                    'x-decorator': 'div',
                    'x-decorator-props': {
                      class: styles.leftRadius,
                      style: {
                        width: '180px!important',
                      }
                    },
                    'x-component': 'Input',
                    'x-component-props': {
                      placeholder: '参数名称',
                    }
                  },
                  /** value */
                  value: {
                    type: 'string',
                    'x-decorator': 'div',
                    'x-decorator-props': {
                      class: styles.rightRadius,
                      style: {
                        flex: 1,
                      }
                    },
                    'x-component': 'Input',
                    'x-component-props': {
                      placeholder: '值',
                    },
                  },
                  remove: {
                    type: 'void',
                    'x-decorator': 'div',
                    'x-decorator-props': {
                      style: {
                        width: '40px!important',
                      }
                    },
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
      }
    },
  },
})

export default getSchema