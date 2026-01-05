import { ref, watch, nextTick, onMounted } from 'vue'

import { Ref } from 'vue'

export const useLayout = (
  containerRef,
  setterBarRef,
  extraPaneRef,
) => {
  const containerHeight = ref('0px')
  const commonTableRefHeight = ref('0px')
  /** 更新筛选器高度 */
  const updateTableHeight = () => {
    containerHeight.value = containerRef.value.$el.clientHeight
    const table = '15px - 16px - 8px - 24px'
    const setterBarHeight = `${setterBarRef.value?.$el?.clientHeight || 0}px`
    // TODO: 超出一屏时给300px固定高度，暂时解决问题，后续调整
    const numResult = containerRef.value.$el.clientHeight - (extraPaneRef.value?.clientHeight || 0) - (setterBarRef.value?.$el?.clientHeight || 0) - 32 - 8 - 8 - 15 - 16 - 8 - 24
    commonTableRefHeight.value = (numResult > 100) 
      ? `calc(${containerHeight.value}px - 32px - ${extraPaneRef.value?.clientHeight || 0}px - 8px - ${setterBarHeight} - 8px - ${table})` 
      : '300px'
  }
  /** 目标改变则更新ui层 */
  const watchLayout = (target: Ref<any>[] = []) => {
    watch(() => target.map(v => v.value), async () => {
      await nextTick()
      updateTableHeight()
    }, { deep: true })
  }
  onMounted(async() => {
    setTimeout(() => {
      updateTableHeight()
    }, 250)
  })
  return {
    commonTableRefHeight,
    updateTableHeight,
    watchLayout,
  }
}