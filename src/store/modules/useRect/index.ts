import { ref } from 'vue'
import { defineStore } from 'pinia'

import type { IRes } from './interfaces'

/** 全局几何信息 */
export const useRect = defineStore('useRect', (): IRes => {
  /** app header */
  const appHeight = ref(0)
  /** header height */
  const headerHeight = ref(0)
  return {
    headerHeight,
    appHeight,
  }
})
