import { statusMap, domainTypeOptions } from '../constants'

import type { Field } from '@formily/core'
import type { ISchema } from '@formily/vue'

const schema: ISchema = {
  type: 'object',
  properties: {
    grid: {
      type: 'void',
      'x-decorator': 'FormGrid',
      'x-decorator-props': {
        maxColumns: 2,
        minColumns: 2,
        columnGap: 158,
        rowGap: 0,
      },
      properties: {
        sourceStation: {
          type: 'string',
          'x-decorator': 'FormItem',
          'x-decorator-props': {
            label: '源地址',
            colon: false,
            layout: 'vertical',
          },
          'x-component': 'Input',
        },
        domain: {
          type: 'string',
          'x-decorator': 'FormItem',
          'x-decorator-props': {
            label: '域名',
            colon: false,
            layout: 'vertical',
          },
          'x-component': 'Input',
        },
        domainType: {
          type: 'string',
          'x-decorator': 'FormItem',
          'x-decorator-props': {
            label: '域名类型',
            colon: false,
            layout: 'vertical',
          },
          'x-component': 'Input',
          'x-reactions': (field: Field) => {
            field.setValue(domainTypeOptions.find(v => v.value === field.value)?.label)
          },
        },
        backupDomain: {
          type: 'string',
          'x-decorator': 'FormItem',
          'x-decorator-props': {
            label: '备用域名',
            colon: false,
            layout: 'vertical',
          },
          'x-component': 'Input',
        },
        // projectName: {
        //   type: 'string',
        //   'x-decorator': 'FormItem',
        //   'x-decorator-props': {
        //     label: '所属项目',
        //     colon: false,
        //     layout: 'vertical',
        //   },
        //   'x-component': 'Input',
        // },
        service: {
          type: 'string',
          'x-decorator': 'FormItem',
          'x-decorator-props': {
            label: '使用服务',
            colon: false,
            layout: 'vertical',
          },
          'x-component': 'Input',
        },
        status: {
          type: 'string',
          'x-decorator': 'FormItem',
          'x-decorator-props': {
            label: '状态',
            colon: false,
            layout: 'vertical',
          },
          'x-component': 'Input',
          'x-reactions': (field: Field) => {
            // field.setComponentProps({ type: statusMap[field.value]?.type })
            // field.setContent(statusMap[field.value]?.label)
          },
        },
        domainExpiryDate: {
          type: 'string',
          'x-decorator': 'FormItem',
          'x-decorator-props': {
            label: '域名到期时间',
            colon: false,
            layout: 'vertical',
          },
          'x-component': 'Input',
        },
        sslExpiryDate: {
          type: 'string',
          'x-decorator': 'FormItem',
          'x-decorator-props': {
            label: '证书到期时间',
            colon: false,
            layout: 'vertical',
          },
          'x-component': 'Input',
        },
        isActive: {
          type: 'string',
          'x-decorator': 'FormItem',
          'x-decorator-props': {
            label: '使用中',
            colon: false,
            layout: 'vertical',
          },
          'x-component': 'ElTag',
          'x-reactions': (field: Field) => {
            field.setComponentProps({ type: field.value ? 'primary' : 'danger' })
            field.setContent(field.value ? '是' : '否')
          }
        },
        responsiblePerson: {
          type: 'string',
          'x-decorator': 'FormItem',
          'x-decorator-props': {
            label: '责任人',
            colon: false,
            layout: 'vertical',
          },
          'x-component': 'Input',
        },
        gridColumn: {
          'x-decorator': 'FormGrid.GridColumn',
          'x-decorator-props': {
            gridSpan: 2,
          },
        },
        gridColumn1: {
          type: 'void',
          'x-decorator': 'FormGrid.GridColumn',
          'x-decorator-props': {
            gridSpan: 2,
          },
          properties: {
            cdnInfo: {
              type: 'string',
              'x-decorator': 'FormItem',
              'x-decorator-props': {
                label: 'CDN接入商',
                colon: false,
                layout: 'vertical',
              },
              'x-component': 'CommonJsonPretty',
              'x-component-props': {
                editable: false,
                showIcon: true,
              }
            },
          },
        }
      },
    }
  }
}

export default schema
