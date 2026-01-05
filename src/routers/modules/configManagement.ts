import { h, defineAsyncComponent } from 'vue'
import { IconFont } from '~/KeepUp'
import { HeaderMode } from '../constants'

import type { IRouteRecordRaw } from '~/interfaces/common'

const configManagementRouter: IRouteRecordRaw[] = [
  {
    path: '/configMangeMent',
    name: 'configMangeMent',
    redirect: '/configMangeMent/agentPanel',
    meta: {
      title: '配置管理 ',
      icon: h(IconFont, { name: 'un-config-o' }),
      level: 1,
      permissionCodes: ['config:view'],
    },
    children: [
      {
        path: 'agentPanel',
        component: defineAsyncComponent(() => import('~/views/configManagement/agent')),
        name: 'agentPanel',
        meta: {
          title: '安装Agent',
          level: 2,
          headerMode: HeaderMode.SUBMENU,
          permissionCodes: ['config:view'],
        },
      },
      {
        path: 'agentManagement',
        component: defineAsyncComponent(() => import('~/views/configManagement/agentManagement/index.vue')),
        name: 'agentManagement',
        meta: {
          title: 'agent管理',
          level: 2,
          headerMode: HeaderMode.SUBMENU,
          permissionCodes: ['config:view'],
        },
      },
      {
        path: 'dataSource',
        component: defineAsyncComponent(() => import('~/views/configManagement/dataSource')),
        name: 'dataSource',
        meta: {
          title: '数据源管理',
          level: 2,
          headerMode: HeaderMode.SUBMENU,
          permissionCodes: ['config:view'],
        },
      },
      {
        path: 'dataSourceForm',
        name: 'DataSourceForm',
        component: defineAsyncComponent(() => import('~/views/configManagement/dataSource/edit')),
        meta: {
          title: '数据源配置',
          hidden: true,
          level: 3,
          permissionCodes: ['config:view'],
        },
      },
      {
        path: 'notifierManagement',
        name: 'NotifierManagement',
        component: defineAsyncComponent(() => import('~/views/configManagement/notifierManagement')),
        meta: {
          title: '通知人管理',
          level: 2,
          // TODO: 如果不加headerMode: HeaderMode.SUBMENU,顶导就会变成详情页的顶导，这里需要看一下。
          headerMode: HeaderMode.SUBMENU,
          permissionCodes: ['config:view'],
        },
      },
    ],
  },
]
export default configManagementRouter
