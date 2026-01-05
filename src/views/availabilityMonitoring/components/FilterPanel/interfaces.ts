/** checkboxGroup的schema */
export interface ISchema {
  /** 标题 */
  label: string
  /** 全选 */
  isAllChecked: boolean
  /** 选中部分 */
  isHalfChecked: boolean
  /** 列表全量值 */
  children: Record<'label' | 'value' | 'num', string>[]
  /** 选中值 */
  selectedValues: string[]
}

/** checkboxGroup列表的schema */
export type ICheckBoxGroupsSchema = ISchema[]

/** expose */
export interface IExpose {
  /** 忽略下一次watch */
  ignoreNextWatch: () => void
}
