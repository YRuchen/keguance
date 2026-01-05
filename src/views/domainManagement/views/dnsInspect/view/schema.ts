import { dnsStatusOptions } from '~/api/domainManagement/common'

import type { ISchema } from '@formily/vue'
import { Field } from '@formily/core'

const commonStyle = {
  width: '50%',
  border: '1px solid #e0e0e0',
  borderRadius: '8px',
  padding: '8px 16px',
  boxSizing: 'border-box',
}
export const getSchema = (): ISchema => ({
  type: 'void',
  properties: {
    reasonTitle: {
      type: 'void',
      'x-decorator': 'FormItem',
      'x-component': 'SectionTitle',
      'x-component-props': {
        title: '执行概览',
      },
    },
    voidSpaceBox: {
      type: 'void',
      'x-decorator': 'FormGrid.GridColumn',
      'x-decorator-props': {
        gridSpan: 3,
      },
      'x-component': 'KeepUpSpace',
      'x-component-props': {
        fill: true,
      },
      properties: {
        status: {
          type: 'string',
          'x-decorator': 'FormItem',
          'x-decorator-props': {
            style: commonStyle,
            label: '检测结果',
          },
          'x-component': 'Select',
          enum: dnsStatusOptions,
        },
        dnsAvgLatency: {
          type: 'string',
          'x-decorator': 'FormItem',
          'x-decorator-props': {
            style: commonStyle,
            label: 'DNS解析耗时',
          },
          'x-component': 'Input',
          'x-content': {
            append: () => '(ms)',
          },
        },
      },
    },
    resultTitle: {
      type: 'void',
      'x-decorator': 'FormItem',
      'x-component': 'SectionTitle',
      'x-component-props': {
        title: '运行详情',
      },
    },
    result: {
      type: 'object',
      'x-component': 'JsonPretty',
      'x-component-props': {
        deep: 0,
      },
    },
  },
})
