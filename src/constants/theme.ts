/** 布局模式 */
export enum LayoutType {
  /** 纵向 */
  VERTICAL = 'vertical',
  /** 横向 */
  HORIZONTAL = 'horizontal',
  /** 分栏 */
  COLUMNS = 'columns',
}

/** 布局模式 */
export const layoutTypeOptions = [
  { label: '纵向', value: LayoutType.VERTICAL },
  { label: '横向', value: LayoutType.HORIZONTAL },
  { label: '分栏', value: LayoutType.COLUMNS },
]
