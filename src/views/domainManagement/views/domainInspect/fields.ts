import { h, nextTick, ref } from 'vue'
import { cloneDeep } from 'lodash'
import { ElButton, ElMessage, ElMessageBox, ElTag, ElText } from 'element-plus'
import { deleteApi, enableApi, disabledApi } from '~/api/domainManagement/domainInspect'
import { CHAT_SCENE } from '~/api/domainManagement/ai/constants'
import BaseSvgIcon from '~/components/SvgIcon/index.vue'
import AIChatDrawer from '~/views/ai/component/AIChatDrawer.vue'
import { getProjectsApi } from '~/api/domainManagement/sslInspect'
import { MODE } from '~/businessComponents/commonPage'
import { emitter, Space } from '~/KeepUp'
import { hasPermission } from '~/utils/auth'
import { inspectStatusMap, noticeChannelOptions, NoticeChannel } from '../../common/constants'
import styles from './index.module.scss'

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
export const getFields = ({ router, commonPageRef, domainMasterData }): IField[] => [
  {
    prop: 'periodicTask',
    label: '',
    isColumn: true,
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
    label: '名称',
    isColumn: true,
    columnConfig: { minWidth: 150 },
    isEdit: true,
    editConfig: {
      type: 'string',
      required: true,
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        ...commonProps,
        label: '任务名称',
      },
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
    columnConfig: { minWidth: 150 },
    isFilter: true,
    filterConfig: {
      type: 'void',
      'x-component': 'FormGrid.GridColumn',
      'x-component-props': {
        gridSpan: 2,
      },
      properties: {
        domain: {
          type: 'string',
          'x-decorator': 'FormItem',
          'x-decorator-props': {
            label: '监控对象',
            style: {
              marginBottom: '0',
            },
          },
          'x-component': 'Input',
          'x-component-props': {
            placeholder: '请输入baidu.com的域名格式',
            clearable: true,
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
  // {
  //   prop: 'project',
  //   label: '归属项目',
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
  //   }
  // },
  {
    prop: 'execTime',
    label: '创建时间',
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
            '[startDate,endDate]': {
              type: 'string',
              'x-component': 'DatePicker',
              'x-component-props': {
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
  },
  {
    prop: 'taskStatus',
    label: '任务状态',
    isColumn: true,
    columnConfig: {
      width: 120,
      render: ({ rowData }) =>
        h(
          ElTag,
          { type: rowData.taskStatus ? 'success' : 'danger' },
          rowData.taskStatus ? '启用' : '禁用',
        ),
    },
    isEdit: true,
    editConfig: {
      type: 'string',
      required: true,
      'x-decorator': 'FormItem',
      'x-decorator-props': commonProps,
      'x-component': 'Switch',
      'x-component-props': {
        placeholder: '请选择',
        activeText: '启用',
        inactiveText: '禁用',
      },
      default: false,
    },
  },
  {
    prop: 'inspectStatus',
    label: '监控状态',
    isColumn: true,
    columnConfig: {
      width: 120,
      render: ({ rowData }) =>
        h(
          ElTag,
          { type: inspectStatusMap[rowData.inspectStatus]?.type || 'info' },
          inspectStatusMap[rowData.inspectStatus]?.text || '-',
        ),
    },
  },
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
          (domainMasterData?.masterData?.taskFrequencies?.domainFrequency || []).find(
            (v) => v.value === rowData.frequencyId,
          )?.label || '-',
        ),
    },
    isEdit: true,
    editConfig: {
      type: 'string',
      required: true,
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        ...commonProps,
        label: '监测频率',
      },
      'x-component': 'Select',
      'x-component-props': {
        placeholder: '请选择',
        clearable: true,
      },
      enum: domainMasterData?.masterData?.taskFrequencies?.domainFrequency,
    },
  },
  {
    prop: 'noticeMode',
    label: '通知渠道',
    isEdit: true,
    editConfig: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-decorator-props': commonProps,
      'x-component': 'Select',
      'x-component-props': {
        placeholder: '请选择',
        disabled: true,
        multiple: true,
        clearable: true,
      },
      default: [NoticeChannel.TELEGRAM],
      enum: noticeChannelOptions,
    },
  },
  {
    prop: 'chatId',
    label: 'Chat ID',
    isEdit: true,
    editConfig: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-decorator-props': commonProps,
      'x-component': 'Select',
      'x-component-props': {
        clearable: true,
        placeholder: '请输入',
      },
      enum: domainMasterData?.masterData?.chatIdList,
    },
  },
  {
    prop: 'chatToken',
    label: 'Token',
    isEdit: true,
    editConfig: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-decorator-props': commonProps,
      'x-component': 'Select',
      'x-component-props': {
        clearable: true,
        placeholder: '请输入',
      },
      enum: domainMasterData?.masterData?.tokenList,
    },
  },
  {
    prop: 'creatorName',
    label: '创建人',
    isColumn: true,
    columnConfig: { width: 120 },
  },
  {
    prop: 'createdAt',
    label: '创建时间',
    isColumn: true,
    columnConfig: { width: 170 },
  },
  {
    prop: 'operation',
    label: '操作',
    isColumn: true,
    columnConfig: {
      width: 190,
      fixed: 'right',
      render({ rowData }) {
        const isEnable = rowData?.taskStatus
        const commonActions = {
          enable: {
            api: enableApi,
            text: '启用',
          },
          disable: {
            api: disabledApi,
            text: '禁用',
          },
        }
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
                    e.stopPropagation()
                    await ElMessageBox.confirm('确认删除当前任务?', {
                      confirmButtonText: '确认',
                      cancelButtonText: '取消',
                      type: 'warning',
                    })
                    await deleteApi({ id: rowData.id })
                    ElMessage({
                      message: `删除成功`,
                      type: 'success',
                    })
                    commonPageRef?.value?.query()
                  } catch (error: any) {
                    console.log(`取消刪除`)
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
                onClick: (e: Event) => {
                  e.stopPropagation()
                  emitter.emit('openEditor', {
                    mode: MODE.EDIT,
                    rowData: cloneDeep(rowData),
                    rowIndex: 0,
                  })
                },
              },
              '编辑',
            ),
            h(
              ElButton,
              {
                type: 'primary',
                ...commonAttrs,
                onClick: (e: Event) => {
                  e.stopPropagation()
                  router.push({ name: 'DomainDetail', query: { id: rowData.id } })
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
                onClick: async (e: Event) => {
                  try {
                    const text = isEnable ? commonActions.disable.text : commonActions.enable.text
                    e.stopPropagation()
                    await ElMessageBox.confirm(`确认${text}当前任务?`, {
                      confirmButtonText: '确认',
                      cancelButtonText: '取消',
                      type: 'warning',
                    })
                    isEnable
                      ? await commonActions.disable.api({ id: rowData.id })
                      : await commonActions.enable.api({ id: rowData.id })
                    ElMessage({
                      message: `${text}成功`,
                      type: 'success',
                    })
                    commonPageRef?.value?.query()
                  } catch (error: any) {
                    console.log(`取消操作`)
                  }
                },
              },
              isEnable ? commonActions.disable.text : commonActions.enable.text,
            ),
          ],
        )
      },
    },
  },
]
