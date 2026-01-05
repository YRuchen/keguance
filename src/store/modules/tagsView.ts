import { ref } from 'vue'
import { defineStore } from 'pinia'
import router from '~/routers'

export const useTagsViewStore = defineStore('tagsViewState', () => {
  const activeTabsValue = ref('/controlPanel/dashBoard') // 选中态tab
  const visitedViews = ref<Record<string, any>[]>([]) // 访问过的页面
  const cachedViews = ref<Record<string, any>[]>([]) // keep-alive缓存的页面
  /** 设置选中态tab */
  const setTabsMenuValue = (val: string) => {
    activeTabsValue.value = val
  }
  /** 设置选中态tab，将当前页面存入历史记录 */
  const addVisitedView = (view: Record<string, any>) => {
    setTabsMenuValue(view.path)
    if (visitedViews.value.some((v) => v.path === view.path)) {
      return
    }
    const target = Object.assign({}, view, {
      title: view.meta?.title || 'no-name',
    })
    visitedViews.value.push(target)
    view.meta?.keepAlive && cachedViews.value.push(target)
  }
  /** 新增页面 */
  const addView = (view: Record<string, any>) => {
    addVisitedView(view)
  }
  /** 从历史页面中删除多个指定页面 */
  const removeView = (paths: string[]) => {
    return new Promise((resolve) => {
      visitedViews.value = visitedViews.value.filter((item) => !paths.includes(item.path))
      resolve(null)
    })
  }
  /** 删除单个历史页面，affix类型无法删除 */
  const delVisitedView = (path: string) => {
    const handler = (v: Record<string, any>) => v.path !== path || v.meta.affix
    return new Promise((resolve) => {
      visitedViews.value = visitedViews.value.filter(handler)
      cachedViews.value = cachedViews.value.filter(handler)
      resolve([...visitedViews.value])
    })
  }
  /** 删除单个缓存页面，affix类型无法删除 */
  const delCachedView = (path: string) => {
    const handler = (v: Record<string, any>) => v.path !== path || v.meta.affix
    return new Promise((resolve) => {
      visitedViews.value = visitedViews.value.filter(handler)
      cachedViews.value = cachedViews.value.filter(handler)
      resolve([...cachedViews.value])
    })
  }
  /** 删除指定页面 */
  const delView = (activeTabPath: string) => {
    return new Promise((resolve) => {
      delVisitedView(activeTabPath)
      delCachedView(activeTabPath) // TODO: 很奇怪
      resolve({
        visitedViews: [...visitedViews.value],
        cachedViews: [...cachedViews.value],
      })
    })
  }
  /** 当前页面被删除后，跳转到最近的一个能用的历史页面上，向后的优先。 */
  const toLastView = (activeTabPath: string) => {
    const index = visitedViews.value.findIndex((item) => item.path === activeTabPath)
    const nextTab = visitedViews.value[index + 1] || visitedViews.value[index - 1]
    if (!nextTab) return
    router.push(nextTab.path)
    addVisitedView(nextTab)
  }
  /** 删除所有非affix页面 */
  const delAllViews = () => {
    return new Promise((resolve) => {
      visitedViews.value = visitedViews.value.filter((v) => v.meta.affix)
      cachedViews.value = visitedViews.value.filter((v) => v.meta.affix)
      resolve([...visitedViews.value])
    })
  }
  /** 删除所有非affix页面 */
  const clearVisitedView = () => {
    delAllViews()
  }
  /** 删除其余页面，affix类型无法删除 */
  const delOtherViews = (path: string) => {
    const handler = (v: Record<string, any>) => v.path === path || v.meta.affix
    visitedViews.value = visitedViews.value.filter(handler)
    cachedViews.value = visitedViews.value.filter(handler)
  }
  /** 回到首页 */
  const goHome = () => {
    activeTabsValue.value = '/controlPanel/dashBoard'
    router.push({ path: '/controlPanel/dashBoard' })
  }
  /** 更新指定页面 */
  const updateVisitedView = (view: any) => {
    for (let i = 0; i < visitedViews.value.length; i++) {
      if (visitedViews.value[i].path === view.path) {
        visitedViews.value[i] = Object.assign(visitedViews.value[i], view)
        break
      }
    }
  }
  return {
    activeTabsValue,
    visitedViews,
    cachedViews,
    setTabsMenuValue,
    addView,
    removeView,
    addVisitedView,
    delView,
    toLastView,
    delVisitedView,
    delCachedView,
    clearVisitedView,
    delAllViews,
    delOtherViews,
    goHome,
    updateVisitedView,
  }
})
