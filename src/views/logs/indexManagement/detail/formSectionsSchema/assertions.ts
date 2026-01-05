import { getLogSamplingList } from '~/api/logs/indexManagement'
import { AssertionOperators, assertionOperatorOptions, AssertionsRelation, assertionsRelationOptions } from '../constants'
import styles from '../index.module.scss'

import type { ISchema } from "@formily/vue"
import type { Field } from '@formily/core'
import type { IGetSchemaParams } from './interfaces'

const getSchema = ({
  isView,
  titleSuffix,
}: IGetSchemaParams & { titleSuffix?: string }): ISchema => ({
  type: 'object',
  'x-decorator': 'FormItem',
  'x-decorator-props': {
    label: '过滤条件',
    labelWidth: 115,
    style: {
      'flex-shrink': 0,
    },
    wrapperStyle: {
      flexShrink: 0
    },
    class: styles.assertion,
  },
  'x-component': 'KeepUpSpace',
  'x-component-props': {
    direction: 'column',
    align: 'start',
  },
  properties: {
    // 满足以下【全部/任一】条件时，判断任务拨测结果为成功，否则任务失败将发出告警
    assertionsTitle: {
      type: 'void',
      'x-decorator': 'div',
      'x-decorator-props': {
        style: {
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxSizing: 'borderBox',
          gap: '8px',
        },
      },
      properties: {
        prefixTitle: {
          type: 'void',
          'x-decorator': 'div',
          'x-decorator-props': {
            style: {
              width: '60px',
              height: '20px',
              lineHeight: '20px',
            },
          },
          'x-content': '满足以下',
        },
        // 全部/任一
        logic: {
          type: 'string',
          required: true,
          'x-decorator': 'div',
          'x-decorator-props': {
            style: {
              width: '80px',
            },
          },
          'x-component': 'Select',
          enum: assertionsRelationOptions,
          default: AssertionsRelation.All,
        },
        suffixTitle: {
          type: 'void',
          'x-decorator': 'div',
          'x-decorator-props': {
            style: {
              flex: 1,
              height: '20px',
              lineHeight: '20px',
              textAlign: 'left',
            },
          },
          'x-content': titleSuffix || '条件时，判断任务拨测结果为成功，否则任务失败将发出告警',
        },
      },
    },
    /** 请求定义 */
    conditions: {
      type: 'array',
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        style: {
          width: '100%',
        },
      },
      'x-component': 'ArrayItems',
      items: {
        type: 'object',
        'x-decorator': 'ArrayItems.Item',
        'x-component': 'Space',
        'x-component-props': {
          size: 8,
          align: 'start',
          style: {
            flexWrap: 'wrap',
          },
        },
        properties: {
          // 因子
          field: {
            type: 'string',
            'x-decorator': 'FormItem',
            'x-component': 'Select',
            'x-component-props': {
              placeholder: '请选择',
              style: {
                width: '136px',
              },
            },
            'x-reactions': async (field: Field) => {
              try {
                const dataSourceIdField = field.form.query('.dataSourceId')?.take() as Field
                const indexPrefixField = field.form.query('.indexPrefix')?.take() as Field
                const hasValue = dataSourceIdField?.value && indexPrefixField?.value
                if (!hasValue) {
                  if (field.value) {
                    field.value = ''
                  }
                  field.dataSource = []
                  return
                }
                const res = await getLogSamplingList({ 
                  dataSourceId: dataSourceIdField?.value, 
                  indexPrefix: indexPrefixField?.value,
                })
                const options = Object.entries(JSON.parse((res?.list || [])?.[0]?.logJson || '{}'))
                  .map(([k]) => ({ label: k, value: k }))
                field.dataSource = options
              } catch (error: any) {
                console.error(`获取日志采样数据失败，失败原因：${error}`)
              }
            },
          },
          // 操作符
          operator: {
            type: 'string',
            'x-decorator': 'FormItem',
            'x-component': 'Select',
            'x-component-props': {
              placeholder: '请选择',
              style: {
                width: 'fit-content',
                minWidth: '130px',
              },
            },
            enum: assertionOperatorOptions,
          },
          value: {
            type: 'string',
            'x-decorator': 'FormItem',
            'x-component': 'Input',
            'x-component-props': {
              placeholder: '请输入',
              style: {
                flex: 1,
                borderLeft: 'none',
                height: '32px',
              },
            },
          },
          // 删除
          remove: {
            type: 'void',
            'x-component': 'ArrayItems.Remove',
            'x-component-props': {
              style: {
                marginTop: '4px',
              },
            },
          },
          // 占位（如果删除被隐藏，就用这个字段占位）
          space: {
            type: 'void',
            'x-reactions': (field) => {
              const target = field?.parent?.parent?.value
              field.visible = target?.length <= 1
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
    },
  },
})

export default getSchema