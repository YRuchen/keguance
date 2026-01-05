import { ref, computed, watch } from 'vue'
import { isEmpty, isEqual } from 'lodash'
import { getUtils } from './utils'
import { Type, TypeKey, valueKey } from './constants'

import type { 
  IProps,
  IUseLocationsRes,
  ILocationItem, 
  IAllNode,
  IIspNode,
  IGroupNode,
  ILeafNode,
  ILocations,
  ISelectedData,
} from './interfaces'

export const useLocations = (props: IProps): IUseLocationsRes => {
  const locations = ref<ILocations>({})
  /** 获取所有选中的和可选的leaf节点 */
  const allLocations = computed<ISelectedData>(() => {
    return Object.entries(locations.value)
      .filter(([k]) => k !== 'all')
      .reduce((iniVal, [_, v]) => ({
        selectedChildren: [...iniVal.selectedChildren, ...((v as unknown as ILeafNode).selectedChildren || [])],
        children: [...iniVal.children, ...((v as unknown as ILeafNode).children || [])],
      }), { children: [], selectedChildren: [] } as ISelectedData)
  })
  const {
    ispNodeOnCheck,
    groupNodeOnCheck,
    allNodeOnCheck,
    dispatchAllNodesOnCheck,
  } = getUtils(locations, allLocations)
  /** 格式化locations */
  const formatLocations = (curLocations: ILocationItem[] = []): ILocations => {
    const getLeafNode = (curItem: ILeafNode): ILeafNode => ({
      ...curItem,
      label: curItem.friendlyArea,
      selected: false,
      type: Type.IS_LEAF,
      children: [],
      selectedChildren: [],
      onChange: () => {
        console.log(`【🔧 点击】节点类型：叶子节点。动作: 手动切换【${curItem.friendlyArea}】地区的选中状态。`)
        dispatchAllNodesOnCheck()
      },
    })
    return curLocations.reduce((initVal, curItem) => {
      // 按regionName分组
      if (curItem[TypeKey[Type.IS_LEAF]] in initVal) {
        initVal[curItem[TypeKey[Type.IS_LEAF]]].children?.push?.(getLeafNode(curItem as ILeafNode))
      } else {
        initVal[curItem[TypeKey[Type.IS_GROUP]]] = {
          label: curItem.regionName,
          [TypeKey[Type.IS_GROUP]]: curItem[TypeKey[Type.IS_GROUP]],
          isHalfChecked: false,
          isAllChecked: false,
          type: Type.IS_GROUP,
          children: [getLeafNode(curItem as ILeafNode)],
          selectedChildren: [],
          onCheck: () => {
            console.log(`【🔧 检查】节点类型：组节点。动作: 检查更新【${curItem.regionName}】地区的选中状态`)
            groupNodeOnCheck(curItem, Type.IS_GROUP)
          },
          onChange: (val: boolean) => {
            console.log(`【🔧 点击】节点类型：组节点。动作: 手动切换【${curItem.regionName}】地区的选中状态`)
            locations.value[curItem[TypeKey[Type.IS_GROUP]]].selectedChildren = val
              ? locations.value[curItem[TypeKey[Type.IS_GROUP]]].children.map(v => v[valueKey])
              : []
            /** 调用所有IGroupNode和IIspNode的onCheck */
            dispatchAllNodesOnCheck()
          },
        } as IGroupNode
      }
      // 全选
      if (!('all' in initVal)) {
        initVal['all'] = {
          label: '全选',
          isHalfChecked: false,
          isAllChecked: false,
          type: Type.IS_ALL,
          children: [],
          selectedChildren: [],
          onCheck: () => {
            console.log(`【🔧 检查】节点类型：全选节点。动作: 检查更新全选节点的选中状态`)
            allNodeOnCheck()
          },
          onChange: (val: boolean) => {
            console.log(`【🔧 点击】节点类型：全选节点。动作: 手动切换所有叶子节点的选中状态`)
            Object.entries(locations.value)
              .filter(([k, v]) => k !== 'all')
              .forEach(([k, v]) => {
                v.selectedChildren = val ? (v as IGroupNode).children.map(v1 => v1[valueKey]) : []
              })
            /** 调用所有IGroupNode和IIspNode的onCheck */
            dispatchAllNodesOnCheck()
          },
        } as IAllNode
      }
      // 运营商全选节点【布局方便，所以放进all的children中】
      if (!(initVal['all']?.children || []).find(v => v[TypeKey[Type.IS_ISP]] === curItem[TypeKey[Type.IS_ISP]])) {
        initVal['all']?.children?.push({
          label: curItem.ispName,
          [TypeKey[Type.IS_ISP]]: curItem[TypeKey[Type.IS_ISP]],
          /** 因为运营商的唯一值是asn，其余的叶子节点唯一值是regionId，所以在这里如果要把运营商模拟为叶子结点的话，需要把asn填进regionId */
          [valueKey]: curItem[TypeKey[Type.IS_ISP]], // 用唯一的asn，因为ui中将运营商节点放入leaf节点的位置，所以有了这个key
          isHalfChecked: false,
          isAllChecked: false,
          type: Type.IS_ISP,
          children: [],
          selectedChildren: [],
          onCheck: () => {
            console.log(`【🔧 检查】节点类型：运营商节点。动作: 检查更新【${curItem.ispName}】运营商节点的选中状态`)
            ispNodeOnCheck(curItem, Type.IS_ISP)
          },
          onChange: (val: boolean) => {
            console.log(`【🔧 点击】节点类型：全选节点。动作: 手动切换【${curItem.ispName}】运营商节点的选中状态`)
            Object.entries(locations.value)
              .filter(([k, v]) => k !== 'all')
              .forEach(([k, v]) => {
                v.selectedChildren = val
                  ? (v as IGroupNode).children.filter(v1 => v1[TypeKey[Type.IS_ISP]] === curItem[TypeKey[Type.IS_ISP]]).map(v => v[valueKey])
                  : []
              })
            dispatchAllNodesOnCheck()
          },
        } as IIspNode)
      }
      return initVal
    }, {} as ILocations)
  }
  const init = () => {
    locations.value = formatLocations(props.options as ILocationItem[])
    if (isEmpty(locations.value)) {
      return
    }
    Object.entries(locations.value)
      .filter(([k]) => k !== 'all')
      .map(([_, v]) => {
        const same = v.children.filter(v => props.value.includes(v[valueKey])).map(v => v[valueKey])
        if (same.length) {
          v.selectedChildren = [...v.selectedChildren, ...same]
        }
      })
    dispatchAllNodesOnCheck()
  }
  /** 配合formily的value/change模式 */
  watch(() => [props.options, props.value], (newVal, oldVal) => {
    if (!isEqual(newVal?.[0], oldVal?.[0]) || !isEqual(newVal?.[1], oldVal?.[1])) {
      init()
    }
  }, { immediate: true })
  return {
    locations,
    allLocations,
  }
}
