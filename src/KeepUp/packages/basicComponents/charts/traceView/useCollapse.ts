import { ref } from 'vue'

import type { IUseCollapseExpose } from './interfaces'

export const useCollapse = (): IUseCollapseExpose => {
  /** 所有收起的span的id */
  const collapsedSpanIds = ref<Set<string>>(new Set([]))
  /** 切换span展开收起 */
  const toggleSpanCollapse = ({ spanId }: Record<'spanId', string>) => {
    const operator = collapsedSpanIds.value.has(spanId) ? 'delete' : 'add'
    collapsedSpanIds.value[operator]?.(spanId)
  }
  return {
    collapsedSpanIds,
    toggleSpanCollapse,
  }
}
