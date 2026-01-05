import { h, defineAsyncComponent } from 'vue'
import { IconFont } from '~/KeepUp'
import { HeaderMode } from '../constants'

import type { IRouteRecordRaw } from '~/interfaces/common'

const reportCenterRouter: IRouteRecordRaw[] = [
  {
    path: '/reportCenter',
    name: 'reportCenter',
    redirect: '/reportCenter/reportRecord',
    meta: {
      title: '报告中心',
      icon: h(IconFont, { name: 'logs_panel' }), // TODO: 替换为正确的图标名称
      level: 1,
      permissionCodes: ['log:view'],
    },
    children: [
      {
        path: 'reportRecord',
        component: defineAsyncComponent(
          () => import('~/views/reportCenter/reportRecord/index.vue'),
        ),
        name: 'reportRecord',
        meta: {
          title: '报告记录',
          level: 2,
          headerMode: HeaderMode.SUBMENU,
          permissionCodes: ['log:view'],
        },
      },
      {
        path: 'previewReport',
        component: defineAsyncComponent(
          () => import('~/views/reportCenter/reportRecord/previewReport.vue'),
        ),
        name: 'previewReport',
        meta: {
          title: '预览报告',
          level: 3,
          breadcrumbConfig: [
            { label: '报告记录', name: 'reportRecord' },
            { label: '预览报告', name: 'previewReport' },
          ],
          hidden: true,
          headerHidden: true,
          permissionCodes: ['log:view'],
        },
      },
      {
        path: 'mySubscriptions',
        component: defineAsyncComponent(
          () => import('~/views/reportCenter/mySubscriptions/index.vue'),
        ),
        name: 'mySubscriptions',
        meta: {
          title: '我的订阅',
          level: 2,
          headerMode: HeaderMode.SUBMENU,
          permissionCodes: ['log:view'],
        },
      },
      {
        path: 'reportLog',
        component: defineAsyncComponent(() => import('~/views/reportCenter/reportLog/index.vue')),
        name: 'reportLog',
        meta: {
          title: '报告日志',
          level: 2,
          headerMode: HeaderMode.SUBMENU,
          permissionCodes: ['log:view'],
        },
      },
    ],
  },
]

export default reportCenterRouter
