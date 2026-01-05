import path from 'path-browserify'

import type { RouteRecordNameGeneric } from 'vue-router'
import type { IRouteRecordRaw } from '~/interfaces/common'

/**
 * 使用 meta.role 来确定当前用户是否具有权限
 * @param roles
 * @param route
 */
export const hasPermission = (roles: string[], route: IRouteRecordRaw) => (
  route?.meta?.permissionCodes
    ? roles.some((role) => (route.meta.permissionCodes as string[]).includes(role))
    : false
)

/**
 * 通过递归过滤异步路由表
 * @param routes asyncRoutes
 * @param roles
 */
export const filterAsyncRoutes = (routes: IRouteRecordRaw[], roles: string[]) => {
  const res = []
  routes.forEach((route) => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })
  return res
}

/** 筛选需要缓存的路由 */
export const filterKeepAlive = (routers: IRouteRecordRaw[]) => {
  const cacheRouter: RouteRecordNameGeneric[] = []
  const deep = (routers: IRouteRecordRaw[]) => {
    routers.forEach((item) => {
      if (item.meta?.keepAlive && item.name) {
        cacheRouter.push(item.name)
      }
      if (item.children && item.children.length) {
        deep(item.children)
      }
    })
  }
  deep(routers)
  return cacheRouter
}

export const handleRoutes = (routers: IRouteRecordRaw[], pathUrl: string = '') => {
  routers.forEach((item) => {
    item.path = path.resolve(pathUrl, item.path)
  })
}
