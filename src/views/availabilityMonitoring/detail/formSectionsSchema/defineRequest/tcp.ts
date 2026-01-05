import { requiredText } from '~/constants/common'
import { changeVisible } from '../../utils'
import { Protocol } from '../../constants'
import { commonUrlConfig, commonToolTipContainer, commonTimeout } from '../commonFields'

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
    changeVisible(field, Protocol.TCP)
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
          hostPlaceholder: '请输入HOST',
          portPlaceholder: '请输入PORT',
          toolTip: '定义好请求格式且添加结果判断条件后，即可测试链接，（测试与选择节点无关）',
        }),
      }
    },
    /** 跟随重定向 */
    tooltipContainer1: commonToolTipContainer({
      schema: {
        track: {
          type: 'boolean',
          'x-decorator': 'FormItem',
          'x-component': 'Checkbox',
          'x-component-props': {
            label: '路由跟踪',
          },
          // 'x-validator': (value: string) => {
          //   if (!value) {
          //     return requiredText
          //   }
          // },
        },
      },
      tooltip: '开启后，将追踪从探测节点到目标主机所有网关。',
    }),
    timeout: commonTimeout({
      preFixTitle: 'TCP连接超时时间',
      suffixTitle: '超过这个时间视为失败',
    }),
  }
})

export default getSchema