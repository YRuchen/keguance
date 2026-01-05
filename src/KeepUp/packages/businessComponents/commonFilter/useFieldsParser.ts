import { toRefs, computed } from 'vue'
import { props as CommonProps } from './props'

import type { ExtractPropTypes } from 'vue'
import type { ICollapseData, IUseFieldsParserRes } from './interfaces'

/** 拆分派生字段数据 */
export const useFieldsParser = (props: ExtractPropTypes<typeof CommonProps>): IUseFieldsParserRes => {
  const { filterFields, maxColumns } = toRefs(props)
  const collapseData = computed<ICollapseData>(() => {
    const filterFieldsEntries = Object.entries(filterFields.value)
    return filterFieldsEntries
      .reduce((acc, [k, v]) => {
        const gridSpan = v['x-component-props']?.gridSpan || 1
        const curTotalGridSpan = acc.totalGridSpan + gridSpan
        const isOverflow = curTotalGridSpan > maxColumns.value
        acc.totalGridSpan = curTotalGridSpan
        acc.allFieldKeys.push(k)
        acc.collapsible = isOverflow
        Object.assign(acc.allFields, { [k]: v })
        if (!isOverflow) {
          acc.visibleFieldKeys.push(k)
        }
        return acc
      }, { 
        allFields: {}, 
        allFieldKeys: [], 
        visibleFieldKeys: [], 
        totalGridSpan: 0, 
        collapsible: false as boolean,
      })
  })
  return {
    collapseData,
  }
}
