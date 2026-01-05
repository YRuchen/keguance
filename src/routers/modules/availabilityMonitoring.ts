import { h, defineAsyncComponent } from 'vue'
import { IconFont } from '~/KeepUp'
import { HeaderMode } from '../constants'

import type { IRouteRecordRaw } from '~/interfaces/common'

export default [
  {
    path: '/availabilityMonitoring',
    name: 'AvailabilityMonitoring',
    redirect: 'index',
    meta: {
      title: '线路',
      icon: h(IconFont, { name: 'availability_monitoring' }),
      level: 1,
      permissionCodes: ['line:view'],
    },
    children: [
      {
        path: 'index',
        name: 'AvailabilityMonitoringIndex',
        component: defineAsyncComponent(() => import('~/views/availabilityMonitoring')),
        meta: {
          title: '线路任务列表',
          level: 2,
          headerMode: HeaderMode.SUBMENU,
          permissionCodes: ['line:view'],
        },
      },
      {
        path: 'create',
        name: 'AvailabilityMonitoringCreate',
        component: defineAsyncComponent(() => import('~/views/availabilityMonitoring/detail')),
        meta: {
          title: '新建线路任务',
          role: ['other'],
          level: 3,
          headerHidden: true,
          hidden: true,
          breadcrumbConfig: [
            { label: '线路任务列表', name: 'AvailabilityMonitoringIndex' },
            { label: '新建线路任务', name: 'AvailabilityMonitoringCreate' },
          ],
          permissionCodes: ['line:view'],
        },
      },
      {
        path: 'edit',
        name: 'AvailabilityMonitoringEdit',
        component: defineAsyncComponent(() => import('~/views/availabilityMonitoring/detail')),
        meta: {
          title: '编辑任务',
          hidden: true,
          role: ['other'],
          level: 3,
          breadcrumbConfig: [
            { label: '线路任务列表', name: 'AvailabilityMonitoringIndex' },
            { label: '编辑任务', name: 'AvailabilityMonitoringEdit' },
          ],
          permissionCodes: ['line:view'],
        },
      },
      {
        path: 'view',
        name: 'AvailabilityMonitoringView',
        component: defineAsyncComponent(() => import('~/views/availabilityMonitoring/detail')),
        meta: {
          title: '查看任务',
          hidden: true,
          role: ['other'],
          level: 3,
          breadcrumbConfig: [
            { label: '线路任务列表', name: 'AvailabilityMonitoringIndex' },
            { label: '查看任务', name: 'AvailabilityMonitoringView' },
          ],
          permissionCodes: ['line:view'],
        },
      },
      {
        path: 'taskHistory',
        name: 'TaskHistory',
        component: defineAsyncComponent(() => import('~/views/availabilityMonitoring/taskHistory')),
        meta: {
          title: '历史任务',
          hidden: true,
          role: ['other'],
          level: 3,
          breadcrumbConfig: [
            { label: '线路任务列表', name: 'AvailabilityMonitoringIndex' },
            { label: '历史任务', name: 'TaskHistory' },
          ],
          permissionCodes: ['line:view'],
        },
      },
      {
        path: 'overviewPage',
        name: 'OverviewPage',
        component: defineAsyncComponent(() => import('~/views/availabilityMonitoring/overviewPage')),
        meta: {
          title: '任务信息总览',
          hidden: true,
          role: ['other'],
          level: 3,
          breadcrumbConfig: [
            { label: '线路任务列表', name: 'AvailabilityMonitoringIndex' },
            { label: '任务信息总览', name: 'OverviewPage' },
          ],
          permissionCodes: ['line:view'],
        },
      },
      {
        path: 'alarm',
        name: 'Alarm',
        component: defineAsyncComponent(() => import('~/views/availabilityMonitoring/alarm')),
        meta: {
          title: '告警',
          role: ['other'],
          level: 2,
          headerMode: HeaderMode.SUBMENU,
          permissionCodes: ['line:view'],
        },
      },
      {
        path: 'overview',
        name: 'Overview',
        component: defineAsyncComponent(() => import('~/views/availabilityMonitoring/overview')),
        meta: {
          title: '概览',
          role: ['other'],
          level: 2,
          headerMode: HeaderMode.SUBMENU,
          permissionCodes: ['line:view'],
        },
      },
      {
        path: 'situationAwareness',
        name: 'SituationAwareness',
        component: defineAsyncComponent(() => import('~/views/availabilityMonitoring/situationAwareness/index')),
        meta: {
          title: '态势感知',
          role: ['other'],
          level: 2,
          headerMode: HeaderMode.SUBMENU,
          permissionCodes: ['line:view'],
        },
      },
    ],
  },
] as IRouteRecordRaw[]
