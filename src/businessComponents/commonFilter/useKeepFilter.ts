import { ref } from 'vue'
import { useStorage } from '@vueuse/core'
import { KEEP_FILTER_KEY } from './constants'

import type { ICommonObj } from '~/interfaces/common'
import type { IUseKeepFilterParams, IUseKeepFilterRes } from './interfaces'

/** 保存filter数据，在页面初始化时取出数据回显在filter区域 */
export const useKeepFilter = ({
  pageKey,
}: IUseKeepFilterParams): IUseKeepFilterRes => {
  const filterParams = pageKey ? useStorage(`${pageKey}${KEEP_FILTER_KEY}`, {}) : ref ({})
  const keepFilter = (params: ICommonObj) => {
    if (!pageKey) {
      console.error(`保存筛选数据失败，失败原因：缺少pageKey`)
      return
    }
    filterParams.value = params
  }
  return {
    filterParams,
    keepFilter,
  }
}
