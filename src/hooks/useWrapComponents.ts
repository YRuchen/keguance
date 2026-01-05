// 自定义name的壳的集合
import { h } from 'vue'

import type { VNode } from 'vue'
import type { RouteLocationNormalizedLoadedGeneric } from 'vue-router'

const wrapperMap = new Map()
const commonStyle = {
  flex: '1',
  display: 'flex',
  overflowX: 'hidden',
  width: '100%',
  boxSizing: 'border-box',
}

export const useWrapComponents = (
  Component: VNode, 
  route: RouteLocationNormalizedLoadedGeneric,
): VNode | undefined => {
  if (!Component) {
    return undefined
  }
  const wrapperName = route.name
  const wrapper = wrapperMap.has(wrapperName)
    ? wrapperMap.get(wrapperName)
    : {
      name: wrapperName,
      render() {
        return h('div', {
          className: 'app-main-inner',
          style: commonStyle,
        }, Component)
      },
    }
  if (!wrapperMap.has(wrapperName)) {
    wrapperMap.set(wrapperName, wrapper)
  }
  return h(wrapper, { key: route.path })
}
