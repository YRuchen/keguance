import { ref } from 'vue'
import { setStorage, getStorage } from '../../__builtins__'
import { KEEP_FILTER_KEY } from './constants'

import type { ICommonObj } from '../../interfaces/common'
import type { IUseKeepFilterParams, IUseKeepFilterRes } from './interfaces'

/** 保存filter数据，在页面初始化时取出数据回显在filter区域 */
export const useKeepFilter = ({
  pageKey,
  formRef,
}: IUseKeepFilterParams): IUseKeepFilterRes => {
  /** 筛选项数据 */
  const filterParams = ref({})
  /** 缓存筛选项数据 */
  const keepFilter = (params: ICommonObj) => {
    if (!pageKey) {
      console.error(`保存筛选数据失败，失败原因：缺少pageKey`)
      return
    }
    setStorage(`${pageKey}${KEEP_FILTER_KEY}`, params)
  }
  /** 初始化 */
  const init = () => {
    const formValues = formRef?.value?.values
    if (pageKey) {
      const cache = getStorage(`${pageKey}${KEEP_FILTER_KEY}`)
      filterParams.value = cache || formValues
    } else {
      filterParams.value = formValues
    }
  }
  return {
    filterParams,
    keepFilter,
    init,
  }
}
