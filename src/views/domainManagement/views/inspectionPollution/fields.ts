import { h, nextTick, ref } from 'vue'
import { ElButton, ElTag, ElMessage, ElMessageBox, ElText } from 'element-plus'
import {
  deleteApi,
  getUsersProjectApi,
  getDetailApi,
  editApi,
  enableApi,
  disabledApi,
} from '~/api/domainManagement/inspectionPollution'
import { CHAT_SCENE } from '~/api/domainManagement/ai/constants'
import { MODE } from '~/businessComponents/commonPage'
import { emitter, Space } from '~/KeepUp'
import BaseSvgIcon from '~/components/SvgIcon/index.vue'
import { hasPermission } from '~/utils/auth'
import AIChatDrawer from '~/views/ai/component/AIChatDrawer.vue'
import { telegramOptions } from './constants'
import { inspectStatusMap } from '../../common/constants'
import styles from './index.module.scss'

import type { IGetFieldsParams } from '../../../availabilityMonitoring/interface'
import type { Field, Form } from '@formily/core'
import type { IField } from '~/businessComponents/commonPage'
import useAiChat from '../../common/useAiChat'

const drawerRef = ref<any>(null)
const commonAttrs = {
  link: true,
}
const commonProps = {
  layout: 'vertical',
  colon: false,
}

