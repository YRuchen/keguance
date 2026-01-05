import { h } from 'vue'
import { changeVisible } from '../../../utils'
import { methodOptions, Protocol } from '../../../constants' 
import { commonToolTip } from '../../commonFields'
import getTab1Schema from './tab1'
import getTab2Schema from './tab2'
import getTab3Schema from './tab3'
import getTab4Schema from './tab4'
import getTab5Schema from './tab5'
import getTab6Schema from './tab6'
import styles from '../../../index.module.scss'

import type { Field } from '@formily/core'
import type { ISchema } from "@formily/vue"
import type { IGetSchemaParams } from '../../../interfaces'

const getSchema = ({ isView, openEditor }: IGetSchemaParams): ISchema => ({
  type: 'object',
  'x-component': 'Space',
  'x-component-props': {
    direction: 'column',
    fill: true,
    align: 'start',
    style: {
      width: '100%',
    }
  },
  'x-reactions': (field: Field) => {
    changeVisible(field, Protocol.HTTP)
  },
  properties: {
    grid: {
      type: 'void',
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        label: 'URL',
        colon: false,
        labelWidth: 40,
      },
      'x-component': 'FormGrid',
      'x-component-props': {
        maxColumns: 16,
        minColumns: 16,
        columnGap: 0,
      },
      properties: {
        voidMethod: {
          type: 'void',
          'x-decorator': 'FormGrid.GridColumn',
          'x-decorator-props': {
            gridSpan: 2,
          },
          properties: {
            /** 请求类型 */
            method: {
              type: 'string',
              'x-decorator': 'FormItem',
              'x-decorator-props': {
                style: {
                  padding: 0,
                },
              },
              'x-component': 'Select',
              'x-component-props': {
                class: styles.leftRadius,
              },
              enum: methodOptions,
              'x-validator': (value: string) => {
                if (!value) {
                  return '请求类型不能为空'
                }
              },
            },
          },
        },
        voidUrl: {
          type: 'void',
          'x-decorator': 'FormGrid.GridColumn',
          'x-decorator-props': {
            gridSpan: 11,
          },
          properties: {
            /** 请求url */
            url: {
              type: 'string',
              'x-decorator': 'FormItem',
              'x-decorator-props': {
                style: {
                  padding: 0,
                },
              },
              'x-component': 'Input',
              'x-component-props': {
                class: styles.straightAngle,
                style: {
                  height: '32px',
                },
                placeholder: '请输入有效URL地址，例如：https://www.baidu.com',
              },
              'x-validator': (value: string) => {
                if (!value) {
                  return 'URL不能为空'
                }
              },
            },
          },
        },
        btn: {
          type: 'void',
          'x-decorator': 'FormGrid.GridColumn',
          'x-decorator-props': {
            gridSpan: 2,
          },
          'x-component': 'ElButton',
          'x-component-props': {
            type: 'primary',
            style: {
              width: '100%',
              borderRadius: '0 4px 4px 0',
            },
            onClick: () => {
              openEditor()
            },
          },
          'x-content': {
            default: '测试预览',
          },
          'x-visible': !isView,
        },
        ...commonToolTip({ content: '定义好请求格式且添加结果判断条件后，即可测试链接，（测试与选择节点无关）', visible: !isView }),
      },
    },
    collapse: {
      type: 'void',
      'x-decorator': 'div',
      'x-decorator-props': {
        class: 'inner-FormCollapse',
        style: {
          width: 'calc(100% - 32px)',
          marginLeft: '16px',
          paddingLeft: '40px',
          boxSizing: 'border-box',
        },
      },
      'x-component': 'FormCollapse',
      'x-component-props': {
        formCollapse: '{{httpFormCollapse}}',
        style: {
          width: '100%',
          padding: '0 36px',
          boxSizing: 'border-box',
        },
      },
      properties: {
        requestStep1: {
          type: 'void',
          'x-component': 'FormCollapse.Item',
          'x-component-props': {
            title: h('div', {
              class: styles.advancedTitle,
            }, '高级设置'),
            class: styles.advanced,
          },
          properties: {
            /** 高级选项 */
            collapse: {
              type: 'void',
              'x-component': 'FormTab',
              'x-component-props': {
                httpAdvancedFormTab: '{{httpAdvancedFormTab}}',
              },
              properties: {
                tab1: getTab1Schema({ isView }),
                tab2: getTab2Schema({ isView }),
                tab3: getTab3Schema({ isView }),
                tab4: getTab4Schema({ isView }),
                tab5: getTab5Schema({ isView }),
                tab6: getTab6Schema({ isView }),
              },
            },
          },
        }
      }
    },
  }
})

export default getSchema
