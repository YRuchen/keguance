import { h, defineAsyncComponent } from 'vue'
import { IconFont } from '~/KeepUp'
import { HeaderMode } from '../../constants'
import { modules } from './module'

import type { IRouteRecordRaw } from '~/interfaces/common'

export default [
  {
    path: '/domainManagement',
    name: 'DomainManagement',
    redirect: '/domainManagement/assetManagement',
    meta: { 
      title: '域名监测', 
      icon: h(IconFont, { name: 'asset_management' }), 
      level: 1,
      permissionCodes: ['domain:view'],
    },
    children: [
      // {
      //   path: 'assetManagement',
      //   name: 'AssetManagement',
      //   component: defineAsyncComponent(() => import('~/views/domainManagement/views/assetManagement')),
      //   meta: { title: '资产管理', level: 2, headerMode: HeaderMode.SUBMENU },
      // },
      // {
      //   path: 'detail',
      //   name: 'AssetManagementDetail',
      //   component: defineAsyncComponent(() => import('~/views/domainManagement/views/assetManagement/detail')),
      //   meta: {
      //     title: '资产详情',
      //     hidden: true,
      //     level: 2,
      //     breadcrumbConfig: [
      //       { label: '资产管理', name: 'AssetManagement' },
      //       { label: '资产详情', name: 'AssetManagementDetail' },
      //     ],
      //   },
      // },
      {
        path: 'dataOverview',
        name: 'DataOverview',
        component: defineAsyncComponent(() => import('~/views/domainManagement/views/dataOverview/index.vue')),
        meta: {
          title: '概览',
          level: 2,
          headerMode: HeaderMode.SUBMENU,
          permissionCodes: ['domain:view'],
        },
      },
      {
        path: 'checkResults',
        name: 'CheckResults',
        component: defineAsyncComponent(() => import('~/views/domainManagement/views/checkResults')),
        meta: { 
          title: '检测结果',
          level: 3,
          headerMode: HeaderMode.SUBMENU,
          permissionCodes: ['domain:view'],
        },
      },
      {
        path: 'detectionClassification',
        name: 'DetectionClassification',
        component: defineAsyncComponent(() => import('~/views/domainManagement/views/detectionClassification')),
        redirect: '/domainManagement/detectionClassification/hijackDetection',
        meta: { 
          title: '检测分类', 
          level: 3,
          hiddenLevel3: true,
          headerMode: HeaderMode.SUBMENU,
          permissionCodes: ['domain:view'],
        },
        children: [
          // {
          //   path: 'httpInspect',
          //   name: 'HttpInspect',
          //   component: () => import('~/views/domainManagement/httpInspect'),
          //   meta: { title: 'HTTP检测', level: 2, headerMode: HeaderMode.SUBMENU },
          // },
          ...modules,
        ],
      },
      {
        path: 'hijackDetectionCreate',
        name: 'HijackDetectionCreate',
        component: defineAsyncComponent(() => import('~/views/domainManagement/views/hijackDetection/detail/index')),
        meta: {
          title: '劫持检测-新增',
          hidden: true,
          headerHidden: true,
          level: 3,
          highlightMenuName: 'DetectionClassification',
          breadcrumbConfig: [
            { label: '检测分类', name: 'HijackDetection' },
            { label: '劫持检测-新增', name: 'HijackDetectionCreate' },
          ],
          permissionCodes: ['domain:view'],
        },
      },
      {
        path: 'hijackDetectionEdit',
        name: 'HijackDetectionEdit',
        component: defineAsyncComponent(() => import('~/views/domainManagement/views/hijackDetection/detail/index')),
        meta: {
          title: '劫持检测-编辑',
          hidden: true,
          headerHidden: true,
          level: 3,
          highlightMenuName: 'DetectionClassification',
          breadcrumbConfig: [
            { label: '检测分类', name: 'HijackDetection' },
            { label: '劫持检测-编辑', name: 'HijackDetectionEdit' },
          ],
          permissionCodes: ['domain:view'],
        },
      },
      {
        path: 'hijackDetectionView',
        name: 'HijackDetectionView',
        component: defineAsyncComponent(() => import('~/views/domainManagement/views/hijackDetection/overviewPage')),
        meta: {
          title: '劫持检测-任务详情',
          hidden: true,
          headerHidden: true,
          level: 3,
          highlightMenuName: 'DetectionClassification',
          breadcrumbConfig: [
            { label: '检测分类', name: 'HijackDetection' }, // 这里的路由名称要确认
            { label: '劫持检测-任务详情', name: 'HijackDetectionView' },
          ],
          permissionCodes: ['domain:view'], // 权限点要确认
        },
      },
      {
        path: 'dnsInspectCreate',
        name: 'DnsInspectCreate',
        component: defineAsyncComponent(() => import('~/views/domainManagement/views/dnsInspect/detail/index')),
        meta: {
          title: 'DNS检测-新增',
          hidden: true,
          headerHidden: true,
          level: 3,
          highlightMenuName: 'DetectionClassification',
          breadcrumbConfig: [
            { label: '检测分类', name: 'DnsInspect' },
            { label: 'DNS检测-新增', name: 'DnsInspectCreate' },
          ],
          permissionCodes: ['domain:view'],
        },
      },
      {
        path: 'dnsInspectEdit',
        name: 'DnsInspectEdit',
        component: defineAsyncComponent(() => import('~/views/domainManagement/views/dnsInspect/detail/index')),
        meta: {
          title: 'DNS检测-编辑',
          hidden: true,
          headerHidden: true,
          level: 3,
          highlightMenuName: 'DetectionClassification',
          breadcrumbConfig: [
            { label: '检测分类', name: 'DnsInspect' },
            { label: 'DNS检测-编辑', name: 'DnsInspectEdit' },
          ],
          permissionCodes: ['domain:view'],
        },
      },
      {
        path: 'dnsInspectOverview',
        name: 'DnsInspectOverview',
        component: defineAsyncComponent(() => import('~/views/domainManagement/views/dnsInspect/overviewPage')),
        meta: {
          title: 'DNS检测-任务详情',
          hidden: true,
          headerHidden: true,
          level: 3,
          highlightMenuName: 'DetectionClassification',
          breadcrumbConfig: [
            { label: '检测分类', name: 'DnsInspect' }, // 这里的路由名称要确认
            { label: 'DNS检测-任务详情', name: 'DnsInspectOverview' },
          ],
          permissionCodes: ['domain:view'], // 权限点要确认
        },
      },
      {
        path: 'domainDetail',
        name: 'DomainDetail',
        component: defineAsyncComponent(() => import('~/views/domainManagement/views/domainInspect/overviewPage')),
        meta: {
          title: '历史快照',
          hidden: true,
          headerHidden: true,
          level: 3,
          highlightMenuName: 'DetectionClassification',
          breadcrumbConfig: [
            { label: '检测分类', name: 'DomainInspect' }, // 这里的路由名称要确认
            { label: '域名过期检测-任务详情', name: 'DomainDetail' },
          ],
          permissionCodes: ['domain:view'],
        },
      },
      {
        path: 'sslDetail',
        name: 'SslDetail',
        component: defineAsyncComponent(() => import('~/views/domainManagement/views/sslInspect/overviewPage')),
        meta: {
          title: '历史快照',
          hidden: true,
          headerHidden: true,
          level: 3,
          highlightMenuName: 'DetectionClassification',
          breadcrumbConfig: [
            { label: '检测分类', name: 'SslInspect' }, // 这里的路由名称要确认
            { label: 'SSL过期检测-任务详情', name: 'SslDetail' },
          ],
          permissionCodes: ['domain:view'],
        },
      },
      {
        path: 'inspectionWallDetail',
        name: 'InspectionWallDetail',
        component: defineAsyncComponent(() => import('@/views/domainManagement/views/inspectionWall/overviewPage')),
        meta: { 
          title: '被墙检测-历史快照', 
          hidden: true,
          headerHidden: true,
          level: 3,
          highlightMenuName: 'DetectionClassification',
          permissionCodes: ['domain:view'],
          breadcrumbConfig: [
            { label: '检测分类', name: 'InspectionWall' },
            { label: '被墙检测-任务详情', name: 'InspectionWallDetail' },
          ],
        },
      },
      {
        path: 'inspectionPollutionDetail',
        name: 'InspectionPollutionDetail',
        component: defineAsyncComponent(() => import('~/views/domainManagement/views/inspectionPollution/overviewPage')),
        meta: { 
          title: '污染检测-历史快照', 
          hidden: true,
          headerHidden: true,
          level: 3,
          highlightMenuName: 'DetectionClassification',
          permissionCodes: ['domain:view'],
          breadcrumbConfig: [
            { label: '检测分类', name: 'InspectionPollution' },
            { label: '污染检测-任务详情', name: 'InspectionPollutionDetail' },
          ],
        },
      },
      {
        path: 'inspectionICPDetail',
        name: 'InspectionICPDetail',
        component: defineAsyncComponent(() => import('~/views/domainManagement/views/inspectionICP/overviewPage')),
        meta: {
          title: 'ICP检测-历史快照', 
          hidden: true,
          headerHidden: true,
          level: 3,
          highlightMenuName: 'DetectionClassification',
          permissionCodes: ['domain:view'],
          breadcrumbConfig: [
            { label: '检测分类', name: 'InspectionICP' },
            { label: 'ICP检测-任务详情', name: 'InspectionICPDetail' },
          ],
        },
      },
    ],
  },
] as IRouteRecordRaw[]
