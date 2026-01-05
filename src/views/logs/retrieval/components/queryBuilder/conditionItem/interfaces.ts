export interface IConditionItemExpose {
  /** 聚焦 */
  focus: (val?: string) => void
  /** 聚焦于末尾 */
  focusToEnd: () => void
  /** 聚焦到指定文本位置 */
  focusToPosition: (offset: number) => void
}
