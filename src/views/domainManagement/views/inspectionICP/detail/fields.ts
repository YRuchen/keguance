import { h, nextTick } from 'vue'
import { isEmpty } from 'lodash'
import { ElTag, ElButton } from 'element-plus'
import { ICPStatus, icpStatusOptions, icpStatusMap } from '~/api/domainManagement/common'

import type { Ref } from 'vue'
import type { Form } from '@formily/core'
import type { IField, ICommonDrawerExpose, ICommonObj } from '~/KeepUp'

export const getHistoryFields = (
  commonDrawerRef: Ref<ICommonDrawerExpose>,
  formRef: Ref<Form>,
  activeRowData: Ref<ICommonObj>,
): IField[] => [
  {
    prop: 'status',
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
      enum: icpStatusOptions,
      default: ICPStatus.ICP_STATUS_ALL,
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
    prop: 'status',
    label: '检测结果',
    isColumn: true,
    columnConfig: {
      width: 120,
      render: ({ rowData }) =>
        h(
          ElTag,
          { type: icpStatusMap[rowData.status]?.type },
          icpStatusMap[rowData.status]?.label || '-',
        ),
    },
  },
  {
    prop: 'createdAt',
    label: '检测时间',
    isColumn: true,
    columnConfig: {
      width: 180,
    },
  },
  // TODO: new field
  {
    prop: 'domain',
    label: '域名',
    isColumn: true,
    columnConfig: {
      width: 180,
    },
  },
  // TODO: new field
  {
    prop: 'organizerName',
    label: '主办单位名称',
    isColumn: true,
    columnConfig: {
      minWidth: 180,
    },
  },
  // TODO: new field
  {
    prop: 'subjectType',
    label: '主体类型',
    isColumn: true,
    columnConfig: {
      width: 180,
    },
  },
  // TODO: new field
  {
    prop: 'websiteLicense',
    label: '网站备案/许可证',
    isColumn: true,
    columnConfig: {
      width: 180,
    },
  },
  // TODO: new field
  {
    prop: 'checkTime',
    label: '审核时间',
    isColumn: true,
    columnConfig: {
      width: 180,
    },
  },
  {
    prop: 'operation',
    label: '操作',
    isColumn: true,
    columnConfig: {
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
                domain: rowData.domain,
                status: rowData.status,
                websiteName: rowData.websiteName,
                organizerName: rowData.organizerName,
                subjectType: rowData.subjectType,
                websiteLicense: rowData.websiteLicense,
                checkTime: rowData.checkTime,
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
  },
]
