import { h, defineAsyncComponent } from 'vue'
import { IconFont } from '~/KeepUp'
import { HeaderMode } from '../constants'

import type { IRouteRecordRaw } from '~/interfaces/common'

const controlPanelRouter: IRouteRecordRaw[] = [
  {
    path: '/monitor',
    name: 'Monitor',
    redirect: '/monitor/alert',
    meta: { 
      title: '监控', 
      icon: h(IconFont, { name: 'monitors_panel' }), 
      level: 1,
      disabledInMenu: true,
      permissionCodes: ['monitor:view'],
    },
    children: [
      {
        path: 'alert',
        component: defineAsyncComponent(() => import('@/views/monitor')),
        name: 'Alert',
        redirect: '/monitor/alert/alertRules',
        meta: { 
          title: '告警管理', 
          level: 2, 
          headerMode: HeaderMode.SUBMENU,
          permissionCodes: ['monitor:view'],
        },
        children: [
          {
            path: 'alertRules',
            component: defineAsyncComponent(() => import('@/views/monitor')),
            name: 'AlertRules',
            meta: {
              title: '告警规则',
              level: 3,
              url: '/alert-rules',
              headerMode: HeaderMode.SUBMENU,
              permissionCodes: ['monitor:view'],
            },
          },
          {
            path: 'mutes',
            component: defineAsyncComponent(() => import('@/views/monitor')),
            name: 'Mutes',
            meta: {
              title: '屏蔽规则',
              level: 3,
              url: '/alert-mutes',
              headerMode: HeaderMode.SUBMENU,
              permissionCodes: ['monitor:view'],
            },
          },
          {
            path: 'subscribes',
            component: defineAsyncComponent(() => import('@/views/monitor')),
            name: 'Subscribes',
            meta: {
              title: '订阅规则',
              level: 3,
              url: '/alert-subscribes',
              headerMode: HeaderMode.SUBMENU,
              permissionCodes: ['monitor:view'],
            },
          },
          {
            path: 'tpls',
            component: defineAsyncComponent(() => import('@/views/monitor')),
            name: 'Tpls',
            meta: {
              title: '自愈脚本',
              level: 3,
              url: '/job-tpls',
              headerMode: HeaderMode.SUBMENU,
              permissionCodes: ['monitor:view'],
            },
          },
          {
            path: 'tasks',
            component: defineAsyncComponent(() => import('@/views/monitor')),
            name: 'Tasks',
            meta: {
              title: '历史任务',
              level: 3,
              url: '/job-tasks',
              headerMode: HeaderMode.SUBMENU,
              permissionCodes: ['monitor:view'],
            },
          },
          {
            path: 'curEvents',
            component: defineAsyncComponent(() => import('@/views/monitor')),
            name: 'CurEvents',
            meta: {
              title: '活跃告警',
              level: 3,
              url: '/alert-cur-events',
              headerMode: HeaderMode.SUBMENU,
              permissionCodes: ['monitor:view'],
            },
          },
          {
            path: 'hisEvents',
            component: defineAsyncComponent(() => import('@/views/monitor')),
            name: 'HisEvents',
            meta: {
              title: '历史告警',
              level: 3,
              url: '/alert-his-events',
              headerMode: HeaderMode.SUBMENU,
              permissionCodes: ['monitor:view'],
            },
          },
        ],
      },
      {
        path: 'notification',
        component: defineAsyncComponent(() => import('@/views/monitor')),
        name: 'Notification',
        redirect: '/monitor/notification/notificationRules',
        meta: { 
          title: '通知管理', 
          level: 2, 
          headerMode: HeaderMode.SUBMENU,
          permissionCodes: ['monitor:view'],
        },
        children: [
          {
            path: 'notificationRules',
            component: defineAsyncComponent(() => import('@/views/monitor')),
            name: 'NotificationRules',
            meta: {
              title: '通知规则',
              level: 3,
              url: '/notification-rules',
              headerMode: HeaderMode.SUBMENU,
              permissionCodes: ['monitor:view'],
            },
          },
          {
            path: 'channels',
            component: defineAsyncComponent(() => import('@/views/monitor')),
            name: 'Channels',
            meta: {
              title: '通知媒介',
              level: 3,
              url: '/notification-channels',
              headerMode: HeaderMode.SUBMENU,
              permissionCodes: ['monitor:view'],
            },
          },
          {
            path: 'templates',
            component: defineAsyncComponent(() => import('@/views/monitor')),
            name: 'Templates',
            meta: {
              title: '消息模板',
              level: 3,
              url: '/notification-templates',
              headerMode: HeaderMode.SUBMENU,
              permissionCodes: ['monitor:view'],
            },
          },
        ],
      },
    ],
  },
]
export default controlPanelRouter
