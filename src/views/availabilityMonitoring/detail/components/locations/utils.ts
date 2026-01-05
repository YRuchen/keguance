import { Type, TypeKey, valueKey } from './constants'

import type { Ref, ComputedRef } from 'vue'
import type { 
  ILocations,
  ILocationItem, 
  ISelectedData,
} from './interfaces'

/** 获取状态检查函数 */
export const getUtils = (locations: Ref<ILocations>, allLocations: ComputedRef<ISelectedData>) => {
  return {
    /** 运营商选中状态检查【运营商节点和all节点】 */
    ispNodeOnCheck(curItem: ILocationItem, type: Type) {
      /** 因为运营商的唯一值是asn，其余的叶子节点唯一值是regionId，所以在这里如果要把运营商模拟为叶子结点的话，需要把asn填进regionId */
      const key = TypeKey[type]
      const target = locations.value.all?.children.find(v => v[key] === curItem[key]) // 当前节点
      const index = locations.value.all?.selectedChildren.findIndex(v => v === target[valueKey]) // 当前节点在selectedChildren中的下标
      const sameAsnLeafs = allLocations.value.children.filter(v => v[key] === target[key]) // 所有本运营商的leaf节点
      const selectedLeafs = sameAsnLeafs.filter(v => allLocations.value.selectedChildren.includes(v[valueKey])) // 本运营商中被选中的leaf节点
      if (!selectedLeafs?.length) {
        target.isAllChecked = false
        target.isHalfChecked = false
        if (locations.value.all?.selectedChildren.includes(target[valueKey])) {
          locations.value.all?.selectedChildren.splice(index, 1)
        }
      } else if (selectedLeafs.length > 0 && selectedLeafs?.length < sameAsnLeafs.length) {
        target.isAllChecked = false
        target.isHalfChecked = true
        if (locations.value.all?.selectedChildren.includes(target[valueKey])) {
          locations.value.all?.selectedChildren.splice(index, 1)
        }
      } else if (selectedLeafs.length === sameAsnLeafs.length) {
        target.isAllChecked = true
        target.isHalfChecked = false
        if (!locations.value.all?.selectedChildren.includes(target[valueKey])) {
          locations.value.all?.selectedChildren.push(target[valueKey])
        }
      }
    },
    /** 组节点选中状态检查 */
    groupNodeOnCheck (curItem: ILocationItem, type: Type) {
      const key = TypeKey[type]
      const target = locations.value[curItem[key]]
      if (!target.selectedChildren?.length) {
        target.isAllChecked = false
        target.isHalfChecked = false
      } else if (target.selectedChildren?.length > 0 && target.selectedChildren?.length < target.children.length) {
        target.isAllChecked = false
        target.isHalfChecked = true
      } else if (target.selectedChildren?.length === target.children.length) {
        target.isAllChecked = true
        target.isHalfChecked = false
      }
    },
    /** 全选节点选中状态检查 */
    allNodeOnCheck () {
      if (!allLocations.value.selectedChildren.length) {
        locations.value.all.isAllChecked = false
        locations.value.all.isHalfChecked = false
      } else if (allLocations.value.selectedChildren.length > 0 && allLocations.value.selectedChildren.length < allLocations.value.children.length) {
        locations.value.all.isAllChecked = false
        locations.value.all.isHalfChecked = true
      } else if (allLocations.value.selectedChildren.length === allLocations.value.children.length) {
        locations.value.all.isAllChecked = true
        locations.value.all.isHalfChecked = false
      }
    },
    /** 调用组节点/运营商节点/全选节点的onCheck */
    dispatchAllNodesOnCheck () {
      ;(locations.value.all?.children || []).forEach(v => v.onCheck())
      Object.entries(locations.value).forEach(([k, v]) => v.onCheck())
    }
  }
}
