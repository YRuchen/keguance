import { h } from 'vue'
import { ElTag, ElButton } from 'element-plus'
import { Space } from '~/KeepUp'
import { MICRO_APP_ROUTE } from '~/constants/qiankun'
import { execTimeFilterOptions, ExecTimeFilter } from '../taskHistory/constants'
import { Tabs } from '../overviewPage/constants'
import { subTypeOptions, AlertPriority } from './constants'

import type { IField } from '~/KeepUp'

export const getFields = (openEditor): IField[] => [
  {
    prop: 'keyword',
    label: '搜索关键字',
    isFilter: true,
    filterConfig: {
      type: 'string',
      'x-decorator': 'FormGrid.GridColumn',
      'x-decorator-props': {
        gridSpan: 3,
      },
      'x-component': 'Input',
      'x-component-props': {
        clearable: true,
        placeholder: '请输入任务名称或者域名/地址进行搜索',
      },
    },
  },
  {
    prop: 'alertTime',
    label: '告警时间',
    isColumn: true,
    columnConfig: { width: 180 },
    isFilter: true,
    filterConfig: {
      type: 'void',
      'x-component': 'FormGrid.GridColumn',
      'x-component-props': {
        gridSpan: 3,
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
              default: ExecTimeFilter.TODAY,
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
    label: '域名/地址',
    isColumn: true,
    columnConfig: { minWidth: 150 },
  },
  {
    prop: 'taskName',
    label: '任务名称',
    isColumn: true,
    columnConfig: { minWidth: 150 },
  },
  {
    prop: 'subType',
    label: '请求类型',
    isColumn: true,
    columnConfig: { width: 120 },
    isFilter: true,
    filterConfig: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        clearable: true,
        placeholder: '请选择',
      },
      enum: subTypeOptions,
    },
  },
  {
    prop: 'monitoringNodeName',
    label: '监测节点',
    isColumn: true,
    columnConfig: { width: 150 },
    isFilter: true,
    filterConfig: {
      type: 'void',
      'x-component': 'FormGrid.GridColumn',
      'x-component-props': {
        gridSpan: 2,
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
              },
            },
            probeIspName: {
              type: 'string',
              'x-decorator': 'FormItem',
              'x-decorator-props': {
                style: {
                  flex: 1,
                  marginBottom: '0',
                },
              },
              'x-component': 'Select',
              'x-component-props': {
                clearable: true,
              },
            },
          },
        },
      },
    },
  },
  {
    prop: 'alertReason',
    label: '告警原因',
    isColumn: true,
    columnConfig: { minWidth: 200 },
  },
  {
    prop: 'alertPriority',
    label: '告警优先级',
    isColumn: true,
    columnConfig: {
      width: 120,
      render: ({ rowData }) =>
        h(
          ElTag,
          { type: AlertPriority[rowData.alertPriority]?.type },
          AlertPriority[rowData.alertPriority]?.text,
        ),
    },
  },
  {
    prop: 'notifyUser',
    label: '通知人',
    isColumn: true,
    columnConfig: { width: 150 },
  },
  {
    prop: 'notifyResult',
    label: '通知结果',
    isColumn: true,
    columnConfig: {
      width: 120,
      render: ({ rowData }) =>
        h(
          ElTag,
          { type: rowData.notifyResult ? 'success' : 'danger' },
          rowData.notifyResult ? '成功' : '失败',
        ),
    },
  },
  {
    prop: 'notifyTime',
    label: '通知时间',
    isColumn: true,
    columnConfig: { width: 180 },
  },
  {
    prop: 'notifyChannel',
    label: '通知方式',
    isColumn: true,
    columnConfig: { width: 120 },
  },
  {
    prop: 'operation',
    label: '操作',
    isColumn: true,
    columnConfig: {
      width: 160,
      fixed: 'right',
      render({ rowData }) {
        return h(Space, { size: 0 }, [
          h(
            ElButton,
            {
              link: true,
              type: 'primary',
              style: { padding: 0 },
              onClick: (e: Event) => {
                e.stopPropagation()
                window.open(
                  `/${MICRO_APP_ROUTE}/availabilityMonitoring/overviewPage?testId=${rowData?.testId}&requestType=${rowData?.subType}&activeKey=${Tabs.TaskHistory}`,
                  '_blank',
                )
              },
            },
            '查看全量实例',
          ),
          h(
            ElButton,
            {
              link: true,
              type: 'primary',
              style: { padding: 0 },
              onClick: () => {
                openEditor?.({ rowData })
              },
            },
            '详情',
          ),
        ])
      },
    },
  },
]
