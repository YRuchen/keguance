import type { Column } from 'element-plus'

const fields: Column[] = [
  {
    prop: 'hostName',
    label: '主机名称',
  },
  {
    prop: 'ident',
    label: 'Agent名称',
  } as any,
  {
    prop: 'runningTime',
    label: 'Agent运行时长',
  },
]

export default fields
