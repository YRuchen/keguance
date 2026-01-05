import { ElMessage } from 'element-plus'
import { Refresh } from '@element-plus/icons-vue'
import { getDomainListApi } from '~/api/availabilityMonitoring/overview'
import { Protocol } from '~/api/availabilityMonitoring/constants'
import { protocolOptions } from '../detail/constants'
import { TimeType, timeTypeOptions, RefreshRate, refreshRateOptions } from './constants'
import { getColumns, getColumns2 } from './columns'

import type { Ref } from 'vue'
import type { Field } from '@formily/core'
import type { ISchema } from '@formily/json-schema'
import type { ICommonGetListRes, ICommonTableExpose, IOptionItem } from '~/KeepUp'

const commonStyle = {
  width: '150px',
  flexShrink: '0',
}
export const getSchema = (refresh: () => Promise<void>, columns: Ref<any>): ISchema => {
  return {
    type: 'object',
    properties: {
      verticalSpace: {
        type: 'void',
        'x-component': 'KeepUpSpace',
        'x-component-props': {
          fill: true,
          style: {
            padding: '0 16px',
            boxSizing: 'border-box',
          },
          direction: 'column',
          align: 'flex-start',
          size: 8,
        },
        properties: {
          filterGroup: {
            type: 'void',
            'x-component': 'KeepUpSpace',
            'x-component-props': {
              fill: true,
              align: 'flex-start',
            },
            properties: {
              subType: {
                type: 'string',
                'x-decorator': 'FormItem',
                'x-decorator-props': {
                  label: '请求类型',
                  labelWidth: 'fit-content',
                },
                'x-component': 'Select',
                'x-component-props': {
                  style: commonStyle,
                  placeholder: '请选择',
                },
                enum: protocolOptions,
                default: Protocol.HTTP,
              },
              domain: {
                type: 'string',
                'x-decorator': 'FormItem',
                'x-decorator-props': {
                  label: '域名/地址',
                  style: {
                    flex: 1,
                  },
                },
                'x-component': 'Select',
                'x-component-props': {
                  style: {
                    flex: 1,
                  },
                  filterable: true,
                  clearable: true,
                },
              },
              testId: {
                type: 'string',
                'x-decorator': 'FormItem',
                'x-decorator-props': {
                  label: '任务名称',
                },
                'x-component': 'Select',
                'x-component-props': {
                  style: {
                    ...commonStyle,
                    width: '267px',
                  },
                  filterable: true,
                  clearable: true,
                },
              },
            },
          },
          filterGroup2: {
            type: 'void',
            'x-component': 'KeepUpSpace',
            'x-component-props': {
              fill: true,
              align: 'center',
              style: {
                flex: 1,
              },
            },
            properties: {
              time: {
                type: 'string',
                'x-decorator': 'FormItem',
                'x-decorator-props': {
                  label: '时间',
                  wrapperStyle: {
                    display: 'flex',
                    alignItems: 'center',
                  },
                },
                'x-component': 'RadioGroup',
                'x-component-props': {
                  optionRenderType: 'BUTTON',
                },
                enum: timeTypeOptions,
                default: TimeType.LATEST,
                'x-reactions': (field: Field) => {
                  const isLatest = field.value === TimeType.LATEST
                  columns.value = isLatest ? getColumns() : getColumns2()
                },
              },
              '[fromTime,toTime]': {
                type: 'array',
                'x-component': 'DatePicker',
                'x-component-props': {
                  type: 'datetimerange',
                  format: 'YYYY-MM-DD HH:mm',
                  rangeSeparator: '至',
                  valueFormat: 'YYYY-MM-DD HH:mm',
                  startPlaceholder: '开始时间',
                  endPlaceholder: '结束时间',
                  style: {
                    flex: 1,
                  },
                },
              },
              refreshRate: {
                type: 'string',
                'x-decorator': 'FormItem',
                'x-decorator-props': {
                  label: '自动刷新频率',
                },
                'x-component': 'Select',
                'x-component-props': {
                  style: commonStyle,
                  filterable: true,
                  clearable: true,
                },
                enum: refreshRateOptions,
                default: RefreshRate.SECOND_30,
              },
              queryBtn: {
                type: 'void',
                'x-component': 'ElButton',
                'x-component-props': {
                  type: 'primary',
                  icon: Refresh,
                  onClick: refresh,
                },
                'x-content': '刷新',
              },
            },
          },
        },
      },
    },
  }
}

export const getTableSchema = (commonTableRef: Ref<ICommonTableExpose>): ISchema => ({
  type: 'object',
  properties: {
    gridBox: {
      type: 'void',
      'x-component': 'FormGrid.GridColumn',
      'x-component-props': {
        gridSpan: 4,
      },
      properties: {
        void: {
          type: 'void',
          'x-decorator': 'FormItem',
          'x-decorator-props': {
            label: '监测节点',
            style: {
              marginBottom: '0',
            },
          },
          'x-component': 'div',
          'x-component-props': {
            style: {
              display: 'flex',
              gap: '8px',
            },
          },
          properties: {
            node: {
              type: 'string',
              'x-decorator': 'FormItem',
              'x-decorator-props': {
                style: {
                  marginBottom: '0',
                },
              },
              'x-component': 'Cascader',
              'x-component-props': {
                clearable: true,
                async onChange() {
                  try {
                    await commonTableRef.value?.getList()
                    ElMessage.success('筛选成功')
                  } catch (error: any) {
                    console.error(`筛选失败，失败原因：${error}`)
                  }
                },
              },
            },
            isp: {
              type: 'string',
              'x-decorator': 'FormItem',
              'x-decorator-props': {
                style: {
                  width: '150px',
                  marginBottom: '0',
                },
              },
              'x-component': 'Select',
              'x-component-props': {
                clearable: true,
                async onChange() {
                  try {
                    await commonTableRef.value?.getList()
                    ElMessage.success('筛选成功')
                  } catch (error: any) {
                    console.error(`筛选失败，失败原因：${error}`)
                  }
                },
              },
            },
          },
        },
      },
    },
  },
})
