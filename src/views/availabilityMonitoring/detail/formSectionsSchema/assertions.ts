import { requiredText } from '~/constants/common'
import { getCollapseTitle } from './commonFields'
import {
  assertionsRelationOptions,
  AssertionsRelation,
  assertionsModeOptions,
  AssertionsModeOptions,
  assertionTypeOptionsMap2,
  protocolToAssertionMap,
  Protocol,
} from '../constants'
import { jsonpathFactorOptions, jsonpathOperatorOptions, AssertionOperators } from './constants'
import styles from '../index.module.scss'

import type { Field } from '@formily/core'
import type { ISchema } from "@formily/vue"
import type { IGetSchemaParams } from '../interfaces'

const commonXReactions = (field: Field) => {
  const operator = field.query('.operator')?.get('value')
  field.visible = operator === AssertionOperators.JSON_PATH
}
const getSchema = ({
  isView,
  titleSuffix,
}: IGetSchemaParams & { titleSuffix?: string }): ISchema => ({
  type: 'void',
  'x-decorator': 'Space',
  'x-decorator-props': {
    direction: 'column',
    align: 'start',
  },
  'x-component': 'FormCollapse.Item',
  'x-component-props': {
    title: getCollapseTitle({ index: 3, title: '任务结果成功判断条件' }),
  },
  properties: {
    // TODO: 下个版本是否需要上
    // assertionsMode: {
    //   type: 'string',
    //   'x-decorator': 'FormItem',
    //   'x-component': 'Radio.Group',
    //   'x-component-props': {
    //     buttonStyle: 'solid',
    //     optionType: 'button',
    //     size: 'small',
    //   },
    //   enum: assertionsModeOptions,
    //   default: AssertionsModeOptions.DEFAULT,
    // },
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
          padding: '0 16px',
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
              width: '55px',
              height: '20px',
            },
          },
          'x-content': '满足以下',
        },
        // 全部/任一
        relation: {
          type: 'string',
          'x-decorator': 'div',
          'x-decorator-props': {
            style: {
              width: '80px',
            },
          },
          'x-component': 'Select',
          enum: assertionsRelationOptions,
          default: AssertionsRelation.All,
          'x-validator': (value: string) => {
            if (!value) {
              return requiredText
            }
          },
        },
        suffixTitle: {
          type: 'void',
          'x-decorator': 'div',
          'x-decorator-props': {
            style: {
              flex: 1,
              height: '20px',
              textAlign: 'left',
            },
          },
          'x-content': titleSuffix || '条件时，判断任务拨测结果为成功，否则任务失败将发出告警',
        },
      }
    },
    /** 请求定义 */
    assertion: {
      type: 'array',
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        style: {
          width: '753px',
        },
      },
      'x-component': 'ArrayItems',
      default: [{ key: '', value: '' }],
      items: {
        type: 'object',
        'x-decorator': 'ArrayItems.Item',
        'x-component': 'Space',
        'x-component-props': {
          size: 0,
          align: 'start',
          style: {
            flexWrap: 'wrap',
          },
        },
        properties: {
          // 因子（第一列）
          factor: {
            type: 'string',
            'x-component': 'Select',
            'x-component-props': {
              placeholder: '请选择',
              class: styles.leftRadius,
              style: {
                width: '136px',
              },
            },
            'x-reactions': (field: Field) => {
              const basicActiveKey = field.form.query('collapse.step1.basicActiveKey')?.get('value') // grpc检查模式
              /** 跟随协议改变断言类型（当协议为grpc时，改为根据基础数据的tab改变断言类型） */
              const protocol = field.form.query('collapse.step1.protocol')?.get('value') // 请求协议
              const isGRPC = [Protocol.GRPC].includes(protocol) && basicActiveKey
              field.setDataSource(
                isGRPC
                  ? protocolToAssertionMap[basicActiveKey]
                  : protocolToAssertionMap[protocol]
              )
            },
          },
          // 第二列（特定类型携带）
          key: {
            type: 'string',
            'x-component': 'Input',
            'x-component-props': {
              placeholder: '请输入',
              class: [styles.straightAngle, styles.removeRightBorder],
              style: {
                width: '150px',
              },
            },
            'x-reactions': (field: Field) => {
              const factor = field.query('.factor')?.get('value')
              const target = assertionTypeOptionsMap2[factor]
              const visible = typeof target?.['x-property-visible'] === 'function'
                ? target?.['x-property-visible']?.(field)
                : target?.['x-property-visible']
              field.setDisplay(visible? 'visible': 'none')
              field.setComponent(target?.['x-property-component'])
              field.setComponentProps({
                ...field.componentProps,
                ...(target?.['x-properties-component-props'] || {}),
              })
              field.setDataSource(target?.['x-property-enum'])
              target?.['x-property-reactions']?.(field)
            },
          },
          // 操作符（第三列）
          operator: {
            type: 'string',
            'x-component': 'Select',
            'x-component-props': {
              placeholder: '请选择',
              class: styles.straightAngle,
              style: {
                width: 'fit-content',
                minWidth: '130px',
              },
            },
            'x-reactions': (field: Field) => {
              const factor = field.query('.factor')?.get('value')
              const target = assertionTypeOptionsMap2[factor]
              const options = target?.['x-operator-enum']
              field.setDataSource(options)
              // 当前operator为空或不在operatorOptions中，则设置为operatorOptions第一项的值
              if (!field.value || !options?.find(v => v.value === field.value)) {
                field.setValue(options?.[0]?.value)
              }
              assertionTypeOptionsMap2[factor]?.['x-operator-reactions']?.(field)
            },
          },
          value: {
            type: 'string',
            'x-component': 'Input',
            'x-component-props': {
              placeholder: '请输入',
              class: isView ? '' : styles.rightRadius,
              style: {
                flex: 1,
                borderLeft: 'none',
                height: '32px',
              },
            },
            'x-reactions': (field: Field) => {
              const value = field.value
              const factor = field.query('.factor')?.get('value')
              field.decoratorProps = {
                gridSpan: assertionTypeOptionsMap2[factor]?.['x-property-visible'] ? 4 : 8
              }
              console.log(value)
              const target = assertionTypeOptionsMap2[factor]
              const xContent = target?.['x-value-content']
              target?.['x-value-component'] && field.setComponent(target?.['x-value-component'])
              target?.['x-value-component-props'] && field.setComponentProps({
                ...field.componentProps,
                placeholder: '请输入',
                ...(target?.['x-value-component-props'] || {}),
              })
              field.setDataSource(target?.['x-value-enum'])
              field.setContent(xContent ? { append: xContent } : {})
              assertionTypeOptionsMap2[factor]?.['x-value-reactions']?.(field)
            }
          },
          // 删除（第五列）
          remove: {
            type: 'void',
            'x-component': 'ArrayItems.Remove',
            'x-component-props': {
              style: {
                marginTop: '4px',
              },
            },
            'x-reactions': (field) => {
              const target = field?.parent?.parent?.value
              field.visible = !(target?.length <= 1)
            }
          },
          // 占位（如果删除被隐藏，就用这个字段占位）
          space: {
            type: 'void',
            'x-reactions': (field) => {
              const target = field?.parent?.parent?.value
              field.visible = target?.length <= 1
            }
          },
          /** 占位 */
          space1: {
            type: 'void',
            'x-component': 'div',
            'x-component-props': {
              style: {
                flexBasis: '100%'
              },
            },
            'x-reactions': commonXReactions,
          },
          // 因子（第一列）
          jsonpathFactor: {
            type: 'string',
            'x-component': 'Select',
            'x-component-props': {
              placeholder: '请选择',
              class: styles.leftRadius,
              style: {
                width: '136px',
                marginTop: '8px',
              },
            },
            enum: jsonpathFactorOptions,
            'x-reactions': commonXReactions,
          },
          // 操作符（第三列）
          jsonpathOperator: {
            type: 'string',
            'x-component': 'Select',
            'x-component-props': {
              placeholder: '请选择',
              class: styles.straightAngle,
              style: {
                width: '130px',
                marginTop: '8px',
              },
            },
            enum: jsonpathOperatorOptions,
            'x-reactions': commonXReactions,
          },
          jsonpathValue: {
            type: 'string',
            'x-component': 'Input',
            'x-component-props': {
              placeholder: '请输入',
              class: styles.rightRadius,
              style: {
                flex: 1,
                borderLeft: 'none',
                height: '32px',
                marginTop: '8px',
              },
            },
            'x-reactions': commonXReactions,
          },
          // 占位（和删除按钮同时出现，让jsonpath行布局和普通断言行一致）
          space2: {
            type: 'void',
            'x-component': 'div',
            'x-component-props': {
              style: {
                width: '40px',
              },
            },
            'x-reactions': (field) => {
              const target = field?.parent?.parent?.value
              field.visible = !(target?.length <= 1)
            }
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
      'x-validator': (value: Record<string, string>[]) => {
        const isEmpty = value.every(v => {
          // const isJsonPath = v.operator === AssertionOperators.JSON_PATH
          // let hasJsonPathValues = true
          // if (isJsonPath) {
          //   hasJsonPathValues = Boolean(v.jsonpathFactor && v.jsonpathOperator && v.jsonpathValue)
          // }
          // const notJsonPath = isJsonPath && !hasJsonPathValues
          // if (isJsonPath) {
          //   return !v.factor && !v.key && !v.operator && !v.value && !hasJsonPathValues
          // } else {
            return !v.factor && !v.key && !v.operator && !v.value
          // }
        })
        if (isEmpty) {
          return '判断条件不能为空'
        }
      }
    },
  }
})

export default getSchema