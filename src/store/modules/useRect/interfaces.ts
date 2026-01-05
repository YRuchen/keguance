import type { Ref } from 'vue'

/** 全局几何信息Store出参 */
export interface IRes {
  /** header height */
  headerHeight: Ref<number>
  /** app height */
  appHeight: Ref<number>
}