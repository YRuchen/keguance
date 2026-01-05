import { polluteStatusOptions } from '~/api/domainManagement/common'

import type { ISchema } from '@formily/vue'

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
    voidGridBox: {
      type: 'void',
      'x-component': 'FormGrid',
      'x-component-props': {
        maxColumns: 3,
        minColumns: 3,
      },
      properties: {
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
              enum: polluteStatusOptions,
            },
            ip: {
              type: 'string',
              'x-decorator': 'FormItem',
              'x-decorator-props': {
                style: commonStyle,
                label: '解析IP',
              },
              'x-component': 'Input',
            },
          },
        },
        ipLocation: {
          type: 'string',
          'x-decorator': 'FormItem',
          'x-decorator-props': {
            label: 'IP所在地',
          },
          'x-component': 'Input',
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
