import { ElTabPane } from 'element-plus'
import Detail from '../detail'
import View from '../view'

import type { ISchema } from '@formily/vue'

const commonAttrs = {
  style: {
    width: '100%'
  },
}

export enum Tabs {
  /** 任务基础信息 */
  Detail = 'Detail',
  /** 任务运行历史 */
  TaskHistory = 'TaskHistory',
}

export const tabsActiveNames = [Tabs.Detail, Tabs.TaskHistory]

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
  {
    title: '任务运行历史',
    name: Tabs.TaskHistory,
    'x-decorator': ElTabPane,
    'x-decorator-props': {
      lazy: true,
      commonAttrs,
    },
    'x-component': View,
  },
]
