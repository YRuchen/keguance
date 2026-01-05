import { getCollapseTitle } from './commonFields'
import {
  monitoringFrequencyTypeOptions,
  MonitoringFrequencyType,
  monitoringFrequencyOptions,
  MonitoringFrequency,
  intervalUnitOptions,
  IntervalUnit,
  weeksOptions,
} from '../constants'

import type { Field } from '@formily/core'
import type { ISchema } from '@formily/vue'
import type { IGetSchemaParams } from '../interfaces'

/** 模式切换 */
const changeDisplayByType = (field: Field, curType: MonitoringFrequencyType) => {
  const type = field.query('.type')?.get('value')
  field.setDisplay(type === curType ? 'visible' : 'none')
}

/** 指定时间和日期 */
const changeDisplayByUseTimeRange = (field: Field) => {
  const useTimeRange = field.query('.useTimeRange')?.get('value')
  field.setDisplay(useTimeRange ? 'visible' : 'none')
}

const getSchema = ({ isView }: IGetSchemaParams): ISchema => ({
  type: 'object',
  'x-component': 'FormCollapse.Item',
  'x-component-props': {
    title: getCollapseTitle({ index: 5, title: '任务监测频率' }),
  },
  properties: {
    type: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Radio.Group',
      'x-component-props': {
        buttonStyle: 'solid',
        optionType: 'button',
        size: 'small',
        style: {
          width: '100%',
        },
      },
      enum: monitoringFrequencyTypeOptions,
      default: MonitoringFrequencyType.DEFAULT,
    },
    default: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Radio.Group',
      'x-component-props': {
        buttonStyle: 'solid',
        optionType: 'button',
        size: 'small',
        style: {
          width: '100%',
        },
      },
      enum: monitoringFrequencyOptions,
      default: MonitoringFrequency.ONE_MIN,
      'x-reactions': (field: Field) => {
        changeDisplayByType(field, MonitoringFrequencyType.DEFAULT)
      },
    },
    custom: {
      type: 'void',
      'x-reactions': (field: Field) => {
        changeDisplayByType(field, MonitoringFrequencyType.CUSTOM)
      },
      properties: {
        interval: {
          type: 'void',
          'x-component': 'div',
          'x-component-props': {
            style: {
              display: 'flex',
              justifyContent: 'flex-start',
            },
          },
          properties: {
            prefix: {
              type: 'void',
              'x-component': 'FormItem',
              'x-component-props': {
                style: {
                  width: 'fit-content',
                  whiteSpace: 'nowrap',
                },
              },
              'x-content': '每隔',
            },
            value: {
              type: 'string',
              'x-component': 'Input',
              'x-component-props': {
                style: {
                  width: '70px',
                  whiteSpace: 'nowrap',
                },
                placeholder: '请输入',
              },
              default: 15,
            },
            unit: {
              type: 'string',
              'x-component': 'Select',
              'x-component-props': {
                style: {
                  width: '80px',
                },
                placeholder: '请选择',
              },
              enum: intervalUnitOptions,
              default: IntervalUnit.MINUTE,
            },
            suffix: {
              type: 'void',
              'x-component': 'FormItem',
              'x-component-props': {
                style: {
                  width: 'fit-content',
                  whiteSpace: 'nowrap',
                },
              },
              'x-content': '运行一次任务',
            },
          },
        },
        useTimeRange: {
          type: 'boolean',
          'x-decorator': 'FormItem',
          'x-component': 'Checkbox',
          'x-component-props': {
            label: '指定时间和日期',
          },
          default: false,
        },
        '[start,end]': {
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'TimePicker',
          'x-component-props': {
            isRange: true,
            format: 'HH:mm',
            rangeSeparator: '至',
            valueFormat: 'HH:mm',
            startPlaceholder: '开始时间',
            endPlaceholder: '结束时间',
            style: {
              width: '240px',
            },
          },
          'x-reactions': changeDisplayByUseTimeRange,
        },
        weeks: {
          type: 'array',
          'x-decorator': 'FormItem',
          'x-component': 'Checkbox.Group',
          enum: weeksOptions,
          'x-reactions': changeDisplayByUseTimeRange,
        },
      },
    },
  },
})

export default getSchema
