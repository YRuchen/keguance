import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { customRoutes, basicRoutes, notFoundRouter } from '~/routers/index'
import { filterAsyncRoutes, filterKeepAlive } from '~/utils/routers'

import type { RouteRecordNameGeneric } from 'vue-router'
import type { IRouteRecordRaw } from '~/interfaces/common'

export const usePermissionStore = defineStore('permissionState', () => {
  const routes = ref<IRouteRecordRaw[]>([])
  const addRoutes = ref<IRouteRecordRaw[]>([])
  const cacheRoutes = ref<RouteRecordNameGeneric[]>([])
  const permissionRoutes = computed(() => routes.value)
  const keepAliveRoutes = computed(() => filterKeepAlive(customRoutes))
  function generateRoutes(roles: string[]) {
    return new Promise<any[]>((resolve) => {
      let accessedRoutes: any[]
      if (roles && roles.length && !roles.includes('admin')) {
        accessedRoutes = filterAsyncRoutes(customRoutes, roles)
      } else {
        accessedRoutes = customRoutes || []
      }
      accessedRoutes = accessedRoutes.concat(notFoundRouter)

      routes.value = basicRoutes.concat(accessedRoutes)
      addRoutes.value = accessedRoutes
      resolve(accessedRoutes)
    })
  }
  function clearRoutes() {
    routes.value = []
    addRoutes.value = []
    cacheRoutes.value = []
  }
  function getCacheRoutes() {
    cacheRoutes.value = filterKeepAlive(customRoutes)
    return cacheRoutes.value
  }
  return {
    routes,
    addRoutes,
    cacheRoutes,
    permissionRoutes,
    keepAliveRoutes,
    generateRoutes,
    clearRoutes,
    getCacheRoutes,
  }
})
