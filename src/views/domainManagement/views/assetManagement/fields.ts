import { h } from 'vue'
import { ElButton, ElText, ElTag, ElMessage, ElMessageBox } from 'element-plus'
import { deleteApi } from '~/api/domainManagement/assetManagement'
import { getProjectsApi } from '~/api/domainManagement/sslInspect'
import Space from '~/basicComponents/space'
import { CommonJsonPretty } from '~/businessComponents/commonJsonPretty'
import { MODE } from '~/businessComponents/commonPage'
import emitter from '~/utils/emitter'
import { isActiveOptions, statusOptions, statusMap, domainTypeOptions } from './constants'

import type { IField } from '~/businessComponents/commonPage'
import { hasPermission } from '~/utils/auth'

const commonAttrs = {
  link: true,
}
const commonProps = {
  layout: 'vertical',
  colon: false,
}
export const getFields = ({ router, commonPageRef }): IField[] => ([
  {
    prop: 'sourceStation',
    label: '源地址',
    isColumn: true,
    columnConfig: {
      width: 150,
    },
    isEdit: true,
    editConfig: {
      type: 'string',
      required: true,
      'x-decorator': 'FormItem',
      'x-decorator-props': commonProps,
      'x-component': 'Input',
      'x-component-props': {
        placeholder: '请输入',
      },
    },
  },
  {
    prop: 'domain',
    label: '域名',
    isColumn: true,
    columnConfig: {
      minWidth: 150,
    },
    isFilter: true,
    filterConfig: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        placeholder: '请输入',
      },
    },
    isEdit: true,
    editConfig: {
      type: 'string',
      required: true,
      'x-decorator': 'FormItem',
      'x-decorator-props': commonProps,
      'x-component': 'Input',
      'x-component-props': {
        placeholder: '请输入',
      },
    },
  },
  {
    prop: 'domainType',
    label: '域名类型',
    isColumn: true,
    columnConfig: {
      width: 90,
      render: ({ rowData }) => h(ElText, {}, domainTypeOptions.find(v => v.value === rowData.domainType)?.label),
    },
    isFilter: true,
    filterConfig: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        placeholder: '请选择',
      },
      enum: domainTypeOptions,
    },
    isEdit: true,
    editConfig: {
      type: 'string',
      required: true,
      'x-decorator': 'FormItem',
      'x-decorator-props': commonProps,
      'x-component': 'Select',
      'x-component-props': {
        placeholder: '请选择',
      },
      enum: domainTypeOptions,
    },
  },
  {
    prop: 'backupDomain',
    label: '备用域名',
    isColumn: true,
    columnConfig: {
      width: 150,
    },
    isEdit: true,
    editConfig: {
      type: 'string',
      required: true,
      'x-decorator': 'FormItem',
      'x-decorator-props': commonProps,
      'x-component': 'Input',
      'x-component-props': {
        placeholder: '请输入',
      },
    },
  },
  // {
  //   prop: 'project',
  //   label: '归属项目',
  //   isColumn: true,
  //   columnConfig: {
  //     width: 150,
  //   },
  //   isEdit: true,
  //   editConfig: {
  //     type: 'string',
  //     required: true,
  //     'x-decorator': 'FormItem',
  //     'x-decorator-props': commonProps,
  //     'x-component': 'Select',
  //     'x-component-props': {
  //       placeholder: '请选择',
  //       clearable: true,
  //     },
  //   },
  //   fetchConfig: {
  //     api: getProjectsApi,
  //     formatter: (res) => (res?.data?.list || []).map((v: Record<string, string>) => ({
  //       label: v.name,
  //       value: v.id,
  //     })),
  //   },
  // },
  {
    prop: 'service',
    label: '使用服务',
    isColumn: true,
    columnConfig: {
      width: 120,
    },
    isEdit: true,
    editConfig: {
      type: 'string',
      required: true,
      'x-decorator': 'FormItem',
      'x-decorator-props': commonProps,
      'x-component': 'Input',
      'x-component-props': {
        placeholder: '请输入',
      },
    },
  },
  {
    prop: 'status',
    label: '状态',
    isColumn: true,
    columnConfig: {
      width: 90,
      // render: ({ rowData }) => h(ElTag, { type: statusMap[rowData.status]?.type }, statusMap[rowData.status]?.label),
    },
    isFilter: true,
    filterConfig: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        placeholder: '请选择',
      },
      enum: statusOptions,
    },
  },
  {
    prop: 'domainExpiryDate',
    label: '域名到期时间',
    isColumn: true,
    columnConfig: {
      width: 170,
    },
  },
  {
    prop: 'sslExpiryDate',
    label: '证书到期时间',
    isColumn: true,
    columnConfig: {
      width: 170,
    },
  },
  {
    prop: 'isActive',
    label: '使用中',
    isColumn: true,
    columnConfig: {
      width: 80,
      render: ({ rowData }) => h(ElTag, { type: rowData.isActive ? 'primary' : 'danger' }, rowData.isActive ? '是' : '否'),
    },
    isFilter: true,
    filterConfig: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        placeholder: '请选择',
      },
      enum: isActiveOptions,
    },
    isEdit: true,
    editConfig: {
      type: 'boolean',
      required: true,
      'x-decorator': 'FormItem',
      'x-decorator-props': commonProps,
      'x-component': 'RadioGroup',
      'x-component-props': {
        placeholder: '请输入',
      },
      enum: isActiveOptions,
      default: false,
    },
  },
  {
    prop: 'cdnInfo',
    label: 'CDN接入商',
    isColumn: true,
    columnConfig: {
      width: 340,
      render: ({ rowData }) => h(
        CommonJsonPretty,
        {
          data: rowData.cdnInfo,
          editable: false,
          showIcon: true,
        },
      ),
    },
  },
  {
    prop: 'responsiblePerson',
    label: '责任人',
    isColumn: true,
    columnConfig: {
      width: 100,
    },
    isEdit: true,
    editConfig: {
      type: 'string',
      required: true,
      'x-decorator': 'FormItem',
      'x-decorator-props': commonProps,
      'x-component': 'Input',
      'x-component-props': {
        placeholder: '请输入',
      },
    },
  },
  {
    prop: 'operation',
    label: '操作',
    isColumn: true,
    columnConfig: {
      width: 150,
      fixed: 'right',
      render({ rowData }) {
        return h(Space, {
          size: 0,
          justify: 'start',
        }, [
          h(ElButton, {
            type: 'primary',
            ...commonAttrs,
            disabled: !hasPermission(['domain:delete']),
            onClick: async (e: Event) => {
              try {
                await ElMessageBox.confirm(
                  '删除后无法恢复，确认删除吗?',
                  '确认',
                  {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning',
                  }
                )
                await deleteApi({ id: rowData.id })
                ElMessage({
                  message: '删除成功',
                  type: 'success',
                })
                commonPageRef.value?.query()
              } catch (error: any) {
                console.error(`删除失败，失败原因：${error}`)
              }
            }
          }, '删除'),
          h(ElButton, {
            type: 'primary',
            ...commonAttrs,
            disabled: !hasPermission(['domain:put']),
            onClick: (e: Event) => {
              e.stopPropagation()
              emitter.emit('openEditor', { mode: MODE.EDIT, rowData, rowIndex: 0 })
            }
          }, '编辑'),
          h(ElButton, {
            type: 'primary',
            ...commonAttrs,
            onClick: async () => {
              router.push({ path: 'detail', query: { id: rowData.id } })
            }
          }, '详情')
        ])
      }
    }
  },
])
