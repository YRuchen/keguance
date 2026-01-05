import { ElButton } from 'element-plus'
import { h } from 'vue'
import type { ColumnItem } from '../components/ReportTable/interface'

export const createColumns = (handlers: {
  handleDelete: (row: any) => void
  handleResend: (row: any) => void
}): ColumnItem[] => [
  {
    columnAttr: {
      type: 'selection',
      width: 55,
    },
  },
  {
    label: '发送时间',
    prop: 'createdAt',
    columnAttr: {
      width: 180,
    },
  },
  {
    label: '发送状态',
    prop: 'status',
    columnAttr: {
      width: 120,
    },
  },
  {
    label: '发送方式',
    prop: 'channelLabel',
    columnAttr: {
      width: 120,
    },
  },
  {
    label: '发送邮箱',
    prop: 'receiveAddr',
    columnAttr: {
      minWidth: 200,
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
    label: '报告类型',
    prop: 'reportLabel',
    columnAttr: {
      width: 120,
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
    label: '操作',
    columnAttr: {
      width: 180,
      fixed: 'right',
    },
    render: ({ row }) =>
      h('div', [
        h(
          ElButton,
          { link: true, type: 'primary', onClick: () => handlers.handleDelete(row) },
          () => '删除',
        ),
        h(
          ElButton,
          { link: true, type: 'primary', onClick: () => handlers.handleResend(row) },
          () => '重新发送',
        ),
      ]),
  },
]
