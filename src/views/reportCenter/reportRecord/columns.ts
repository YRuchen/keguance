import { ColumnItem } from '~/basicComponents/ListTable/interface'
import { ref, onMounted, computed, h } from 'vue'
import { useRouter } from 'vue-router'
import { ElTable, ElTableColumn, ElButton, ElPagination, ElMessage } from 'element-plus'
import ReportFilter from '../components/ReportFilter'
import SubscribeReportDialog from '../components/ReportDialog'
import {
  getReportRecordList,
  previewReport,
  exportReport,
  regenerateReport,
  getReportTypes,
  getReportModules,
  subscribeReport,
} from '@/api/reportCenter'
import { StatusLabelMap } from './constant'
import IconFont from '@/KeepUp/packages/basicComponents/iconFont'

const colors = ['#FF0000', '#FF8400', '#FFC800']

export const createColumns = (handlers: {
  handleRegenerate: (row: any) => void
  handleExport: (row: any) => void
  handlePreview: (row: any) => void
}): ColumnItem[] => [
  {
    label: '报告ID',
    prop: 'reportId',
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
    label: '生成状态',
    prop: 'status',
    columnAttr: {
      width: 120,
    },
  },
  {
    label: '创建时间',
    prop: 'createdAt',
    columnAttr: {
      width: 180,
    },
  },
  {
    label: '操作',
    columnAttr: {
      width: 240,
      fixed: 'right',
    },
    render: ({ row }) =>
      h('div', [
        h('div', [
          h(
            ElButton,
            { link: true, type: 'primary', onClick: () => handlers.handlePreview(row) },
            () => '预览',
          ),
          h(
            ElButton,
            { link: true, type: 'primary', onClick: () => handlers.handleExport(row) },
            () => '导出',
          ),
          h(
            ElButton,
            { link: true, type: 'primary', onClick: () => handlers.handleRegenerate(row) },
            () => '重新生成',
          ),
        ]),
      ]),
  },
]
export const countColumns = (): ColumnItem[] => [
  {
    label: '排名',
    prop: 'id',
    columnAttr: {
      width: 80,
      align: 'right',
      headerAlign: 'right',
    },
    render: ({ row }) =>
      h(
        'span',
        {
          style: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
          },
        },
        row.id <= 3
          ? [
              h(IconFont, {
                name: 'error',
                color: colors[row.id - 1],
                size: '14',
                style: { marginRight: '4px' },
              }),
              row.id,
            ]
          : row.id,
      ),
  },

  {
    label: '检测类型',
    prop: 'taskLabel',
    columnAttr: {
      minWidth: 200,
      showOverflowTooltip: true,
    },
  },

  {
    label: '本周告警任务数',
    prop: 'abnormalNum',
    columnAttr: {
      width: 180,
      align: 'right',
    },
  },

  {
    label: '占比',
    prop: 'proportion',
    columnAttr: {
      width: 120,
      align: 'center',
    },
  },
]
export const getT10Columns = (): ColumnItem[] => [
  {
    label: '排名',
    prop: 'id',
    columnAttr: {
      width: 80,
      align: 'right',
      headerAlign: 'right',
    },
    render: ({ row }) =>
      h(
        'span',
        {
          style: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
          },
        },
        row.id <= 3
          ? [
              h(IconFont, {
                name: 'error',
                color: colors[row.id - 1],
                size: '14',
                style: { marginRight: '4px' },
              }),
              row.id,
            ]
          : row.id,
      ),
  },

  {
    label: '任务名称',
    prop: 'taskName',
    columnAttr: {
      minWidth: 200,
      showOverflowTooltip: true,
    },
  },

  {
    label: '监控对象',
    prop: 'domain',
    columnAttr: {
      width: 180,
      align: 'center',
    },
  },

  {
    label: '本周告警任务数',
    prop: 'abnormal',
    columnAttr: {
      width: 150,
      align: 'center',
    },
  },
]
