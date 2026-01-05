import { ElMessage, ElMessageBox } from 'element-plus'
import { removeTestApi, enableTestApi, pauseTestApi } from '~/api/availabilityMonitoring'
import { RunningStatus } from '~/api/availabilityMonitoring/constants'
import { commonAction } from './utils'

import type { Ref } from 'vue'
import type { IListItem } from '~/api/availabilityMonitoring/interfaces'
import type { IExpose } from '~/businessComponents/commonPage'

/** checkBoxGroups的schema mock */
export const mockSchema = { // TODO: ts
  requestType: {
    label: '请求类型',
    options: ['Shanghai', 'Beijing', 'Guangzhou', 'Shenzhen'],
  },
  resCode: {
    label: '响应码',
    options: ['200', '404', '401', '500'],
  }
}

/** 批量操作 */
export const batchActions = (commonPageRef: Ref<IExpose>) => ([
  {
    label: '批量启用',
    onClick: async (selectedKeys: string[], selected: IListItem[]) => {
      commonAction(actionMap.ENABLE, selectedKeys, commonPageRef)
    },
  },
  {
    label: '批量暂停',
    onClick: (selectedKeys: string[], selected: IListItem[]) => {
      commonAction(actionMap.PAUSE, selectedKeys, commonPageRef)
    },
  },
  {
    label: '批量删除',
    onClick: async (selectedKeys: string[], selected: IListItem[]) => {
      if (selected.some(v => v.runningStatusCode === RunningStatus.LIVE)) {
        ElMessage({
          message: '不能删除运行中的任务',
          type: 'warning',
        })
        return
      }
      try {
        await ElMessageBox.confirm(
          '确认删除当前任务?',
          {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
          }
        )
        commonAction(actionMap.DELETE, selectedKeys, commonPageRef)
      } catch (error: any) {
        console.log(`取消刪除`)
      }
    },
  },
])

/** 动作 */
export enum Action {
  /** 启用 */
  ENABLE = 'ENABLE',
  /** 暂停 */
  PAUSE = 'PAUSE',
  /** 删除 */
  DELETE = 'DELETE',
}

/** 动作 */
export const actionMap = {
  /** 启用 */
  [Action.ENABLE]: {
    text: '启用',
    batchText: '批量启用',
    api: enableTestApi,
  },
  /** 暂停 */
  [Action.PAUSE]: {
    text: '暂停',
    batchText: '批量暂停',
    api: pauseTestApi,
  },
  /** 删除 */
  [Action.DELETE]: {
    text: '删除',
    batchText: '批量删除',
    api: removeTestApi,
  },
}

/** 区域类型 */
export enum PanelType {
  /** 顶部卡片:任务组 */
  TASK_GROUP = 'TASK_GROUP',
  /** 快速筛查 */
  FILTER_FAST = 'FILTER_FAST',
}
