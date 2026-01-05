import { requiredText } from '~/constants/common'
import { commonRemoveVisible } from '../../../utils'
import { commonTimeout, commonToolTipContainer } from '../../commonFields'

import type { ISchema } from "@formily/vue"
import type { IGetSchemaParams } from '../../../interfaces'

const commonStyle = {
  textAlign: 'left',
}
export const getSchema = ({ isView }: IGetSchemaParams): ISchema => ({
  type: 'void',
  'x-component': 'FormTab.TabPane',
  'x-component-props': {
    label: '请求设置',
  },
  properties: {
    timeoutBox: commonTimeout(),
    tooltipContainer4: commonToolTipContainer({
      schema: {
        insecureSkipVerify: {
          type: 'boolean',
          'x-decorator': 'FormItem',
          'x-component': 'Checkbox',
          'x-component-props': {
            label: '忽略证书错误',
          },
          // 'x-validator': (value: string) => {
          //   if (!value) {
          //     return requiredText
          //   }
          // },
        },
      },
      tooltip: '如果 gRPC 服务启用了 TLS/SSL，但证书不合法（比如自签名证书、过期证书或域名不匹配），请求会失败。勾选这个选项后，会忽略证书验证错误，继续执行调用。',
    }),
    metadata: {
      type: 'array',
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        label: 'grpc请求元数据',
        layout: 'vertical',
        labelAlign: 'left',
        labelWidth: '120',
      },
      'x-component': 'ArrayItems',
      default: [{ key: '', value: '' }],
      items: {
        type: 'object',
        'x-decorator': 'ArrayItems.Item',
        properties: {
          space: {
            type: 'void',
            'x-component': 'FormGrid',
            'x-component-props': {
              maxColumns: 16,
              minColumns: 16,
            },
            properties: {
              /** key */
              key: {
                type: 'string',
                'x-decorator': 'FormGrid.GridColumn',
                'x-decorator-props': {
                  gridSpan: 7,
                  style: commonStyle,
                },
                'x-component': 'Input',
                'x-component-props': {
                  placeholder: '参数名称',
                  style: commonStyle,
                },
              },
              /** value */
              value: {
                type: 'string',
                'x-decorator': 'FormGrid.GridColumn',
                'x-decorator-props': {
                  gridSpan: 8,
                  style: commonStyle,
                },
                'x-component': 'Input',
                'x-component-props': {
                  placeholder: '值',
                },
              },
              remove: {
                type: 'void',
                'x-decorator': 'FormGrid.GridColumn',
                'x-decorator-props': {
                  gridSpan: 1,
                },
                'x-component': 'ArrayItems.Remove',
                'x-reactions': commonRemoveVisible,
              },
            },
          },
        },
      },
      properties: {
        add: {
          type: 'void',
          'x-component': 'ArrayItems.Addition',
          'x-component-props': {
            title: '添加条件',
            type: 'primary',
            link: true,
            style: {
              display: 'flex',
              justifyContent: 'flex-start',
              marginTop: '10px',
              padding: 0,
              fontSize: '14px',
              color: '#409EFF',
              background: 'none',
              border: 'none',
            },
          },
        },
      },
      // 'x-validator': (value: Record<string, string>[] = []) => {
      //   const isEmpty = value.every(v => !v.key && !v.value)
      //   if (isEmpty) {
      //     return requiredText
      //   }
      // },
    },
  },
})

export default getSchema
