import { ref, reactive, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { key } from './constants'

import type { IUsePaginationParams, IUsePaginationRes, IPagination } from './interfaces'

const usePagination = ({
  currentPage,
  commonFilterRef,
  setSelected,
  listApi,
  formatListParams,
  beforeFetch,
}: IUsePaginationParams): IUsePaginationRes => {
  const data = ref([])
  const pagination = reactive<IPagination>({ page: 0, pageSize: 10, total: 0 })
  const getList = async (curPage: number = 1, pageSize: number = 10, text?: string) => {
    try {
      const fromRef = commonFilterRef.value?.getForm()
      const isFunction = typeof formatListParams === 'function'
      const formData = isFunction ? await formatListParams?.(fromRef?.values) : fromRef?.values
      pagination.page = curPage
      pagination.pageSize = pageSize
      const params = { ...formData, pagination }
      beforeFetch?.({ formData: fromRef?.values, pagination })
      const res = await listApi(params || {})
      currentPage.value = curPage
      data.value = res[key]
      pagination.total = res.pagination.total
      ElMessage({
        message: `${text || '查询'}成功`,
        type: 'success',
      })
      await nextTick()
      setSelected(data.value)
    } catch (error: any) {
      console.error(`获取列表数据失败，失败原因:${error}`)
    }
  }
  return { data, pagination, getList }
}

export default usePagination
