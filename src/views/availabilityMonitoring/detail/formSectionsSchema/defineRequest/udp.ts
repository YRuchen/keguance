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
    changeVisible(field, Protocol.UDP)
  },
  properties: {
    urlConfig: {
      type: 'void',
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        style: {  width: '100%' },
      },
      'x-component': 'Space',
      'x-component-props': {
        size: 12,
      },
      properties: {
        ...commonUrlConfig({
          openEditor,
          isView,
          hostPlaceholder: '请输入HOST',
          portPlaceholder: '请输入PORT',
          toolTip: '定义好请求格式且添加结果判断条件后，即可测试链接，（测试与选择节点无关）',
        }),
      }
    },
    msg: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        label: '要发送的UDP数据内容',
        layout: 'vertical',
        labelWidth: 160,
        labelAlign: 'left',
        style: {  width: '100%' },
      },
      'x-component': 'Input.TextArea',
      'x-component-props': {
        placeholder: '例如："type": "ping"',
      },
      // 'x-validator': (value: string) => {
      //   if (!value) {
      //     return requiredText
      //   }
      // },
    },
    timeout: commonTimeout({
      preFixTitle: '等待响应时间',
      suffixTitle: '超过这个时间视为失败',
    }),
  }
})

export default getSchema