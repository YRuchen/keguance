import type { Ref, ComputedRef } from 'vue'
import type { ILocationItem as ILocationItemDTO } from '~/api/availabilityMonitoring/interfaces'
import type { Type } from './constants'

/** props */
export interface IProps {
  /** value */
  value: string[]
}

/** useLocations出参 */
export interface IUseLocationsRes {
  /** 格式化后的位置数据 */
  locations: Ref<ILocations>
  /** 所有选中的和可选的leaf节点 */
  allLocations: ComputedRef<ISelectedData>
}

/** 位置（接口数据） */
export type ILocationItem = ILocationItemDTO

/** 转换后数据 */
/** 叶子节点 */
export interface ILeafNode extends Partial<ILocationItem> {
  /** 标题 */
  label: string
  /** 是否选中（废弃） */
  selected: boolean
  /** 节点类型 */
  type: Type.IS_LEAF
  /** 子节点 */
  children: []
  /** 选中的子节点 */
  selectedChildren: []
  /** 选中状态改变 */
  onChange: () => void
}

/** 根节点 */
interface IBasicGroupNode extends Partial<Omit<ILocationItem, 'nodeId' | 'regionName' | 'subdivision' | 'city' | 'ispName' | 'friendlyArea'>> {
  /** 标题 */
  label: string
  /** 选中部分 */
  isHalfChecked: boolean
  /** 全选 */
  isAllChecked: boolean
  /** 节点类型 */
  type: Type
  /** 子节点 */
  children: ILeafNode[]
  /** 选中的子节点 */
  selectedChildren: string[]
  /** 根据子节点选中状态，检查更新自身的选中状态 */
  onCheck: () => void
  /** 选中状态手动改变 */
  onChange: (p?: any) => void
}

/** 叶子节点的父节点（唯一） */
export interface IGroupNode extends IBasicGroupNode {
  /** 节点类型 */
  type: Type.IS_GROUP
}

/** 运营商节点 */
export interface IIspNode extends IBasicGroupNode {
  type: Type.IS_ISP
}

/** 全选节点 */
export interface IAllNode extends Omit<IBasicGroupNode, 'children'> {
  type: Type.IS_ALL
  /** 子节点 */
  children: IIspNode[]
}

/** 用于渲染的数据结构 */
export type ILocations = {
  all?: IAllNode
} & {
  [K in Exclude<string, 'all'>]: IGroupNode
}
/** 转换后数据 */

/** 不同维度归类的数据Map */
export interface ISelectedData {
  /** 所有可选的叶子结点 */
  children: ILeafNode[]
  /** 所有选中的叶子结点 */
  selectedChildren: string[]
}