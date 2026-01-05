import { domainStatusOptions } from '~/api/domainManagement/common'

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
            domainExpiryStatus: {
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
              enum: domainStatusOptions,
            },
            expiryDate: {
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
                label: '过期时间',
              },
              'x-component': 'Input',
            },
          },
        },
        domain: {
          type: 'string',
          'x-decorator': 'FormItem',
          'x-decorator-props': {
            label: '域名',
          },
          'x-component': 'Input',
        },
        registrarName: {
          type: 'string',
          'x-decorator': 'FormItem',
          'x-decorator-props': {
            label: '注册商',
          },
          'x-component': 'Input',
        },
        createDate: {
          type: 'string',
          'x-decorator': 'FormItem',
          'x-decorator-props': {
            label: '注册时间',
          },
          'x-component': 'Input',
        },
        updateDate: {
          type: 'string',
          'x-decorator': 'FormItem',
          'x-decorator-props': {
            label: '更新时间',
          },
          'x-component': 'Input',
        },
        dnsServer: {
          type: 'string',
          'x-decorator': 'FormItem',
          'x-decorator-props': {
            label: 'DNS服务器',
          },
          'x-component': 'Input',
        },
        domainStatus: {
          type: 'string',
          'x-decorator': 'FormItem',
          'x-decorator-props': {
            label: '域名状态',
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
