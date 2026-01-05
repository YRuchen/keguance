/** 方块数据 */
export interface IBlock {
  /** 唯一标识 */
  id: number
  /** 初始数据 */
  value: string
  /** 是否只读（用于快速筛查的方块） */
  readonly?: boolean
  /** 快速筛查的标题key（用于删除时重新选中） */
  fastFilterKey?: string
  /** 快速筛查的选项名称列表（用于删除时重新选中） */
  fastFilterItemNames?: string[]
  /** 快速筛查的选项名称（用于删除时重新选中，已废弃，保留用于兼容） */
  fastFilterItemName?: string
  /** 快速筛查的选项keys（用于删除时重新选中，已废弃，保留用于兼容） */
  fastFilterValues?: string[]
}
