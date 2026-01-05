import { getDataSourceListApi } from '~/api/logs/indexManagement'

import type { ISchema } from '@formily/vue'

const commonProps = {
  direction: 'column',
  align: 'start',
  style: {
    position: 'relative',
  },
}
const commonStyle = {
  width: 'calc(100% - 33px)',
  marginLeft: '33px',
}
const commonLabelWidth = 97
export const getSchema = (): ISchema => ({
  type: 'object',
  properties: {
    collapse: {
      type: 'void',
      properties: {
        step1: {
          type: 'void',
          'x-component': 'KeepUpSpace',
          'x-component-props': commonProps,
          properties: {
            void: {
              type: 'void',
              'x-component': 'KeepUpSpace',
              'x-component-props': {
                fill: true,
                style: {
                  position: 'relative',
                },
              },
              properties: {
                circle: {
                  type: 'void',
                  'x-component': 'div',
                  'x-component-props': {
                    style: {
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      border: '2px solid #000',
                      textAlign: 'center',
                      lineHieght: '20px',
                      fontWeight: 'bold',
                      backgroundColor: '#fff',
                    },
                  },
                  'x-content': '1',
                },
                line: {
                  type: 'void',
                  'x-component': 'div',
                  'x-component-props': {
                    style: {
                      width: '2px',
                      height: '200px',
                      backgroundColor: 'rgb(0, 0, 0)',
                      position: 'absolute',
                      top: '23px',
                      left: '11px',
                    },
                  },
                },
                title: {
                  type: 'void',
                  'x-component': 'div',
                  'x-component-props': {

                  },
                  'x-content': '设置索引名',
                },
              },
            },
            indexName: {
              type: 'string',
              title: '索引名',
              required: true,
              'x-decorator': 'FormItem',
              'x-decorator-props': {
                style: commonStyle,
                labelWidth: commonLabelWidth,
              },
              'x-component': 'Input',
              'x-component-props': {
                placeholder: '请输入索引名',
              },
              'x-validator': (value: string) => {
                if (!value) {
                  return '请输入索引名'
                }
                const regx = /^[a-z][a-z0-9.-]*$/
                const fail = !regx.test(value)
                return fail ? '索引名称必须以字母开头，并且只能包含小写字母、数字或"-"字符' : ''
              }
            },
          },
        },
        step2: {
          type: 'void',
          'x-component': 'KeepUpSpace',
          'x-component-props': commonProps,
          properties: {
            void: {
              type: 'void',
              'x-component': 'KeepUpSpace',
              'x-component-props': {
                fill: true,
              },
              properties: {
                circle: {
                  type: 'void',
                  'x-component': 'div',
                  'x-component-props': {
                    style: {
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      border: '2px solid #000',
                      textAlign: 'center',
                      lineHieght: '20px',
                      fontWeight: 'bold',
                      backgroundColor: '#fff',
                    },
                  },
                  'x-content': '2',
                },
                line: {
                  type: 'void',
                  'x-component': 'div',
                  'x-component-props': {
                    style: {
                      width: '2px',
                      height: '65px',
                      backgroundColor: 'rgb(0, 0, 0)',
                      position: 'absolute',
                      top: '23px',
                      left: '11px',
                    },
                  },
                },
                title: {
                  type: 'void',
                  'x-component': 'div',
                  'x-component-props': {

                  },
                  'x-content': '选择索引源',
                },
              },
            },
            dataSourceId: {
              type: 'string',
              title: '索引源',
              required: true,
              'x-decorator': 'FormItem',
              'x-decorator-props': {
                style: commonStyle,
                labelWidth: commonLabelWidth,
              },
              'x-component': 'Select',
              'x-component-props': {
                placeholder: '请选择索引源',
                fetchConfig: {
                  api: getDataSourceListApi,
                  formatter: (res) => res.data.list.map(v => ({
                    label: v.name,
                    value: v.id,
                  })),
                },
              },
              'x-reactions': '{{fetchOptions}}',
            },
          },
        },
        step3: {
          type: 'void',
          'x-component': 'KeepUpSpace',
          'x-component-props': commonProps,
          properties: {
            void: {
              type: 'void',
              'x-component': 'KeepUpSpace',
              'x-component-props': {
                fill: true,
              },
              properties: {
                circle: {
                  type: 'void',
                  'x-component': 'div',
                  'x-component-props': {
                    style: {
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      border: '2px solid #000',
                      textAlign: 'center',
                      lineHieght: '20px',
                      fontWeight: 'bold',
                      backgroundColor: '#fff',
                    },
                  },
                  'x-content': '3',
                },
                line: {
                  type: 'void',
                  'x-component': 'div',
                  'x-component-props': {
                    style: {
                      width: '2px',
                      height: '65px',
                      backgroundColor: 'rgb(0, 0, 0)',
                      position: 'absolute',
                      top: '23px',
                      left: '11px',
                    },
                  },
                },
                title: {
                  type: 'void',
                  'x-component': 'div',
                  'x-component-props': {

                  },
                  'x-content': '选择索引源',
                },
              },
            },
            numberOfShards: {
              type: 'string',
              title: '索引分片数',
              required: true,
              'x-decorator': 'FormItem',
              'x-decorator-props': {
                style: commonStyle,
                labelWidth: commonLabelWidth,
              },
              'x-component': 'InputNumber',
            },
          },
        },
        step4: {
          type: 'void',
          'x-component': 'KeepUpSpace',
          'x-component-props': commonProps,
          properties: {
            void: {
              type: 'void',
              'x-component': 'KeepUpSpace',
              'x-component-props': {
                fill: true,
              },
              properties: {
                circle: {
                  type: 'void',
                  'x-component': 'div',
                  'x-component-props': {
                    style: {
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      border: '2px solid #000',
                      textAlign: 'center',
                      lineHieght: '20px',
                      fontWeight: 'bold',
                      backgroundColor: '#fff',
                    },
                  },
                  'x-content': '4',
                },
                title: {
                  type: 'void',
                  'x-component': 'div',
                  'x-component-props': {

                  },
                  'x-content': '设置索引分片副本数量',
                },
              },
            },
            numberOfReplicas: {
              type: 'string',
              title: '副本数量',
              required: true,
              'x-decorator': 'FormItem',
              'x-decorator-props': {
                style: commonStyle,
                labelWidth: commonLabelWidth,
              },
              'x-component': 'InputNumber',
            },
          },
        },
      },
    },
  },
})
