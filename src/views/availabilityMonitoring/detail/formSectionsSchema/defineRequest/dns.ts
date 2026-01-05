import { requiredText } from '~/constants/common'
import { changeVisible } from '../../utils'
import { Protocol } from '../../constants'
import { commonTimeout, commonUrlConfig } from '../commonFields'

import type { Field } from '@formily/core'
import type { ISchema } from "@formily/vue"
import type { IGetSchemaParams } from '../../interfaces'

const getSchema = ({ isView, openEditor }: IGetSchemaParams): ISchema => ({
  type: 'object',
  'x-component': 'Space',
  'x-component-props': {
    direction: 'column',
    fill: true,
    style: {
      width: '100%',
    }
  },
  'x-reactions': (field: Field) => {
    changeVisible(field, Protocol.DNS)
  },
  properties: {
    urlConfig: {
      type: 'void',
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        style: { width: '100%' },
      },
      'x-component': 'Space',
      'x-component-props': {
        size: 12,
      },
      properties: {
        ...commonUrlConfig({
          openEditor,
          isView,
          hostPlaceholder: '如：www.example.com',
          portPlaceholder: '如：53',
          toolTip: '定义好请求格式且添加结果判断条件后，即可测试链接，（测试与选择节点无关）',
        }),
      }
    },
    dnsServer: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        label: 'DNS服务器',
        colon: false,
        layout: 'vertical',
        labelAlign: 'left',
        labelWidth: 83,
        style: { 
          width: '100%',
          textAlign: 'left',
        },
      },
      'x-component': 'Input',
      'x-component-props': {
        placeholder: '支持自定义DNS服务器，便于测试制定解析路径',
      },
      // 'x-validator': (value: string) => {
      //   if (!value) {
      //     return requiredText
      //   }
      // },
    },
    timeout: commonTimeout({
      preFixTitle: '超过',
      suffixTitle: '未拿到证书任务视为失败',
    }),
  }
})

export default getSchema