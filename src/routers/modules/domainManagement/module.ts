import { h, defineAsyncComponent } from 'vue'
import { IconFont } from '~/KeepUp'
import { HeaderMode } from '../../constants'

import type { IRouteRecordRaw } from '~/interfaces/common'

const commonStyle = { color: '#fff', textShadow: '0 0 6px #007DFF' }
export const modules: IRouteRecordRaw[] = [
  {
    path: 'hijackDetection',
    name: 'HijackDetection',
    component: defineAsyncComponent(() => import('~/views/domainManagement/views/hijackDetection')),
    meta: { 
      title: '劫持检测', 
      headerHidden: true,
      level: 3,
      highlightMenuName: 'DetectionClassification',
      headerMode: HeaderMode.SUBMENU,
      permissionCodes: ['domain:view'],
      icon: h(IconFont, { name: 'brightness_alert', style: commonStyle }),
    },
  },
  {
    path: 'dnsInspect',
    name: 'DnsInspect',
    component: defineAsyncComponent(() => import('~/views/domainManagement/views/dnsInspect')),
    meta: { 
      title: 'DNS检测', 
      headerHidden: true,
      level: 3,
      highlightMenuName: 'DetectionClassification',
      headerMode: HeaderMode.SUBMENU,
      permissionCodes: ['domain:view'],
      icon: h(IconFont, { name: 'dns', style: commonStyle }),
    },
  },
  {
    path: 'domainInspect',
    name: 'DomainInspect',
    component: defineAsyncComponent(() => import('~/views/domainManagement/views/domainInspect')),
    meta: { 
      title: '域名过期检测', 
      headerHidden: true,
      level: 3,
      highlightMenuName: 'DetectionClassification',
      headerMode: HeaderMode.SUBMENU,
      permissionCodes: ['domain:view'],
      icon: h(IconFont, { name: 'domain_verification_off', style: commonStyle }),
    },
  },
  {
    path: 'sslInspect',
    name: 'SslInspect',
    component: defineAsyncComponent(() => import('~/views/domainManagement/views/sslInspect')),
    meta: { 
      title: 'SSL过期检测', 
      headerHidden: true,
      level: 3,
      highlightMenuName: 'DetectionClassification',
      headerMode: HeaderMode.SUBMENU,
      permissionCodes: ['domain:view'],
      icon: h(IconFont, { name: 'calendar_clock', style: commonStyle }),
    },
  },
  {
    path: 'inspectionWall',
    name: 'InspectionWall',
    component: defineAsyncComponent(() => import('~/views/domainManagement/views/inspectionWall')),
    meta: { 
      title: '被墙检测', 
      headerHidden: true,
      level: 3,
      highlightMenuName: 'DetectionClassification',
      headerMode: HeaderMode.SUBMENU, 
      permissionCodes: ['domain:view'],
      icon: h(IconFont, { name: 'brick', style: commonStyle }),
    },
  },
  {
    path: 'inspectionPollution',
    name: 'InspectionPollution',
    component: defineAsyncComponent(() => import('~/views/domainManagement/views/inspectionPollution')),
    meta: { 
      title: '污染检测', 
      headerHidden: true,
      level: 3,
      highlightMenuName: 'DetectionClassification',
      headerMode: HeaderMode.SUBMENU, 
      permissionCodes: ['domain:view'],
      icon: h(IconFont, { name: 'health_and_safety', style: commonStyle }),
    },
  },
  {
    path: 'inspectionICP',
    name: 'InspectionICP',
    component: defineAsyncComponent(() => import('~/views/domainManagement/views/inspectionICP')),
    meta: { 
      title: 'ICP检测', 
      headerHidden: true,
      level: 3,
      highlightMenuName: 'DetectionClassification',
      headerMode: HeaderMode.SUBMENU,
      permissionCodes: ['domain:view'],
      icon: h(IconFont, { name: 'bookmark_manager', style: commonStyle }),
    },
  },
]
