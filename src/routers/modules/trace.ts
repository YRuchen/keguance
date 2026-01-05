import { h, defineAsyncComponent } from 'vue'
import { IconFont } from '~/KeepUp'
import { HeaderMode } from '../constants'

import type { IRouteRecordRaw } from '~/interfaces/common'

export default [
  {
    path: '/trace',
    name: 'Trace',
    redirect: '/trace/index',
    meta: { 
      title: '追踪', 
      icon: h(IconFont, { name: 'availability_monitoring' }), 
      level: 1,
      disabledInMenu: true,
      permissionCodes: ['trace:view'],
    },
    children: [
      {
        path: 'index',
        name: 'TraceExplorationIndex',
        component: defineAsyncComponent(() => import('~/views/trace/traceExploration')),
        meta: { 
          title: '追踪查询', 
          level: 2, 
          headerMode: HeaderMode.SUBMENU,
          permissionCodes: ['trace:view'],
        },
      },
      {
        path: 'view',
        name: 'TraceExplorationView',
        component: defineAsyncComponent(() => import('~/views/trace/traceExploration/detail')),
        meta: {
          title: '详情',
          hidden: true,
          level: 3,
          breadcrumbConfig: [
            { label: '追踪查询', name: 'TraceExplorationIndex' },
            { label: '详情', name: 'TraceExplorationView' },
          ],
          permissionCodes: ['trace:view'],
        },
      },
    ]
  },
] as IRouteRecordRaw[]
