import { h } from 'vue'
import { ElText, ElButton } from 'element-plus'
import Big from 'big.js'
import { Space } from '~/KeepUp'
import { searchTargetOptions } from './constants'

import type { Router } from 'vue-router'
import type { IField } from '~/interfaces/commonPage'

const commonAttrs = {
  link: true,
  style: { padding: 0 },
}
const getCommonField = (changeSearchTarget?: (target: 'TRACES' | 'SPANS') => void) => ({
  prop: 'searchTarget',
  label: '搜索对象',
  isFilter: true,
  filterConfig: {
    type: 'void',
    'x-component': 'FormGrid.GridColumn',
    'x-component-props': {
      gridSpan: 1,
    },
    properties: {
      void: {
        type: 'string',
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          label: '搜索对象',
          wrapperStyle: {
            display: 'flex',
            alignItems: 'center',
          },
        },
        'x-component': 'RadioGroup',
        'x-component-props': {
          style: {
            width: 'fit-content',
            margin: 0,
            padding: 0,
          },
          optionRenderType: 'BUTTON',
          onChange: changeSearchTarget,
        },
        default: 'TRACES',
        enum: searchTargetOptions,
      },
    },
  },
})
export const getTracesFields = (
  router: Router,
  changeSearchTarget?: (target: 'TRACES' | 'SPANS') => void,
): IField[] => [
  getCommonField(changeSearchTarget),
  {
    prop: 'traceID',
    label: 'Trace ID',
    isColumn: true,
    columnConfig: {
      minWidth: 300,
    },
    isFilter: true,
    filterConfig: {
      type: 'void',
      'x-component': 'FormGrid.GridColumn',
      'x-component-props': {
        gridSpan: 2,
      },
      properties: {
        traceID: {
          type: 'string',
          'x-decorator': 'FormItem',
          'x-decorator-props': {
            label: 'Trace ID',
          },
          'x-component': 'Input',
          'x-component-props': {
            placeholder: '请输入',
            clearable: true,
          },
        },
      },
    },
  },
  {
    prop: 'rootTraceName',
    label: 'Trace名称',
    isColumn: true,
    columnConfig: {
      minWidth: 200,
    },
  },
  {
    prop: 'startTimeUnixNano',
    label: '请求开始时间',
    isColumn: true,
    columnConfig: {
      width: 200,
      render: ({ rowData }) => {
        const date = new Date(Number(new Big(rowData.startTimeUnixNano).div(1_000_000)))
        return h(ElText, {}, date.toLocaleString())
      },
    },
  },
  /** TODO：后期是否需要 */
  // {
  // prop: 'clientIp',
  // label: '发起请求的IP',
  // isColumn: true,
  // columnConfig: {
  //   width: 160,
  // },
  // isFilter: true,
  // filterConfig: {
  //   type: 'void',
  //   'x-component': 'FormGrid.GridColumn',
  //   'x-component-props': {
  //     gridSpan: 2,
  //   },
  //   properties: {
  //     void: {
  //       type: 'string',
  //       'x-decorator': 'FormItem',
  //       'x-decorator-props': {
  //         label: '发起请求的IP',
  //       },
  //       'x-component': 'Input',
  //       'x-component-props': {
  //         placeholder: '请输入',
  //       },
  //     },
  //   },
  // },
  // },
  {
    prop: 'datePicker',
    label: '时间范围',
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
            label: '时间范围',
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
    prop: 'serviceStats',
    label: '总服务数',
    isColumn: true,
    columnConfig: {
      width: 90,
      render: ({ rowData }) => h(ElText, {}, Object.keys(rowData.serviceStats || {}).length),
    },
  },
  {
    prop: 'spanSet',
    label: '总spans',
    isColumn: true,
    columnConfig: {
      width: 90,
      render: ({ rowData }) => h(ElText, {}, rowData.spanSet?.spans?.length),
    },
  },
  {
    prop: 'spanSets',
    label: '链路总层级数',
    isColumn: true,
    columnConfig: {
      width: 120,
      render: ({ rowData }) => h(ElText, {}, rowData.spanSets?.length),
    },
  },
  {
    prop: 'durationMs',
    label: '执行总耗时',
    isColumn: true,
    columnConfig: {
      width: 120,
      render: ({ rowData }) => h(ElText, {}, `${rowData.durationMs || 0} ms`),
    },
  },
  {
    prop: 'operation',
    label: '操作',
    isColumn: true,
    columnConfig: {
      width: 56,
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
                ...commonAttrs,
                onClick: (e: Event) => {
                  e.stopPropagation()
                  router.push({ path: 'view', query: { id: rowData.traceID } })
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

export const getSpansFields = (
  router: Router,
  changeSearchTarget?: (target: 'TRACES' | 'SPANS') => void,
): IField[] => [
  getCommonField(changeSearchTarget),
  {
    prop: 'spanID',
    label: 'Span ID',
    isColumn: true,
    columnConfig: { minWidth: 180 },
    isFilter: true,
    filterConfig: {
      type: 'void',
      'x-component': 'FormGrid.GridColumn',
      'x-component-props': {
        gridSpan: 4,
      },
      properties: {
        spanID: {
          type: 'string',
          'x-decorator': 'FormItem',
          'x-decorator-props': {
            label: 'Span ID',
          },
          'x-component': 'Input',
          'x-component-props': {
            placeholder: '请输入',
            clearable: true,
          },
        },
      },
    },
  },
  {
    prop: 'spanName',
    label: 'Span名称',
    isColumn: true,
    columnConfig: { minWidth: 160 },
    // isFilter: true,
    // filterConfig: {
    //   type: 'string',
    //   'x-decorator': 'FormItem',
    //   'x-component': 'Input',
    //   'x-component-props': {
    //     placeholder: '请输入',
    //   },
    // },
  },
  {
    prop: 'startTimeUnixNano',
    label: 'Span开始时间',
    isColumn: true,
    columnConfig: {
      width: 200,
      render: ({ rowData }) => {
        const date = new Date(Number(new Big(rowData.startTimeUnixNano).div(1_000_000)))
        return h(ElText, {}, date.toLocaleString())
      },
    },
  },
  {
    prop: 'serviceName',
    label: '服务名',
    isColumn: true,
    columnConfig: { width: 160 },
    // isFilter: true,
    // filterConfig: {
    //   type: 'string',
    //   'x-decorator': 'FormItem',
    //   'x-component': 'Select',
    //   'x-component-props': {
    //     placeholder: '请选择',
    //   },
    //   // enum: statusOptions,
    // },
  },
  {
    prop: 'clientIp',
    label: '服务所属IP',
    isColumn: true,
    columnConfig: { width: 140 },
  },
  {
    prop: 'durationNanos',
    label: '执行耗时',
    isColumn: true,
    columnConfig: {
      width: 120,
      render: ({ rowData }) =>
        h(ElText, {}, `${Number(new Big(rowData.durationNanos || 0).div(1_000_000).round(4))} ms`),
    },
  },
  {
    prop: 'statusCode',
    label: '请求返回码',
    isColumn: true,
    columnConfig: { width: 120 },
    // isFilter: true,
    // filterConfig: {
    //   type: 'string',
    //   'x-decorator': 'FormItem',
    //   'x-component': 'Select',
    //   'x-component-props': {
    //     placeholder: '请选择',
    //     style: {
    //       flex: 1,
    //     }
    //   },
    //   // enum: statusOptions,
    // },
  },
  {
    prop: 'operation',
    label: '操作',
    isColumn: true,
    columnConfig: {
      width: 56,
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
                ...commonAttrs,
                onClick: (e: Event) => {
                  e.stopPropagation()
                  router.push({ path: 'view', query: { id: rowData.traceID } })
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
