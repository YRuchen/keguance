import { computed, ref, watch } from 'vue'
import { COLOR_MAP } from './constants'

import type { Ref, ComputedRef } from 'vue'
import type { ISpanItem, IVisibleDataItem, IUseVisibleDataExpose } from './interfaces'

const deepGenerateTreeList = (
  /** 当前层级的items */
  curDepthItems: Ref<ISpanItem[]>, 
  /** 最终的全量列表 */
  sortedItems: Ref<IVisibleDataItem[]>, 
  /** 最终的全量列表之外的items */
  otherItems: ComputedRef<ISpanItem[]>, 
  /** 当前层级 */
  depth: number,
  /** 折叠的span的id */
  collapsedSpanIds: Ref<Set<string>>,
  /** 服务名到颜色的映射表 */
  serviceMap: ComputedRef<Map<string, string>>,
) => {
  /** 当前层级的item */
  const curDepthItem2 = ref<ISpanItem[]>([])
  curDepthItems.value.map(v => {
    /** 父节点下标 */
    const parentItemIndex = sortedItems.value.findIndex(v1 => v1?.span?.spanID === v?.spanID)
    /** 子节点 */
    const leafItem = otherItems.value.filter(v1 => v1.parentSpanID === v.spanID)
    if (leafItem.length) {
      curDepthItem2.value.push(...leafItem)
      sortedItems.value[parentItemIndex].hasChildren = true
      /** 向父节点后追加子节点 */
      sortedItems.value.splice(parentItemIndex + 1, 0, ...leafItem.map(v => {
        const collapsed = collapsedSpanIds.value.has(v.spanID)
        return {
          color: serviceMap.value.get(v.serviceName),
          collapsed,
          depth,
          hasChildren: false, // 初始false，后续添加chidlren时更新为true
          span: v,
        }
      }))
    }
  })
  if (curDepthItem2.value?.length) {
    deepGenerateTreeList(
      curDepthItem2 as Ref<ISpanItem[]>, 
      sortedItems, 
      otherItems,
      depth + 1,
      collapsedSpanIds,
      serviceMap,
    )
  }
}

// TODO: 优化逻辑
export const useVisibleData = (
  data: Ref<ISpanItem[]> = ref([]),
  collapsedSpanIds: Ref<Set<string>>,
): IUseVisibleDataExpose => {
  const serviceMap = computed(() => {
    const res = new Set(data.value.map(v => v.serviceName))
    return new Map(Array.from(res).map((v, i) => ([v, COLOR_MAP[i]])))
  })
  const handler = (parentSpanID: string = ''): Ref<IVisibleDataItem[]> => {
    /** 已经排好序的item，最终结果 */
    const sortedItems = ref<IVisibleDataItem[]>([]) 
    /** 当前层级的item */
    const curDepthItems = ref<ISpanItem[]>([])
    /** 余下的item */
    const otherItems = computed(() => data.value.filter(v => !sortedItems.value.map(v => v.span.spanID).includes(v.spanID)))
    if (!parentSpanID) {
      const res = data.value.find(v => !v.parentSpanID)
      if (!res) {
        return
      }
      const collapsed = collapsedSpanIds.value.has(res.spanID)
      /** 更新【已经排好序的item】 */
      sortedItems.value.push({
        color: serviceMap.value.get(res.serviceName),
        collapsed,
        depth: 1,
        hasChildren: false, // 初始false，后续添加chidlren时更新为true
        span: res,
      })
      /** 更新【当前层级的item】 */
      curDepthItems.value.push(res)
    }

    curDepthItems.value.length && deepGenerateTreeList(
      curDepthItems as Ref<ISpanItem[]>, 
      sortedItems as Ref<IVisibleDataItem[]>, 
      otherItems, 
      2,
      collapsedSpanIds,
      serviceMap,
    )

    /** 折叠处理 */
    const visibleData = computed<IVisibleDataItem[]>(() => {
      /** 
       * 遇到折叠后，记录当前折叠层级，后续item层级比当前层级深，则统一不渲染在列表中。
       * 遇到层级浅的item，则将当前折叠层级置为null，等待下一轮计算。
       */
      /** 当前折叠的层级 */
      let curCollapsedDepth = null
      const result: IVisibleDataItem[] = []
      sortedItems.value.forEach(v => {
        const collapsed = collapsedSpanIds.value.has(v.span.spanID)
        if (!curCollapsedDepth || v.depth < curCollapsedDepth) {
          curCollapsedDepth = null
          result.push({
            ...v,
            collapsed: collapsed,
          } as IVisibleDataItem)
        }
        if (collapsed) {
          curCollapsedDepth = v.depth + 1
        }
      })
      return result
    })
    return visibleData as Ref<IVisibleDataItem[]>
  }
  const visibleData = ref([])
  watch(() => [data.value, collapsedSpanIds.value], () => {
    visibleData.value = handler()?.value
  }, { immediate: true, deep: true })
  return {
    visibleData
  }
}
