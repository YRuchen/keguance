import {
  getRequestTypeSchema,
  getDefineRequestSchema,
  getAssertionsSchema,
  getLocationsSchema,
  getMonitoringFrequency,
  getWarningConfig,
} from '../formSectionsSchema'

import type { ISchema } from '@formily/vue'
import type { IGetSchemaParams } from '../interfaces'

const getSchema = ({ isView, isCreate, form, openEditor }: IGetSchemaParams): ISchema => ({
  type: 'Object',
  properties: {
    name: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        label: '任务名称',
        labelWidth: 75,
        style: {
          textAlign: 'left',
        },
      },
      'x-component': 'Input',
      'x-component-props': {
        placeholder: '请输入任务名称',
      },
      'x-validator': (value: string) => {
        if (!value) {
          return '任务名称不能为空'
        }
      },
    },
    collapse: {
      type: 'void',
      'x-component': 'FormCollapse',
      'x-component-props': {
        formCollapse: '{{wrapperFormCollapse}}',
      },
      properties: {
        step1: getRequestTypeSchema({ isView, isCreate }),
        step2: getDefineRequestSchema({ isView, form, openEditor }),
        assertionsSchema: getAssertionsSchema({ isView }),
        locationsSchema: getLocationsSchema({ isView }),
        monitoringFrequency: getMonitoringFrequency({ isView }),
        warningConfig: getWarningConfig({ isView, form }),
      },
    }
  },
})

export default getSchema