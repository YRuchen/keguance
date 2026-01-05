import { ref, computed } from 'vue'
import { setOperateBtnsStyle } from './utils'

import type { IUseCollapseParams, IUseCollapseRes } from './interfaces'

export const useCollapse = ({
  formRef,
  collapseData,
}: IUseCollapseParams): IUseCollapseRes => {
  const visible = ref(true) // 展开收起
  const visibleFields = computed(() => visible.value ? collapseData.value.visibleFieldKeys : collapseData.value.allFieldKeys) // 展示字段
  // 展开收起
  const collapse = () => {
    collapseData.value.allFieldKeys.forEach(v => {
      const field = formRef.value.query(v)?.take()
      if (!field) {
        return
      }
      field.display = visibleFields.value.includes(v) ? 'visible' : 'hidden'
    })
    visible.value = !visible.value
    setOperateBtnsStyle(formRef.value, visible.value)
  }
  return {
    visible,
    collapse,
  }
}
