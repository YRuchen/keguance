import { h, defineAsyncComponent } from 'vue'
import { IconFont } from '~/KeepUp'
import { HeaderMode } from '../constants'

import type { IRouteRecordRaw } from '~/interfaces/common'

const controlPanelRouter: IRouteRecordRaw[] = [
  {
    path: '/metrics',
    name: 'Metrics',
    redirect: '/metrics/metricsExplorer',
    meta: { 
      title: '指标', 
      icon: h(IconFont, { name: 'target_panel' }), 
      level: 1,
      disabledInMenu: true,
      permissionCodes: ['metric:view'],
    },
    children: [
      {
        path: 'metricsExplorer',
        component: defineAsyncComponent(() => import('@/views/metrics')),
        name: 'MetricsExplorer',
        meta: {
          title: '即时查询',
          level: 2,
          url: '/metric/explorer',
          headerMode: HeaderMode.SUBMENU,
          permissionCodes: ['metric:view'],
        },
      },
      {
        path: 'builtInMetrics',
        component: defineAsyncComponent(() => import('@/views/metrics')),
        name: 'BuiltInMetrics',
        meta: {
          title: '指标视图',
          level: 2,
          url: '/metrics-built-in',
          headerMode: HeaderMode.SUBMENU,
          permissionCodes: ['metric:view'],
        },
      },
      {
        path: 'quickView',
        component: defineAsyncComponent(() => import('@/views/metrics')),
        name: 'QuickView',
        meta: {
          title: '快捷视图',
          level: 2,
          url: '/object/explorer',
          headerMode: HeaderMode.SUBMENU,
          permissionCodes: ['metric:view'],
        },
      },
    ],
  },
]
export default controlPanelRouter
