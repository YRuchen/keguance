import { hijackStatusOptions } from '~/api/domainManagement/common'

import type { ISchema } from '@formily/vue'

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
            hijackStatus: {
              type: 'string',
              'x-decorator': 'FormItem',
              'x-decorator-props': {
                style: {
                  width: '50%',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  padding: '8px 16px',
                  boxSizing: 'border-box',
                },
                label: '检测结果',
              },
              'x-component': 'Select',
              enum: hijackStatusOptions,
            },
            statusCode: {
              type: 'string',
              'x-decorator': 'FormItem',
              'x-decorator-props': {
                style: {
                  width: '50%',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  padding: '8px 16px',
                  boxSizing: 'border-box',
                },
                label: 'HTTP状态码',
              },
              'x-component': 'Input',
            },
          },
        },
        ip: {
          type: 'string',
          'x-decorator': 'FormItem',
          'x-decorator-props': {
            label: '解析IP',
          },
          'x-component': 'Input',
        },
        ipLocation: {
          type: 'string',
          'x-decorator': 'FormItem',
          'x-decorator-props': {
            label: 'IP所在地',
          },
          'x-component': 'Input',
        },
        jumpAddress: {
          type: 'string',
          'x-decorator': 'FormItem',
          'x-decorator-props': {
            label: '跳转地址',
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
