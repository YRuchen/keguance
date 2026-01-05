import { icpStatusOptions } from '~/api/domainManagement/common'

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
        domain: {
          type: 'string',
          'x-decorator': 'FormItem',
          'x-decorator-props': {
            label: '域名',
          },
          'x-component': 'Input',
        },
        status: {
          type: 'string',
          'x-decorator': 'FormItem',
          'x-decorator-props': {
            label: '检测结果',
          },
          'x-component': 'Select',
          enum: icpStatusOptions,
        },
        websiteName: {
          type: 'string',
          'x-decorator': 'FormItem',
          'x-decorator-props': {
            label: '网站名称',
          },
          'x-component': 'Input',
        },
        organizerName: {
          type: 'string',
          'x-decorator': 'FormItem',
          'x-decorator-props': {
            label: '主办单位名称',
          },
          'x-component': 'Input',
        },
        subjectType: {
          type: 'string',
          'x-decorator': 'FormItem',
          'x-decorator-props': {
            label: '主体类型',
          },
          'x-component': 'Input',
        },
        websiteLicense: {
          type: 'string',
          'x-decorator': 'FormItem',
          'x-decorator-props': {
            label: '网站备案/许可证',
          },
          'x-component': 'Input',
        },
        checkTime: {
          type: 'string',
          'x-decorator': 'FormItem',
          'x-decorator-props': {
            label: '审核时间',
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
