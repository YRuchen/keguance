import type { Column } from 'element-plus'

export const getColumns = (): (Omit<Column, 'width'> & { width?: number })[] => ([
  {
    prop: 'monitoringNodeName',
    label: '监测节点',
    minWidth: 180,
  },
  {
    prop: 'execTime',
    label: '执行时间',
    width: 240,
  },
  {
    prop: 'monitoringUrl',
    label: '域名/监测地址',
    width: 280,
  },
  {
    prop: 'duration',
    label: '耗时',
    width: 80,
  },
])

export const getColumns2 = (): (Omit<Column, 'width'> & { width?: number })[] => ([
  {
    prop: 'monitoringNodeName',
    label: '监测节点',
    minWidth: 180,
  },
  {
    prop: 'monitoringUrl',
    label: '域名/监测地址',
    width: 400,
  },
  {
    prop: 'duration',
    label: '平均耗时',
    width: 80,
  },
])
