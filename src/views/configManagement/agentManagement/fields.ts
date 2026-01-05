import { h } from 'vue'
import { ElButton, ElTag } from 'element-plus'
import Space from '~/basicComponents/space'
import { getAgentStatusLabels } from '~/api/configManagement/agentManagement'

import type { IField } from '~/businessComponents/commonPage'
import type { AgentListReplyAgentInfo } from '~/api/configManagement/agentManagement/types'
interface AgentManagementFieldParams {
  onViewLatestLogs: (row: AgentListReplyAgentInfo) => void
  onViewLatestMetrics: (row: AgentListReplyAgentInfo) => void
}

const commonInputConfig: any = {
  type: 'string',
  'x-decorator': 'FormItem',
  'x-component': 'Input',
  'x-component-props': {
    placeholder: '请输入',
    clearable: true,
    maxlength: 100,
    showWordLimit: false,
  },
}

const createInputFilterConfig = (label: string, placeholder?: string): any => ({
  ...commonInputConfig,
  'x-decorator-props': {
    label,
  },
  'x-component-props': {
    ...commonInputConfig['x-component-props'],
    ...(placeholder ? { placeholder } : {}),
  },
})

export const getFields = ({
  onViewLatestLogs,
  onViewLatestMetrics,
}: AgentManagementFieldParams): IField[] =>
  [
    {
      prop: 'agentName',
      label: 'Agent名称',
      isColumn: true,
      columnConfig: {
        minWidth: 180,
      },
      isFilter: true,
      filterConfig: createInputFilterConfig('Agent名称'),
    },
    {
      prop: 'hostname',
      label: '主机名称',
      isColumn: true,
      columnConfig: {
        minWidth: 180,
        render: ({ rowData }) => h('span', rowData?.hostName ?? '-'),
      },
      isFilter: true,
      filterConfig: createInputFilterConfig('主机名称', '请输入主机名称'),
    },
    {
      prop: 'status',
      label: 'Agent运行状态',
      isColumn: true,
      columnConfig: {
        width: 150,
        render: ({ rowData }) => {
          const status = rowData?.status
          return h(
            ElTag,
            {
              type: status?.online ? 'success' : 'info',
              effect: 'light',
            },
            () => status?.label ?? '-',
          )
        },
      },
      isFilter: true,
      filterConfig: {
        type: 'string',
        'x-decorator': 'FormItem',
        'x-component': 'Select',
        'x-decorator-props': {
          label: 'Agent运行状态',
        },
        'x-component-props': {
          placeholder: '请选择',
          clearable: true,
        },
      } as any,
      fetchConfig: {
        api: getAgentStatusLabels,
        formatter: (list = []) =>
          list.map((item) => ({
            label: item.label,
            value: item.status,
          })),
      },
    },
    {
      prop: 'lastBeatTime',
      label: 'Agent最后心跳时间',
      isColumn: true,
      columnConfig: {
        minWidth: 200,
      },
    },
    {
      prop: 'runTime',
      label: 'Agent运行时长',
      isColumn: true,
      columnConfig: {
        minWidth: 140,
      },
    },
    {
      prop: 'operation',
      label: '操作',
      isColumn: true,
      columnConfig: {
        width: 240,
        fixed: 'right',
        render: ({ rowData }) =>
          h(
            Space,
            {
              size: 12,
            },
            [
              // h(
              //   ElButton,
              //   {
              //     type: 'primary',
              //     link: true,
              //     onClick: (event: Event) => {
              //       event.stopPropagation()
              //       onViewLatestMetrics(rowData)
              //     },
              //   },
              //   () => '查看最近采集指标',
              // ),
              h(
                ElButton,
                {
                  type: 'primary',
                  link: true,
                  onClick: (event: Event) => {
                    event.stopPropagation()
                    onViewLatestLogs(rowData)
                  },
                },
                () => '查看最近采集日志',
              ),
            ],
          ),
      },
    },
  ] as IField[]

