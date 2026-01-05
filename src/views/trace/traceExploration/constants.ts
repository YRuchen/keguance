import { h } from 'vue'
import { ElText } from 'element-plus'
import Big from 'big.js'
import { getTracesFields, getSpansFields } from './fields'

import type { Column } from 'element-plus'

/** 搜索对象 */
export enum SearchTarget {
  /** 追踪 */
  TRACES = 'TRACES',
  /** 操作 */
  SPANS = 'SPANS',
}

/** 搜索对象 */
export const searchTargetOptions = [
  /** 追踪 */
  { label: 'Traces', value: SearchTarget.TRACES },
  /** 操作 */
  { label: 'Spans', value: SearchTarget.SPANS },
]

/** 搜索对象到fields的映射 */
export const searchTargetToFieldsMap = {
  /** 追踪 */
  TRACES: getTracesFields,
  /** 操作 */
  SPANS: getSpansFields,
}

/** traces展开区域列配置 */
export const tracesExpandedColumns: Partial<Column>[] = [
  {
    prop: 'spanID',
    label: 'spanID',
    width: 160,
  },
  {
    prop: 'startTimeUnixNano',
    label: 'span发生时间',
    width: 180,
    render: ({ rowData }) => {
      const date = new Date(Number(new Big(rowData.startTimeUnixNano).div(1_000_000)))
      return h(ElText, {}, date.toLocaleString())
    },
  },
  {
    prop: 'durationNanos',
    label: '执行耗时',
    render: ({ rowData }) => {
      return h(ElText, {}, `${new Big(rowData.durationNanos).div(1_000_000).round(4)}ms`)
    },
  },
]