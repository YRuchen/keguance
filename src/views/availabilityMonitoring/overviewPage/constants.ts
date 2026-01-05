import { ElTabPane } from 'element-plus'
import Detail from '../detail'
import TaskRunningPanel from '../taskRunningPanel'
import TaskHistory from '../taskHistory'

import type { ISchema } from '@formily/vue'

const commonAttrs = {
  style: {
    width: '100%'
  },
}

export enum Tabs {
  /** 任务基础信息 */
  Detail = 'Detail',
  /** 任务运行统计 */
  RunningStatistics = 'RunningStatistics',
  /** 任务运行历史 */
  TaskHistory = 'TaskHistory',
}

/** tabs数据结构 */
export const tabsSchema: ISchema[] = [
  {
    title: '任务基础信息',
    name: Tabs.Detail,
    'x-decorator': ElTabPane,
    'x-decorator-props': {
      commonAttrs,
    },
    'x-component': Detail,
  },
  // {
  //   title: '任务运行统计',
  //   name: Tabs.RunningStatistics,
  //   'x-decorator': ElTabPane,
  //   'x-decorator-props': {
  //     commonAttrs,
  //   },
  //   'x-component': TaskRunningPanel,
  // },
  {
    title: '任务运行历史',
    name: Tabs.TaskHistory,
    'x-decorator': ElTabPane,
    'x-decorator-props': {
      lazy: true,
      commonAttrs,
    },
    'x-component': TaskHistory,
  },
]
