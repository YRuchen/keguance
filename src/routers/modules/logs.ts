import { h, defineAsyncComponent } from 'vue'
import { IconFont } from '~/KeepUp'
import { HeaderMode } from '../constants'

import type { IRouteRecordRaw } from '~/interfaces/common'

const logsPanelRouter: IRouteRecordRaw[] = [
  {
    path: '/logs',
    name: 'logs',
    redirect: '/logs/discover',
    meta: { 
      title: '日志', 
      icon: h(IconFont, { name: 'logs_panel' }), 
      level: 1,
      permissionCodes: ['log:view'],
    },
    children: [
      {
        path: 'discover',
        component: defineAsyncComponent(() => import('~/views/logs/discover')),
        name: 'discover',
        meta: { 
          title: '日志检索', 
          level: 2, 
          headerMode: HeaderMode.SUBMENU,
          permissionCodes: ['log:view'],
        },
      },
      {
        path: 'indexManagement',
        component: defineAsyncComponent(() => import('~/views/logs/indexManagement')),
        name: 'IndexManagement',
        meta: { 
          title: '索引管理', 
          level: 2,
          headerMode: HeaderMode.SUBMENU,
          permissionCodes: ['log:view'],
        },
      },
      {
        path: 'indexManagementCreate',
        component: defineAsyncComponent(() => import('~/views/logs/indexManagement/detail')),
        name: 'IndexManagementCreate',
        meta: { 
          title: '新增索引模版', 
          level: 3,
          breadcrumbConfig: [
            { label: '索引管理', name: 'IndexManagement' },
            { label: '新增索引模版', name: 'IndexManagementCreate' },
          ],
          hidden: true,
          headerHidden: true,
          permissionCodes: ['log:view'],
        },
      },
      {
        path: 'indexManagementEdit',
        component: defineAsyncComponent(() => import('~/views/logs/indexManagement/detail')),
        name: 'IndexManagementEdit',
        meta: { 
          title: '编辑索引模版', 
          level: 3,
          breadcrumbConfig: [
            { label: '索引管理', name: 'IndexManagement' },
            { label: '编辑索引模版', name: 'IndexManagementEdit' },
          ],
          hidden: true,
          headerHidden: true,
          permissionCodes: ['log:view'],
        },
      },
      {
        path: 'snapshot',
        component: defineAsyncComponent(() => import('~/businessComponents/commonIframePage')),
        name: 'snapshot',
        meta: { 
          title: '快照管理', 
          level: 2,
          headerMode: HeaderMode.SUBMENU, 
          disabledInMenu: true,
          permissionCodes: ['log:view'],
        },
      },
    ],
  },
]
export default logsPanelRouter
