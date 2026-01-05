import { h } from 'vue'
import { requiredText } from '~/constants/common'
import { changeVisible } from '../../../utils'
import { Protocol } from '../../../constants'
import { commonToolTip } from '../../commonFields'
import getTab1Schema from './tab1'
import getTab2Schema from './tab2'
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
    style: {
      width: '100%',
    },
  },
  'x-reactions': (field: Field) => {
    changeVisible(field, Protocol.WEBSOCKET)
  },
  properties: {
    urlConfig: {
      type: 'void',
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        style: {  width: '100%' },
        labelWidth: 40,
        label: 'URL',
        labelAlign: 'left',
        colon: false,
      },
      'x-component': 'Space',
      'x-component-props': {
        size: 12,
      },
      properties: {
        url: {
          type: 'string',
          'x-decorator': 'FormItem',
          'x-decorator-props': {
            style: {
              padding: 0,
              flex: 1,
              textAlign: 'left',
            }
          },
          'x-component': 'Input',
          'x-component-props': {
            placeholder: '请以ws://或wss://开头',
          },
          'x-validator': (value: string) => {
            if (!value) {
              return '请输入URL'
            }
          },
        },
        btn: {
          type: 'void',
          'x-component': 'ElButton',
          'x-component-props': {
            type: 'primary',
            style: {
              width: 'fit-content',
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
          paddingLeft: '40px',
          boxSizing: 'border-box',
        },
      },
      'x-component': 'FormCollapse',
      'x-component-props': {
        formCollapse: '{{websocketCollapse}}',
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
                httpAdvancedFormTab: '{{websocketAdvancedFormTab}}',
              },
              properties: {
                tab1: getTab1Schema(),
                tab2: getTab2Schema({ isView }),
              },
            },
          },
        },
      },
    },
    message: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        style: { 
          width: '100%',
          textAlign: 'left',
        },
        labelWidth: 70,
        label: '测试消息',
        labelAlign: 'left',
        layout: 'vertical',
        colon: false,
      },
      'x-component': 'Input.TextArea',
      'x-component-props': {
        placeholder: '连接建立后将自动发送该消息，用于验证服务响应是否正常，支持JSON或文本格式。',
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