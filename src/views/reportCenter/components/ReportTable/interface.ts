import { defineComponent, ref, onMounted, computed, h, type VNodeChild } from 'vue'
import { useRouter } from 'vue-router'
import {
  ElTable,
  ElTableColumn,
  ElButton,
  ElPagination,
  ElMessage,
  type TableColumnCtx,
} from 'element-plus'
export type FilterValues = {
  reportName?: string
  reportType?: string
  module?: number
  generateStatus?: string
  startTimestamp?: number
  endTimestamp?: number
}
export type ColumnItem<T = any> = {
  label?: string
  prop?: string
  columnAttr?: Partial<TableColumnCtx<T>>
  render?: (scope: { row: T; $index: number }) => VNodeChild
}

export type ListApi = (params: any) => Promise<any>
