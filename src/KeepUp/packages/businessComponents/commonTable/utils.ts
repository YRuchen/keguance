import type { ISetSelectedParams } from './interfaces'

/** 设置选中值 */
export const setSelected = ({
  tableRef,
  selected = [],
  rowKey,
  data,
}: ISetSelectedParams) => {
  selected.map(v => {
    const matched = data.find(v1 => v1[rowKey] === v[rowKey])
    if (matched) {
      tableRef.value?.toggleRowSelection(matched, true)
    }
  })
}
