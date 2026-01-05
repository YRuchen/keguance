import { sslStatusOptions } from '~/api/domainManagement/common'

import type { ISchema } from '@formily/vue'

const commonStyle = {
  fontWeight: 'bold',
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
              enum: sslStatusOptions,
            },
            remainingTime: {
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
                label: '剩余时间',
              },
              'x-component': 'Input',
              'x-content': {
                append: () => '（天）',
              },
            },
          },
        },
        voidSpaceTitleBox1: {
          type: 'void',
          'x-decorator': 'FormGrid.GridColumn',
          'x-decorator-props': {
            gridSpan: 3,
          },
          properties: {
            void1: {
              type: 'void',
              'x-decorator': 'FormItem',
              'x-decorator-props': {
                style: commonStyle,
                label: '颁发给',
              },
            },
          },
        },
        voidSpaceBox2: {
          type: 'void',
          'x-decorator': 'FormGrid.GridColumn',
          'x-decorator-props': {
            gridSpan: 3,
          },
          properties: {
            commonName: {
              type: 'string',
              'x-decorator': 'FormItem',
              'x-decorator-props': {
                label: '公用名',
              },
              'x-component': 'Input',
            },
          },
        },
        voidSpaceTitleBox3: {
          type: 'void',
          'x-decorator': 'FormGrid.GridColumn',
          'x-decorator-props': {
            gridSpan: 3,
          },
          properties: {
            void2: {
              type: 'void',
              'x-decorator': 'FormItem',
              'x-decorator-props': {
                style: commonStyle,
                label: '颁发者',
              },
            },
          },
        },
        voidSpaceBox4: {
          type: 'void',
          'x-decorator': 'FormGrid.GridColumn',
          'x-decorator-props': {
            gridSpan: 3,
          },
          properties: {
            void2SpaceBox: {
              type: 'void',
              'x-decorator': 'KeepUpSpace',
              'x-decorator-props': {

              },
              properties: {
                issuer: {
                  type: 'string',
                  'x-decorator': 'FormItem',
                  'x-decorator-props': {
                    style: { width: '50%' },
                    label: '证书签发机构',
                  },
                  'x-component': 'Input',
                },
                organization: {
                  type: 'string',
                  'x-decorator': 'FormItem',
                  'x-decorator-props': {
                    style: { width: '50%' },
                    label: '组织（O）',
                  },
                  'x-component': 'Input',
                },
              },
            },
          },
        },
        voidSpaceTitleBox5: {
          type: 'void',
          'x-decorator': 'FormGrid.GridColumn',
          'x-decorator-props': {
            gridSpan: 3,
          },
          properties: {
            void3: {
              type: 'void',
              'x-decorator': 'FormItem',
              'x-decorator-props': {
                style: commonStyle,
                label: '有效期',
              },
            },
          },
        },
        voidSpaceBox6: {
          type: 'void',
          'x-decorator': 'FormGrid.GridColumn',
          'x-decorator-props': {
            gridSpan: 3,
          },
          properties: {
            void3SpaceBox: {
              type: 'void',
              'x-decorator': 'KeepUpSpace',
              'x-decorator-props': {

              },
              properties: {
                validFrom: {
                  type: 'string',
                  'x-decorator': 'FormItem',
                  'x-decorator-props': {
                    style: { width: '33%' },
                    label: '证书生效时间',
                  },
                  'x-component': 'Input',
                },
                validTo: {
                  type: 'string',
                  'x-decorator': 'FormItem',
                  'x-decorator-props': {
                    style: { width: '33%' },
                    label: '证书过期时间',
                  },
                  'x-component': 'Input',
                },
                certificateType: {
                  type: 'string',
                  'x-decorator': 'FormItem',
                  'x-decorator-props': {
                    style: { width: '33%' },
                    label: '证书类型',
                  },
                  'x-component': 'Input',
                },
              },
            },
          },
        },
        voidSpaceTitleBox7: {
          type: 'void',
          'x-decorator': 'FormGrid.GridColumn',
          'x-decorator-props': {
            gridSpan: 3,
          },
          properties: {
            void4: {
              type: 'void',
              'x-decorator': 'FormItem',
              'x-decorator-props': {
                style: commonStyle,
                label: 'SHA256指纹',
              },
            },
          },
        },
        voidSpaceBox8: {
          type: 'void',
          'x-decorator': 'FormGrid.GridColumn',
          'x-decorator-props': {
            gridSpan: 3,
          },
          properties: {
            void4SpaceBox: {
              type: 'void',
              'x-decorator': 'KeepUpSpace',
              'x-decorator-props': {
                direction: 'column',
                align: 'start',
              },
              properties: {
                cert: {
                  type: 'string',
                  'x-decorator': 'FormItem',
                  'x-decorator-props': {
                    label: '证书',
                  },
                  'x-component': 'Input',
                },
                publicKey: {
                  type: 'string',
                  'x-decorator': 'FormItem',
                  'x-decorator-props': {
                    label: '公钥',
                  },
                  'x-component': 'Input',
                },
              },
            },
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

