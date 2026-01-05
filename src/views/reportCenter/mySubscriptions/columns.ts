import { ElButton } from 'element-plus'
import { h } from 'vue'
import type { ColumnItem } from '../components/ReportTable/interface'

export const createColumns = (handlers: {
  handleStopSubscribe: (row: any) => void
  handleResubscribe: (row: any) => void
}): ColumnItem[] => [
  {
    label: '报告类型',
    prop: 'reportLabel',
    columnAttr: {
      width: 120,
    },
  },
  {
    label: '报告名称',
    prop: 'reportName',
    columnAttr: {
      minWidth: 150,
    },
  },
  {
    label: '所属模块',
    prop: 'moduleLabel',
    columnAttr: {
      width: 120,
    },
  },
  {
    label: '订阅状态',
    prop: 'subscribing',
    columnAttr: {
      width: 120,
    },
    render: ({ row }) => (row.subscribing ? '订阅中' : '已停止'),
  },
  {
    label: '订阅开始时间',
    prop: 'subscribeTime',
    columnAttr: {
      width: 180,
    },
  },
  {
    label: '订阅结束时间',
    prop: 'cancelTime',
    columnAttr: {
      width: 180,
    },
  },
  {
    label: '操作',
    columnAttr: {
      width: 200,
      fixed: 'right',
    },
    render: ({ row }) =>
      row.subscribing
        ? h(
            ElButton,
            {
              link: true,
              type: 'primary',
              onClick: () => handlers.handleStopSubscribe(row),
            },
            () => '停止订阅',
          )
        : h(
            ElButton,
            {
              link: true,
              type: 'primary',
              onClick: () => handlers.handleResubscribe(row),
            },
            () => '重新订阅',
          ),
  },
]
