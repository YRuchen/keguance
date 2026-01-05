import { h } from 'vue'
import { ElText, ElTag, ElButton } from 'element-plus'
import { Space } from '~/KeepUp'
import {
  taskResultStatusOptions,
  TaskResultStatus,
  taskResultStatusMap,
  ResultStatus,
} from '~/api/availabilityMonitoring/constants'
import { execTimeFilterOptions, ExecTimeFilter } from './constants'

import type { IField } from '~/interfaces/commonPage'

const getFields = (openEditor): IField[] => {
  return [
    {
      prop: 'resultStatus',
      label: '执行结果',
      isColumn: true,
      columnConfig: {
        width: 90,
        render: ({ rowData }) =>
          h(
            ElTag,
            { type: rowData.resultStatus === ResultStatus.PASSED ? 'success' : 'danger' },
            taskResultStatusMap[rowData.resultStatus],
          ),
      },
      isFilter: true,
      filterConfig: {
        type: 'void',
        'x-component': 'FormGrid.GridColumn',
        'x-component-props': {
          gridSpan: 2,
        },
        properties: {
          resultStatus: {
            type: 'string',
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              label: '执行结果',
              style: {
                marginBottom: '0',
              },
            },
            'x-component': 'Select',
            enum: taskResultStatusOptions,
            default: TaskResultStatus.ALL,
          },
        },
      },
    },
    {
      prop: 'execTime',
      label: '执行时间',
      isColumn: true,
      columnConfig: {
        minWidth: 230,
      },
      isFilter: true,
      filterConfig: {
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
              label: '执行时间',
              style: {
                marginBottom: '0',
              },
            },
            'x-component': 'div',
            'x-component-props': {
              style: {
                display: 'flex',
              },
            },
            properties: {
              time: {
                type: 'string',
                'x-component': 'Radio.Group',
                'x-component-props': {
                  buttonStyle: 'solid',
                  optionType: 'button',
                  style: {
                    marginRight: '8px',
                  },
                },
                enum: execTimeFilterOptions,
                default: ExecTimeFilter.ALL,
              },
              '[fromTime,toTime]': {
                type: 'string',
                'x-component': 'DatePicker',
                'x-component-props': {
                  type: 'datetimerange',
                  format: 'YYYY-MM-DD HH:mm',
                  rangeSeparator: '至',
                  valueFormat: 'YYYY-MM-DD HH:mm',
                  startPlaceholder: '开始时间',
                  endPlaceholder: '结束时间',
                  style: {
                    width: '240px',
                  },
                },
              },
            },
          },
        },
      },
    },
    {
      prop: 'monitoringUrl',
      label: '域名/监测地址',
      isColumn: true,
      columnConfig: {
        minWidth: 130,
      },
    },
    {
      prop: 'monitoringNodeName',
      label: '监测节点',
      isColumn: true,
      columnConfig: {
        width: 130,
      },
      isFilter: true,
      filterConfig: {
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
              },
              isp: {
                type: 'string',
                'x-decorator': 'FormItem',
                'x-decorator-props': {
                  style: {
                    flex: 1,
                    marginBottom: '0',
                  },
                },
                'x-component': 'Select',
              },
            },
          },
        },
      },
    },
    {
      prop: 'duration',
      label: '总耗时',
      isColumn: true,
      columnConfig: {
        width: 90,
        render: ({ rowData }) => h(ElText, {}, `${rowData.duration}ms`),
      },
    },
    {
      prop: 'operation',
      label: '操作',
      isColumn: true,
      columnConfig: {
        width: 60,
        fixed: 'right',
        render({ rowData }) {
          return h(
            Space,
            {
              size: 0,
              justify: 'start',
            },
            [
              h(
                ElButton,
                {
                  type: 'primary',
                  link: true,
                  style: { padding: 0 },
                  onClick: (e: Event) => {
                    e.stopPropagation()
                    openEditor?.({ rowData })
                  },
                },
                '详情',
              ),
            ],
          )
        },
      },
    },
  ]
}

export default getFields
