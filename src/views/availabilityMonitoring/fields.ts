import { ElButton, ElMessage, ElMessageBox, ElTag } from 'element-plus'
import { h, ref } from 'vue'
import { ResultStatus, RunningStatus } from '~/api/availabilityMonitoring/constants'
import Space from '~/basicComponents/space'
import BaseSvgIcon from '~/components/SvgIcon/index.vue'
import { hasPermission } from '~/utils/auth'
import { Action, actionMap } from './constants'
import styles from './index.module.scss'

import type { IField } from '~/businessComponents/commonPage'
import type { IGetFieldsParams } from './interface'
import useAiChat from './useAiChat'
const drawerRef = ref<any>(null)

const commonAttrs = {
  link: true,
  style: { padding: 0 },
}
export const getFields = ({ router, commonPageRef }: IGetFieldsParams): IField[] => ([
  {
    prop: 'periodicTask',
    label: '',
    isColumn: true,
    columnConfig: {
      width: 50,
      render: ({ rowData }) => h(
        'div',
        {},
        [
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
          )
        ],
      )
    }
    ,
  },
  {
    prop: 'keyword',
    label: '',
    isFilter: true,
    filterConfig: {
      type: 'void',
      'x-component': 'FormGrid.GridColumn',
      'x-component-props': {
        gridSpan: 6,
      },
      properties: {
        keyword: {
          type: 'string',
          enum: [],
          'x-decorator': 'FormItem',
          'x-decorator-props': {
            style: {
              marginBottom: '0',
            }
          },
          'x-component': 'Input',
          'x-component-props': {
            clearable: true,
            placeholder: '请输入任务名称或域名/地址进行搜索',
          }
        }
      }
    },
  },
  {
    prop: 'testResultsCode',
    label: '拨测结果',
    isColumn: true,
    columnConfig: {
      width: 120,
      render: ({ rowData }) => h(ElTag, { type: rowData.testResultsCode === ResultStatus.PASSED ? 'success' : 'danger' }, rowData.testResults),
    },
  },
  {
    prop: 'taskName',
    label: '任务名称',
    isColumn: true,
    columnConfig: {
      minWidth: 150,
    },
  },
  {
    prop: 'requestType',
    label: '请求类型',
    isColumn: true,
    columnConfig: {
      width: 120,
    },
  },
  {
    prop: 'domainAndAddress',
    label: '域名/地址',
    isColumn: true,
    columnConfig: {
      width: 100,
    },
  },
  {
    prop: 'runningStatus',
    label: '运行状态',
    isColumn: true,
    columnConfig: {
      width: 90,
      render: ({ rowData }) => h(ElTag, { type: rowData.runningStatusCode === RunningStatus.LIVE ? 'success' : 'danger' }, rowData.runningStatus),
    },
  },
  {
    prop: 'creator',
    label: '创建人',
    isColumn: true,
    columnConfig: {
      width: 100,
    },
  },
  {
    prop: 'lastModifiedTime',
    label: '最后修改时间',
    isColumn: true,
    columnConfig: {
      width: 220,
    },
  },
  {
    prop: 'operation',
    label: '操作',
    isColumn: true,
    columnConfig: {
      width: 180,
      fixed: 'right',
      render({ rowData }) {
        const isPaused = rowData.runningStatusCode === RunningStatus.PAUSED
        const commonAction = async (e: Event, actionItem: Record<string, any>) => {
          try {
            e.stopPropagation()
            await actionItem.api?.({ testIds: [rowData.id] })
            commonPageRef.value?.query()
            ElMessage({
              message: `${actionItem.text}成功`,
              type: 'success'
            })
          } catch (error) {
            console.error(`${actionItem.text}测试失败，失败原因：${error}`)
          }
        }
        return h(Space, {
          size: 0,
          justify: 'start',
        }, [
          h(ElButton, {
            type: 'primary',
            ...commonAttrs,
            onClick: (e: Event) => {
              e.stopPropagation()
              router.push({ path: 'edit', query: { testId: rowData.id } })
            }
          }, '编辑'),
          h(ElButton, {
            type: isPaused ? 'success' : 'warning',
            ...commonAttrs,
            disabled: !hasPermission(['line:enable']),
            onClick: async (e: Event) => {
              commonAction(e, isPaused ? actionMap[Action.ENABLE] : actionMap[Action.PAUSE])
            }
          }, isPaused ? actionMap[Action.ENABLE].text : actionMap[Action.PAUSE].text),
          h(ElButton, {
            type: 'danger',
            ...commonAttrs,
            disabled: !hasPermission(['line:delete']),
            onClick: async (e: Event) => {
              try {
                e.stopPropagation()
                if (rowData.runningStatusCode === RunningStatus.LIVE) {
                  ElMessage({
                    message: '运行中的任务不能删除，请先暂停任务',
                    type: 'warning',
                  })
                  return
                }
                await ElMessageBox.confirm(
                  '确认删除当前任务?',
                  {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning',
                  }
                )
                commonAction(e, actionMap.DELETE)
              } catch (error: any) {
                console.log(`取消刪除`)
              }
            },
          }, '删除'),
          h(ElButton, {
            type: 'primary',
            ...commonAttrs,
            onClick: (e: Event) => {
              e.stopPropagation()
              router.push({
                path: 'overviewPage',
                query: {
                  testId: rowData.id,
                  requestType: rowData.requestType,
                  resultStatus: rowData.resultStatus,
                }
              })
            }
          }, '详情')
        ])
      }
    },
  },
])
