import { h, defineAsyncComponent } from 'vue'
import { IconFont } from '~/KeepUp'

import type { IRouteRecordRaw } from '~/interfaces/common'

const controlPanelRouter: IRouteRecordRaw[] = [
  {
    path: '/eventPanel',
    name: 'eventPanel',
    redirect: '/eventPanel/event',
    meta: { 
      title: '事件', 
      icon: h(IconFont, { name: 'event_panel' }), 
      level: 1,
      disabledInMenu: true,
      permissionCodes: ['event:view'],
    },
    children: [
      {
        path: 'event',
        component: defineAsyncComponent(() => import('@/views/controlPanel/dashBoard/index.vue')),
        name: 'event',
        meta: { 
          title: '异常日志', 
          level: 2,
          permissionCodes: ['event:view'],
        },
      },
      {
        path: 'eventA',
        component: defineAsyncComponent(() => import('@/views/controlPanel/dashBoard/importDashBoard.vue')),
        name: 'eventA',
        meta: { 
          title: '异常指标', 
          level: 2,
          permissionCodes: ['event:view'],
        },
      },
      {
        path: 'eventB',
        component: defineAsyncComponent(() => import('@/views/controlPanel/dashBoard/importDashBoard.vue')),
        name: 'eventB',
        meta: { 
          title: '未恢复事件', 
          level: 2,
          permissionCodes: ['event:view'],
        },
      },

    ],
  },
]
export default controlPanelRouter
