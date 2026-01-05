import { ref } from 'vue'

import type { PropType, Ref, VNode } from 'vue'
import type { Column } from 'element-plus'
import type { IExpandedRowRenderParams } from '../commonPage/interfaces'
import type { IListApi, ICommonObj } from '../../interfaces'

export const props = {
  /** 行标识 */
  rowKey: {
    type: String,
    default: 'id',
  },
  /** columns */
  columns: {
    type: Object as PropType<Ref<Column[]>>,
    default: () => (ref([])),
  },
  /** 获取列表 */
  listApi: {
    type: Function as PropType<IListApi>,
    default: undefined,
  },
  /** 格式化列表接口入参 */
  formatListParams: {
    type: Function as PropType<(p: any) => any>,
    default: undefined,
  },
  /** getList前置钩子 */
  beforeFetch: {
    type: Function as PropType<(p: Record<'formData' | 'pagination', ICommonObj | undefined>) => Promise<void> | void>,
    default: undefined,
  },
  /** 可选择 */
  selectable: {
    type: Boolean,
    default: false,
  },
  /** 选择配置 */
  selectOptions: {
    type: Function as PropType<(row?: any, index?: number) => boolean>,
    default: () => true,
  },
  /** 选中值 */
  selected: {
    type: Array,
    default: () => ([]),
  },
  /** 表格展开区域渲染器 */
  expandedRowRender: {
    type: Function as PropType<(p: IExpandedRowRenderParams) => VNode>,
    default: undefined,
  },
  /** 分页配置 */
  paginationConfig: {
    type: Object,
    default: () => ({}),
  },
  /** 需要分页 */
  needPagination: {
    type: Boolean,
    default: false,
  },
  /** class */
  class: {
    type: String,
    default: undefined,
  },
  /** style */
  style: {
    type: Object,
    default: () => ({}),
  },
}
