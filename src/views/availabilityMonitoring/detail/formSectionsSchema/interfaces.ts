import type { Field } from '@formily/core'
import type { ICommonObj } from '@/interfaces/common'

export interface IAssertionItem<T> {
  /** 标题 */
  label: string
  /** 值 */
  value: T
  /** 属性组件 */
  'x-property-component': string | null
  /** 属性组件props */
  'x-property-component-props'?: ICommonObj
  /** 属性枚举 */
  'x-property-enum'?: ICommonObj[]
  /** 属性visible */
  'x-property-visible': boolean | ((p: ICommonObj) => boolean)
  /** 属性 x-reactions */
  'x-property-reactions'?: (field: Field) => void
  /** 操作符组件 */
  'x-operator-component': string | null
  /** 操作符组件props */
  'x-operator-component-props'?: ICommonObj
  /** 操作符枚举 */
  'x-operator-enum'?: ICommonObj[]
  /** 操作符visible */
  'x-operator-visible': boolean | ((p: ICommonObj) => boolean)
  /** 操作符 x-reactions */
  'x-operator-reactions'?: (field: Field) => void
  /** 值组件 */
  'x-value-component'?: string | null
  /** 值组件props */
  'x-value-component-props'?: ICommonObj
  /** 值枚举 */
  'x-value-enum'?: ICommonObj[]
  /** 值visible */
  'x-value-visible': boolean | ((p: ICommonObj) => boolean)
  /** 值content */
  'x-value-content'?: string
  /** 值 x-reactions */
  'x-value-reactions'?: (field: Field) => void
}