export const getFields = ({
  router,
  commonPageRef,
  domainMasterData,
}: IGetFieldsParams): IField[] => [
  {
    prop: 'periodicTask',
    label: '',
    isColumn: true,
    // columnConfig: { minWidth: 150 },
    columnConfig: {
      width: 50,
      render: ({ rowData }) =>
        h('div', {}, [
          h(
            useAiChat,
            {
              ref: drawerRef,
            },
            {
              default: () =>
                h(BaseSvgIcon, {
                  class: styles.hoverIcon,
                  style: { fontSize: '24px', cursor: 'pointer' },
                  iconClass: 'ai_entrance',
                  hoverIconClass: 'ai_entrance_hover',
                  onClick: (e) => drawerRef.value?.open(e, rowData),
                }),
            },
          ),
        ]),
    },
  },
  {
    prop: 'inspectName',
    label: '任务名称',
    isColumn: true,
    columnConfig: {
      minWidth: 90,
    },
    isFilter: true,
    filterConfig: {
      type: 'void',
      properties: {
        domain: {
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          'x-decorator-props': {
            label: '搜索',
          },
          'x-component-props': {
            clearable: true,
            placeholder: '请输入监控对象',
          },
        },
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
    prop: 'domain',
    label: '监控对象',
    isColumn: true,
    columnConfig: {
      minWidth: 150,
    },
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
            label: '创建时间',
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
            },
            '[startDate,endDate]': {
              type: 'string',
              'x-component': 'DatePicker',
              'x-component-props': {
                clearable: true,
                type: 'daterange',
                format: 'YYYY-MM-DD',
                rangeSeparator: '至',
                valueFormat: 'YYYY-MM-DD',
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
    isEdit: true,
    editConfig: {
      type: 'string',
      required: true,
      'x-decorator': 'FormItem',
      'x-decorator-props': commonProps,
      'x-component': 'Input',
      'x-component-props': {
        placeholder: '请输入baidu.com的域名格式',
      },
      'x-reactions': async (field: Field) => {
        await nextTick()
        const isEdit = (field.form as Form & { data: Record<'isEdit', boolean> })?.data?.isEdit
        field.disabled = isEdit
      },
    },
  },
  {
    prop: 'taskStatus',
    label: '任务状态',
    isColumn: true,
    columnConfig: {
      width: 90,
      render: ({ rowData }) =>
        h(
          ElTag,
          { type: rowData.taskStatus ? 'success' : 'danger' },
          rowData.taskStatus ? '启用' : '禁用',
        ),
    },
  },
  {
    prop: 'inspectStatus',
    label: '监控状态',
    isColumn: true,
    columnConfig: {
      width: 90,
      render: ({ rowData }) =>
        h(
          ElTag,
          { type: inspectStatusMap[rowData.inspectStatus]?.type || 'info' },
          inspectStatusMap[rowData.inspectStatus]?.text || '-',
        ),
    },
  },
  // {
  //   prop: 'project',
  //   label: '归属项目',
  //   isEdit: true,
  //   editConfig: {
  //     type: 'string',
  //     'x-decorator': 'FormItem',
  //     'x-decorator-props': {
  //       label: '归属项目',
  //       ...commonProps,
  //     },
  //     'x-component': 'Select',
  //     'x-component-props': {
  //       placeholder: '请选择',
  //     },
  //     enum: [],
  //   },
  //   fetchConfig: {
  //     api: getUsersProjectApi,
  //     formatter: (res) => {
  //       const list = res.data.list.map((item) => ({
  //         label: item.name,
  //         value: item.id,
  //       }))
  //       return list
  //     },
  //   },
  // },
  {
    prop: 'frequencyId',
    label: '监测频率',
    isColumn: true,
    columnConfig: {
      width: 120,
      render: ({ rowData }) =>
        h(
          ElText,
          {},
          (domainMasterData?.masterData?.taskFrequencies?.pollutionFrequency || []).find(
            (v) => v.value === rowData.frequencyId,
          )?.label || '-',
        ),
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
      enum: domainMasterData?.masterData?.taskFrequencies?.pollutionFrequency,
    },
  },
  {
    prop: 'creatorName',
    label: '创建人',
    isColumn: true,
    columnConfig: {
      width: 120,
    },
    isEdit: true,
    editConfig: {
      type: 'void',
      properties: {
        noticeMode: {
          type: 'string',
          'x-decorator': 'FormItem',
          'x-decorator-props': {
            label: '通知渠道',
            style: {
              display: 'block',
            },
          },
          'x-component': 'Select',
          'x-component-props': {
            placeholder: '请选择',
            multiple: true,
            clearable: true,
          },
          enum: telegramOptions,
        },
      },
    },
  },
  {
    prop: 'createdAt',
    label: '创建时间',
    isColumn: true,
    columnConfig: {
      width: 170,
    },
    isEdit: true,
    editConfig: {
      type: 'void',
      properties: {
        chatId: {
          type: 'string',
          'x-decorator': 'FormItem',
          'x-decorator-props': {
            label: 'Chat ID',
            style: {
              display: 'block',
            },
          },
          'x-component': 'Select',
          'x-component-props': {
            placeholder: '请输入',
            clearable: true,
          },
          enum: domainMasterData?.masterData?.chatIdList,
        },
      },
    },
  },
  {
    prop: 'chatToken',
    label: 'Token',
    isEdit: true,
    editConfig: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        label: 'Token',
        style: {
          display: 'block',
        },
      },
      'x-component': 'Select',
      'x-component-props': {
        placeholder: '请输入',
        clearable: true,
      },
      enum: domainMasterData?.masterData?.tokenList,
    },
  },
  {
    prop: 'taskStatus',
    label: '任务状态',
    isEdit: true,
    editConfig: {
      type: 'string',
      required: true,
      default: true,
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        label: '任务状态',
        style: {
          display: 'block',
        },
      },
      'x-component': 'Switch',
      'x-component-props': {
        activeText: '启用',
        inactiveText: '禁用',
      },
    },
  },
  {
    prop: 'operation',
    label: '操作',
    isColumn: true,
    columnConfig: {
      width: 190,
      fixed: 'right',
      render({ rowData }) {
        const taskStatusName = rowData.taskStatus ? '禁用' : '启用'
        const isEnable = rowData?.taskStatus
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
                type: 'danger',
                ...commonAttrs,
                disabled: !hasPermission(['domain:delete']),
                onClick: async (e: Event) => {
                  try {
                    await ElMessageBox.confirm('确认删除当前任务?', {
                      confirmButtonText: '确认',
                      cancelButtonText: '取消',
                      type: 'warning',
                    })
                    await deleteApi(rowData.id)
                    ElMessage({
                      message: '删除成功',
                      type: 'success',
                    })
                    commonPageRef.value?.query()
                  } catch (error: any) {
                    console.error(`删除失败，失败原因：${error}`)
                  }
                },
              },
              '删除',
            ),
            h(
              ElButton,
              {
                type: 'primary',
                ...commonAttrs,
                disabled: !hasPermission(['domain:put']),
                onClick: async (e: Event) => {
                  e.stopPropagation()
                  const res = await getDetailApi(rowData)
                  emitter.emit('openEditor', { mode: MODE.EDIT, rowData: res, rowIndex: 0 })
                },
              },
              '编辑',
            ),
            h(
              ElButton,
              {
                type: 'primary',
                ...commonAttrs,
                onClick: async () => {
                  router.push({
                    name: 'InspectionPollutionDetail',
                    query: {
                      id: rowData.id,
                    },
                  })
                },
              },
              '详情',
            ),
            h(
              ElButton,
              {
                type: isEnable ? 'warning' : 'success',
                ...commonAttrs,
                disabled: !hasPermission(['domain:enable']),
                onClick: async () => {
                  try {
                    await ElMessageBox.confirm(
                      `确定要${taskStatusName}任务「${rowData.inspectName}」吗？`,
                      '确认',
                      {
                        confirmButtonText: '确认',
                        cancelButtonText: '取消',
                        type: 'warning',
                      },
                    )
                    isEnable
                      ? await disabledApi({ id: rowData.id })
                      : await enableApi({ id: rowData.id })
                    ElMessage({
                      message: `${taskStatusName}成功`,
                      type: 'success',
                    })
                    commonPageRef.value?.query()
                  } catch (error: any) {
                    console.error(`失败，失败原因：${error}`)
                  }
                },
              },
              taskStatusName,
            ),
          ],
        )
      },
    },
  },
]
