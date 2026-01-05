import { ElMessage } from 'element-plus'

import type { Ref } from 'vue'
import type { IExpose } from '~/businessComponents/commonPage'

/** 批量操作公共action */
export const commonAction = async (actionItem: Record<string, any>, testIds: string[], commonPageRef: Ref<IExpose>) => {
  try {
    if (!testIds?.length) {
      ElMessage({
        message: '至少选择一条数据',
        type: 'warning',
      })
      return
    }
    await actionItem?.api({ testIds: testIds })
    ElMessage({
      message: `${actionItem?.batchText}成功`,
      type: 'success',
    })
    commonPageRef.value?.query()
  } catch (error) {
    console.error(`${actionItem?.batchText}测试失败，失败原因：${error}`)
  }
}
