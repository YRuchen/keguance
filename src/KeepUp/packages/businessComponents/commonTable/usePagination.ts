import { ref, reactive, nextTick, toRefs } from 'vue'
import { ElMessage } from 'element-plus'
import { key } from './constants'

import type { IUsePaginationParams, IUsePaginationRes, IPagination } from './interfaces'

const usePagination = ({
  currentPage,
  commonFilterRef,
  setSelected,
  props,
}: IUsePaginationParams): IUsePaginationRes => {
  const {
    listApi,
    formatListParams,
    beforeFetch,
    needPagination,
  } = toRefs(props)
  const data = ref([])
  const pagination = reactive<IPagination>(needPagination.value ? { page: 0, pageSize: 10, total: 0 } : null)
  const getList = async (
    curPage: number = 1, 
    pageSize: number = 10, 
    text?: string,
  ) => {
    try {
      const fromRef = commonFilterRef.value?.getForm()
      const isFunction = typeof formatListParams.value === 'function'
      if (needPagination.value) {
        pagination.page = curPage
        pagination.pageSize = pageSize
      }
      const rawParams = { ...(fromRef?.values || {}), ...(pagination || {}) }
      const params = isFunction 
        ? await formatListParams.value?.(rawParams) 
        : rawParams
      beforeFetch.value?.({ formData: fromRef?.values, pagination })
      const res = await listApi.value(params || {})
      currentPage.value = curPage
      data.value = res?.[key]
      needPagination.value && (pagination.total = res?.pagination?.total)
      // ElMessage({
      //   message: `${text || '查询'}成功`,
      //   type: 'success',
      // })
      await nextTick()
      setSelected(data.value)
    } catch (error: any) {
      console.error(`获取列表数据失败，失败原因:${error}`)
    }
  }
  return { data, pagination, getList }
}

export default usePagination
