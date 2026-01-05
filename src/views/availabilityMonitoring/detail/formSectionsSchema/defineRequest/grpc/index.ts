import { changeVisible } from '../../../utils'
import { Protocol } from '../../../constants'
import { basicTabsMap } from '../constants'
import { commonUrlConfig } from '../../commonFields'
import getAdvancedTab1Schema from './advancedTab1'
import getAdvancedTab2Schema from './advancedTab2'

import type { Field } from '@formily/core'
import type { ISchema } from "@formily/vue"
import type { IGetSchemaParams } from '../../../interfaces'

const getSchema = ({ isView, form, openEditor }: IGetSchemaParams): ISchema => ({
  type: 'object',
  'x-component': 'Space',
  'x-component-props': {
    direction: 'column',
    fill: true,
    style: {
      width: '100%',
    }
  },
  'x-reactions': [
    (field: Field) => {
      changeVisible(field, Protocol.GRPC)
    },
    {
      dependencies: ['collapse.step1.basicActiveKey'],
      fulfill: {
        run: `$self.value = Object.fromEntries(Object.entries($self.value || {}).filter(([k, v]) => ['cert', 'insecureSkipVerify', 'metadata', 'privateKey', 'timeout', 'host', 'port'].includes(k)))`,
      },
    },
  ],
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
          hostPlaceholder: '如：www.example.com',
          portPlaceholder: '如：50051',
          toolTip: '定义好请求格式且添加结果判断条件后，即可测试链接，（测试与选择节点无关）',
        }),
      }
    },
    basicConfig: {
      type: 'void',
      'x-decorator': 'div',
      'x-decorator-props': {
        class: 'inner-FormCollapse',
        style: {
          width: 'calc(100% - 32px)',
          marginLeft: '16px',
        },
      },
      'x-component': 'FormTab',
      'x-component-props': {
        grpcBasicFormTab: '{{grpcBasicFormTab}}',
        disabled: isView,
        onInput: (activeKey: string) => {
          const basicActiveKeyField = form.value.query('collapse.step1.basicActiveKey')?.take() as Field
          basicActiveKeyField.value = activeKey
        },
      },
      'x-reactions': (field: Field) => {
        if (!field.selfModified) {
          field?.data?.setActiveKey?.(field.form.values.basicActiveKey)
        }
      },
      properties: {
        ...Object.fromEntries(
          Object.entries(basicTabsMap)
            .map(([k, v]) => ([
              k,
              v.getSchema({ isView, label: v.label, form }),
            ])
          )
        ),
      },
    },
    collapse: {
      type: 'void',
      'x-decorator': 'div',
      'x-decorator-props': {
        class: 'inner-FormCollapse',
        style: {
          width: 'calc(100% - 32px)',
          marginLeft: '16px',
        },
      },
      'x-component': 'FormCollapse',
      'x-component-props': {
        formCollapse: '{{grpcFormCollapse}}',
      },
      properties: {
        requestStep1: {
          type: 'void',
          'x-component': 'FormCollapse.Item',
          'x-component-props': {
            title: '定义请求格式'
          },
          properties: {
            /** 高级选项 */
            collapse: {
              type: 'void',
              'x-component': 'FormTab',
              'x-component-props': {
                httpAdvancedFormTab: '{{grpcAdvancedFormTab}}',
              },
              properties: {
                tab1: getAdvancedTab1Schema({ isView }),
                tab2: getAdvancedTab2Schema({ isView }),
              },
            },
          },
        }
      }
    },
  }
})

export default getSchema