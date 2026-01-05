import { formEffectsMap, fieldEffectsMap } from './constants'

import type { Form } from '@formily/core'

/** formilyFormExpose */
export type IFormilyFormExpose = {
  /** form实例 */
  formRef: Form
  /** 获取container容器 */
  getContainerRef: () => HTMLElement
}

/** formEffectsMap【formily api】 */
export type IFormEffects = {
  [K in keyof typeof formEffectsMap]?: typeof formEffectsMap[K]
}

/** fieldEffectsMap【formily api】 */
export type IFieldEffect = {
  [K in keyof typeof fieldEffectsMap]?: typeof fieldEffectsMap[K]
}

/** IFieldEffectHooks【组件自定义】 */
export interface IFieldEffects {
  [K: string]: IFieldEffect
}

/** effectHooks【组件自定义】 */
export interface IEffectHooks {
  /** IFormEffectHooks */
  formEffects?: IFormEffects
  /**  IFieldEffectHooks */
  fieldEffects?: IFieldEffects
}
