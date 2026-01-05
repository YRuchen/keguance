import { h, nextTick } from 'vue'
import { isEmpty } from 'lodash'
import { ElTag, ElButton } from 'element-plus'
import { SSL_STATUS, sslStatusMap, sslStatusOptions } from '~/api/domainManagement/common'

import type { Ref } from 'vue'
import type { Form } from '@formily/core'
import type { IField, ICommonDrawerExpose, ICommonObj } from '~/KeepUp'

export const getFields = (
  commonDrawerRef: Ref<ICommonDrawerExpose>,
  formRef: Ref<Form>,
  activeRowData: Ref<ICommonObj>,
): IField[] => [
  {
    prop: 'status',
    label: '检测结果',
    isColumn: true,
    columnConfig: {
      width: 130,
      render: ({ rowData }) =>
        h(
          ElTag,
          { type: sslStatusMap[rowData.status]?.type },
          sslStatusMap[rowData.status]?.label || '-',
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
      enum: sslStatusOptions,
      default: SSL_STATUS.EXPIRY_STATUS_ALL,
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
  // new Fields
  {
    prop: 'leftDays',
    label: '剩余时间（天）',
    isColumn: true,
    columnConfig: {
      width: 200,
    },
  },
  // new Fields
  {
    prop: 'domain',
    label: '域名',
    isColumn: true,
    columnConfig: {
      width: 200,
    },
  },
  // new Fields
  {
    prop: 'cn',
    label: '公用名（CN）',
    isColumn: true,
    columnConfig: {
      width: 200,
    },
  },
  // new Fields
  {
    prop: 'effectiveDate',
    label: '证书生效时间',
    isColumn: true,
    columnConfig: {
      width: 200,
    },
  },
  {
    prop: 'expiryDate',
    label: '证书过期时间',
    isColumn: true,
    columnConfig: {
      minWidth: 160,
    },
  } as any,
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
                status: rowData.status,
                /** 剩余时间 */
                remainingTime: rowData.leftDays,
                /** 公用名 */
                commonName: rowData.cn,
                /** 证书签发机构 */
                issuer: rowData.issuer.ou,
                /** 组织（O） */
                organization: rowData.issuer.o,
                /** 证书生效时间 */
                validFrom: rowData.effectiveDate,
                /** 证书过期时间 */
                validTo: rowData.expiryDate,
                /** 证书类型 */
                certificateType: rowData.type,
                /** 证书 */
                cert: rowData.finger.fingerprint,
                /** 公钥 */
                publicKey: rowData.finger.fingerprint256,
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
