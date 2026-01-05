import { h, nextTick } from 'vue'
import { isEmpty } from 'lodash'
import { ElText, ElTag, ElButton } from 'element-plus'
import { getHistoryNodeListApi } from '~/api/domainManagement/inspectionPollution'
import {
  PolluteStatus,
  polluteStatusMap,
  polluteStatusOptions,
} from '~/api/domainManagement/common'
import { Isp, ispOptions } from '../../../common/constants'

import type { Ref } from 'vue'
import type { Column } from 'element-plus'
import type { Form } from '@formily/core'
import type { IField, ICommonDrawerExpose, ICommonObj } from '~/KeepUp'

export const getFields = (): IField[] => [
  {
    prop: 'index',
    label: '序号',
    isColumn: true,
    columnConfig: { width: 55 },
  },
  // startTime和endTime，结果是status，里面有NORMAL和ABNORMAL（正常
  {
    prop: 'polluteStatus',
    label: '检测结果',
    isFilter: true,
    filterConfig: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        placeholder: '请选择结果',
        clearable: true,
      },
      enum: polluteStatusOptions,
      default: PolluteStatus.POLLUTE_STATUS_ALL,
    },
  },
  {
    prop: 'voidTime',
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
            '[startTime,endTime]': {
              type: 'string',
              'x-component': 'DatePicker',
              'x-component-props': {
                type: 'datetimerange',
                format: 'YYYY-MM-DD HH:mm:ss',
                rangeSeparator: '至',
                valueFormat: 'YYYY-MM-DD HH:mm:ss',
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
    prop: 'nodeName',
    label: '监控节点',
    isColumn: true,
    columnConfig: {
      minWidth: 100,
      render: ({ rowData }) => h(ElText, {}, rowData.nodeName || '-'),
    },
    isFilter: true,
    filterConfig: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        placeholder: '请输入监控节点',
      },
    },
  },
  {
    prop: 'region',
    label: '地区',
    isColumn: true,
    columnConfig: { width: 100 },
    isFilter: true,
    filterConfig: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        placeholder: '请选择地区',
        emptyValues: [undefined],
        clearable: true,
      },
    },
    fetchConfig: {
      api: getHistoryNodeListApi,
      formatter: (res) =>
        ['', ...new Set(res.list.map((v) => v.region))].map((v) => ({
          label: v || '全部',
          value: v,
        })),
    },
  },
  {
    prop: 'isp',
    label: '运营商',
    isColumn: true,
    columnConfig: { minWidth: 100 },
    isFilter: true,
    filterConfig: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        placeholder: '请选择运营商',
        emptyValues: [undefined],
        clearable: true,
      },
      enum: ispOptions,
      default: Isp.全部,
    },
  },
]

export const getHistoryFields = (
  commonDrawerRef: Ref<ICommonDrawerExpose>,
  formRef: Ref<Form>,
  activeRowData: Ref<ICommonObj>,
): Column[] => [
  {
    prop: 'polluteStatus',
    label: '检测结果',
    width: 130,
    render: ({ rowData }) =>
      h(
        ElTag,
        { type: polluteStatusMap[rowData.status]?.type },
        polluteStatusMap[rowData.status]?.label || '-',
      ),
  },
  {
    prop: 'createdAt',
    label: '检测时间',
    width: 200,
  },
  {
    prop: 'nodeName',
    label: '监控节点',
    width: 200,
  },
  {
    prop: 'ip',
    label: '解析IP',
    width: 200,
  },
  {
    prop: 'ipLocation',
    label: 'IP所在地',
    width: 200,
  },
  {
    prop: 'operation',
    label: '操作',
    width: 60,
    fixed: 'right' as any,
    render({ rowData }) {
      return h(
        ElButton,
        {
          type: 'primary',
          link: true,
          onClick: async (e: Event) => {
            e.stopPropagation()
            commonDrawerRef.value?.open()
            activeRowData.value = rowData
            await nextTick()
            formRef.value.readPretty = true
            formRef.value.values = {
              status: rowData.polluteStatus,
              ip: rowData.ip,
              ipLocation: rowData.ipLocation,
              result: rowData.result,
            }
            const resultField = formRef.value.query('result')?.take()
            resultField.setComponentProps({
              ...(resultField.componentProps || {}),
              data: isEmpty(rowData.result) ? '暂无数据' : rowData.result,
            })
          },
        },
        '详情',
      )
    },
  },
]
