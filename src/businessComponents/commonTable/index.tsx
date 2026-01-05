import { defineComponent, ref, unref, computed, watch, inject, onMounted } from 'vue'
import { ElPagination, ElTable, ElTableColumn } from 'element-plus'
import Space from '~/basicComponents/space'
import { COMMON_FILTER_INJECTION_KEY } from '../commonPage'
import { defaultPaginationConfig, headerCellStyle } from './constants'
import { setSelected } from './utils'
import usePagination from './usePagination'
import stylus from './index.module.scss'

import type { PropType, Ref } from 'vue'
import type { Column } from 'element-plus'
import type { IListApi } from '~/interfaces/common'
import type { ICommonFilterExpose } from '../commonFilter'

const props = {
  /** columns */
  columns: {
    type: Object as PropType<Ref<Column[]>>,
    default: () => ref([]),
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
    type: Function as PropType<() => void>,
    default: undefined,
  },
  /** 行标识 */
  rowKey: {
    type: String,
    default: 'id',
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
    default: () => [],
  },
  /** 需要分页 */
  needPagination: {
    type: Boolean,
    default: false,
  },
  /** 分页配置 */
  paginationConfig: {
    type: Object,
    default: () => ({}),
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

export * from './interfaces'
export default defineComponent({
  name: 'CommonTable',
  inheritAttrs: false,
  props,
  setup(props, { attrs, emit, expose, slots }) {
    const tableRef = ref()
    const refreshKey = ref(0)
    const currentPage = ref(1)
    const commonFilterRef = inject<Ref<ICommonFilterExpose>>(COMMON_FILTER_INJECTION_KEY, ref(null))
    const columns = computed(() => unref(props.columns))
    const { data, pagination, getList } = usePagination({
      currentPage,
      commonFilterRef,
      setSelected: (data: any[]) =>
        setSelected({
          tableRef,
          selected: props.selected,
          rowKey: props.rowKey,
          data,
        }),
      listApi: props.listApi,
      formatListParams: props.formatListParams,
      beforeFetch: props.beforeFetch,
    })
    const mergedPaginationConfig = computed(() => ({
      ...defaultPaginationConfig,
      ...props.paginationConfig,
    }))
    onMounted(() => {
      /** 需要带上筛选项数据，所以等筛选项onMounted */
      getList(1, pagination?.pageSize)
    })
    watch(
      () => columns.value,
      () => {
        refreshKey.value = refreshKey.value === 0 ? 1 : 0
      },
      { deep: true },
    )
    expose({ pagination, getList })
    return () => (
      <Space class={[stylus.container, props.class]} style={props.style} direction='column'>
        <ElTable
          ref={tableRef}
          key={refreshKey.value}
          headerCellStyle={headerCellStyle}
          tableLayout='auto'
          {...attrs}
          rowKey={props.rowKey}
          data={data.value}
          // 每次查询，table重新赋值后，table触发事件去清空选中值。给checkbox的column加上reserve-selection可解。
          onSelectionChange={(newSelection: any[]) => emit('update:selected', newSelection)}
          v-slots={slots}
        >
          {props.selectable && (
            <ElTableColumn type='selection' fixed='left' selectable={props.selectOptions} />
          )}
          {columns.value.map((v, i) => (
            <ElTableColumn
              {...v}
              key={i}
              v-slots={{
                default: (scope: { row: any; column: any; $index: number }) => {
                  return v?.render?.({ rowData: scope.row, rowIndex: scope.$index })
                },
              }}
            />
          ))}
        </ElTable>
        {props.needPagination && (
          <ElPagination
            style={{ width: '100%', justifyContent: 'end' }}
            currentPage={currentPage.value}
            onUpdate:currentPage={getList}
            size='small'
            layout='total, prev, pager, next, jumper'
            {...mergedPaginationConfig.value}
            total={pagination?.total}
          />
        )}
      </Space>
    )
  },
})
