import { ElTabPane } from 'element-plus'
import { FormilyForm } from '~/KeepUp'
import Detail from '../detail'
import { getSchema } from '../view/schema'

import type { ISchema } from '@formily/vue'

export enum Tabs {
  /** 任务基础信息 */
  Detail = 'Detail',
  /** 任务运行历史 */
  TaskHistory = 'TaskHistory',
}

export const tabsActiveNames = [Tabs.Detail, Tabs.TaskHistory]

const commonAttrs = {
  style: {
    width: '100%'
  },
}
/** tabs数据结构 */
export const getTabsSchema = (): ISchema[] => [
  {
    title: '任务基础信息',
    name: Tabs.Detail,
    'x-decorator': ElTabPane,
    'x-decorator-props': {
      commonAttrs,
    },
    'x-component': FormilyForm,
    'x-component-props': {
      style: {
        width: '100%',
        padding: '0 16px',
        boxSizing: 'border-box',
      },
      config: getSchema(),
    },
  },
  {
    title: '任务运行历史',
    name: Tabs.TaskHistory,
    'x-decorator': ElTabPane,
    'x-decorator-props': {
      lazy: true,
      commonAttrs,
    },
    'x-component': Detail,
  },
]
