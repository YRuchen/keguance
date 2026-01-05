import { ref, toRefs, watch } from 'vue'
import { formatTableToFormily } from './utils'
import usePagePreferences from './usePagePreferences'
import useAsyncDataSource from './useAsyncDataSource'

import type { Column } from 'element-plus'
import type { ISchema } from '@formily/vue'
import type { IField } from '../../interfaces/commonPage'
import type { IEffectHooks } from '../../basicComponents/formilyCmps/formilyForm'
import type { IUsePageRes, IFieldCategorize } from './interfaces'

/** 派生CommonPage中所有字段相关的数据 TODO: ts类型 */
const usePage = (props): IUsePageRes => {
  const {
    fields,
    pageKey,
  } = toRefs(props)
  const allFilterFields = ref<ISchema['properties']>({}) // 筛选项
  const allEditFields = ref<ISchema['properties']>({}) // 编辑项
  const allColumns = ref<Column[]>([]) // 表格列
  const fetchEffects = ref<IEffectHooks>({ fieldEffects: {} }) // 远程搜索配置
  watch(() => fields.value, () => {
    try {
      const {
        curFilterFields, curEditFields, curColumns, curFetchEffects,
      } = (fields.value as IField[]).reduce<IFieldCategorize>(
        (initVal, curItem: IField) => {
          const { isColumn, columnConfig = {}, isFilter, filterConfig = {}, isEdit, editConfig = {}, fetchConfig, ...config } = curItem
          isColumn && initVal.curColumns.push({ ...config, ...columnConfig })
          isFilter && Object.assign(initVal.curFilterFields, formatTableToFormily(curItem, 'filterConfig'))
          isEdit && Object.assign(initVal.curEditFields, formatTableToFormily(curItem, 'editConfig'))
          if (fetchConfig) {
            initVal.curFetchEffects[config.prop] = useAsyncDataSource(fetchConfig)
          }
          return initVal
        },
        { curFilterFields: {}, curEditFields: {}, curColumns: [], curFetchEffects: {} },
      )
      allFilterFields.value = curFilterFields
      allEditFields.value = curEditFields
      allColumns.value = curColumns as unknown as Column[]
      fetchEffects.value.fieldEffects = curFetchEffects
    } catch (error) {
      console.error(`构建fields失败，失败原因：${error}`)
    }
  }, { immediate: true, deep: true })
  /** 上面是基础数据，后面的数据全部是基于基础数据的派生数据 */
  const {
    visibleFilterFields, 
    visibleColumns, 
    allVisibleFilterFields,
    allVisibleColumnFields,
    setPagePreferences,
  } = usePagePreferences({ pageKey: pageKey.value, allFilterFields, allColumns: allColumns })
  return {
    allFilterFields,
    allEditFields,
    allColumns,
    fetchEffects,
    visibleFilterFields,
    visibleColumns,
    allVisibleFilterFields,
    allVisibleColumnFields,
    setPagePreferences,
  }
}

export default usePage
