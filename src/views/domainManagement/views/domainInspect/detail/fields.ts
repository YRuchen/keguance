import { h, nextTick } from 'vue'
import { isEmpty } from 'lodash'
import { ElTag, ElButton } from 'element-plus'
import { DOMAIN_STATUS, domainStatusMap, domainStatusOptions } from '~/api/domainManagement/common'

import type { Ref } from 'vue'
import type { Form } from '@formily/core'
import type { IField, ICommonDrawerExpose, ICommonObj } from '~/KeepUp'

export const getFields = (
  commonDrawerRef: Ref<ICommonDrawerExpose>,
  formRef: Ref<Form>,
  activeRowData: Ref<ICommonObj>,
): IField[] => [
  {
    prop: 'domainExpiryStatus',
    label: '检测结果',
    isColumn: true,
    columnConfig: {
      width: 130,
      render: ({ rowData }) =>
        h(
          ElTag,
          { type: domainStatusMap[rowData.domainExpiryStatus]?.type },
          domainStatusMap[rowData.domainExpiryStatus]?.label || '-',
        ),
    },
    isFilter: true,
    filterConfig: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        placeholder: '请选择结果',
        clearable: true,
      },
      enum: domainStatusOptions,
      default: DOMAIN_STATUS.EXPIRY_STATUS_ALL,
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
    prop: 'createdAt',
    label: '检测时间',
    isColumn: true,
    columnConfig: {
      width: 200,
    },
  },
  // new field
  {
    prop: 'domain',
    label: '域名',
    isColumn: true,
    columnConfig: {
      width: 200,
    },
  },
  {
    prop: 'registrarName',
    label: '注册商',
    isColumn: true,
    columnConfig: {
      width: 200,
    },
  },
  {
    prop: 'createDate',
    label: '注册时间',
    isColumn: true,
    columnConfig: {
      width: 200,
    },
  },
  {
    prop: 'updateDate',
    label: '更新时间',
    isColumn: true,
    columnConfig: {
      width: 200,
    },
  },
  {
    prop: 'expiryDate',
    label: '过期时间',
    isColumn: true,
    columnConfig: {
      width: 200,
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
                domainExpiryStatus: rowData.domainExpiryStatus,
                expiryDate: rowData.expiryDate,
                domain: rowData.domain,
                registrarName: rowData.registrarName,
                createDate: rowData.createDate,
                updateDate: rowData.updateDate,
                dnsServer: rowData.dnsServer, // TODO: 列表中没有，从哪里拿
                domainStatus: rowData.domainStatus, // TODO: 列表中没有，从哪里拿
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
