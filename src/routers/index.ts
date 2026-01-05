/**
 * @description: 路由参数介绍
 * path ==> 路由路径
 * name ==> 路由名称
 * component ==> 路由组件
 * redirect ==> 路由重定向
 * alwaysShow ==> 如果设置为true，将始终显示根菜单，无论其子路由长度如何
 * hidden ==> 如果“hidden:true”不会显示在侧边栏中（默认值为false）
 * highlightMenuName ==> 强制指定高亮菜单NAME
 * keepAlive ==> 设为true 缓存
 * meta ==> 路由元信息
 * meta.title ==> 路由标题
 * meta.icon ==> 菜单icon
 * meta.affix ==> 如果设置为true将会出现在 标签栏中
 * meta.breadcrumb ==> 如果设置为false，该项将隐藏在breadcrumb中（默认值为true）
 */
import { defineAsyncComponent } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { qiankunWindow } from 'vite-plugin-qiankun/dist/helper'
import { MICRO_APP_ROUTE } from '~/constants/qiankun'
import {
  controlPanel,
  domainManagement,
  availabilityMonitoring,
  logs,
  trace,
  monitorsPanel,
  system,
  metrics,
  configManagement,
  reportCenter,
} from './modules'

import type { IRouteRecordRaw } from '~/interfaces/common'

export const customRoutes: IRouteRecordRaw[] = [
  ...domainManagement,
  ...availabilityMonitoring,
  ...logs,
  ...configManagement,
  ...trace,
  ...controlPanel,
  ...system,
  ...metrics,
  ...monitorsPanel,
  ...reportCenter,
]
export const basicRoutes: IRouteRecordRaw[] = [
  {
    path: '/404',
    name: '404',
    component: defineAsyncComponent(() => import('~/config/fragments/errorPages/404.vue')),
    meta: { title: '404', hidden: true },
  },
  {
    path: '/403',
    name: '403',
    component: defineAsyncComponent(() => import('~/config/fragments/errorPages/403.vue')),
    meta: { title: '403', hidden: true },
  },
  {
    path: '/login',
    name: 'Login',
    component: defineAsyncComponent(() => import('~/views/login/index.vue')),
    meta: { title: 'Login', hidden: true },
  },
  {
    path: '/register',
    name: 'register',
    component: defineAsyncComponent(() => import('~/views/login/index.vue')),
    meta: { title: 'register', hidden: true },
  },
  {
    path: '/resetPsw',
    name: 'resetPsw',
    component: defineAsyncComponent(() => import('~/views/login/resetPsw.vue')),
    meta: { title: 'resetPsw', hidden: true },
  },
  {
    path: '/',
    name: 'Layout',
    component: defineAsyncComponent(() => import('~/layout')),
    redirect: '/domainManagement/checkResults',
    children: [],
  },
]

export const notFoundRouter: IRouteRecordRaw = {
  path: '/:pathMatch(.*)',
  name: 'notFound',
  redirect: '/404',
}
export default createRouter({
  history: createWebHistory(
    qiankunWindow.__POWERED_BY_QIANKUN__ ? MICRO_APP_ROUTE : import.meta.env.BASE_URL,
  ),
  routes: basicRoutes,
})
