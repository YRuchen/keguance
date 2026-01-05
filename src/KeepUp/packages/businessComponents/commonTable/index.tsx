import { defineComponent, ref, unref, computed, watch, inject, onMounted } from 'vue'
import { isEmpty } from 'lodash'
import { useField } from '@formily/vue'
import { ElPagination, ElTable, ElTableColumn, ElEmpty } from 'element-plus'
import Space from '../../basicComponents/space'
import { COMMON_FILTER_INJECTION_KEY } from '../commonPage'
import { defaultPaginationConfig, headerCellStyle } from './constants'
import { setSelected } from './utils'
import usePagination from './usePagination'
import { props } from './props'
import stylus from './index.module.scss'

import type { Ref } from 'vue'
import type { ICommonFilterExpose } from '../commonFilter'

const ElTable2 = ElTable as any
const ElPagination2 = ElPagination as any

export * from './interfaces'
export default defineComponent({
  name: 'CommonTable',
  inheritAttrs: false,
  props: props as typeof props & { key: any },
  setup(props, { attrs, emit, slots, expose }) {
    const fieldRef = useField()
    const tableRef = ref()
    const refreshKey = ref(0)
    const currentPage = ref(1)
    const commonFilterRef = inject<Ref<ICommonFilterExpose>>(COMMON_FILTER_INJECTION_KEY, ref(null))
    const columns = computed(() => unref(props.columns))
    const { data, pagination, getList } = usePagination({
      currentPage,
      commonFilterRef,
      setSelected: (data: any[]) => setSelected({
        tableRef,
        selected: props.selected,
        rowKey: props.rowKey,
        data,
      }),
      props,
    })
    const mergedPaginationConfig = computed(() => ({ ...defaultPaginationConfig, ...props.paginationConfig }))
    const filterEmptyTip = computed<string>(() => isEmpty(props.columns) ? '哎呀，至少留一列吧，不然表格都没法看啦～' : '')
    const dataEmptyTip = computed<string>(() => isEmpty(data.value) ? '空空如也～要不先去加点数据看看？' : '')
    onMounted(() => {
      /** 需要带上筛选项数据，所以等筛选项onMounted */
      getList(1, pagination?.pageSize)
    })
    watch(() => columns.value, () => {
      refreshKey.value = refreshKey.value === 0 ? 1 : 0
    }, { deep: true })
    /** 在formily场景下使用的刷新功能 */
    fieldRef.value?.setData({ reset: getList })
    expose({ pagination, getList })
    /** 展开区域渲染器 */
    const expandedRowTsx = () => (
      props.expandedRowRender 
        && <ElTableColumn 
          type='expand' 
          v-slots={{
            default: (data) => props.expandedRowRender?.(data),
          }}
        />
    )
    return () => (
      <Space class={[stylus.container, props.class]} style={props.style} direction='column'>
        {
          filterEmptyTip.value
            ? <ElEmpty description={filterEmptyTip.value} />
            : (
                slots?.content?.({ data, height: attrs.height })
                  ?? <ElTable2
                      ref={tableRef}
                      key={refreshKey.value}
                      headerCellStyle={headerCellStyle}
                      formatter={() => '-'}
                      { ...attrs }
                      rowKey={props.rowKey}
                      data={data.value}
                      // 每次查询，table重新赋值后，table触发事件去清空选中值。给checkbox的column加上reserve-selection可解。
                      onSelectionChange={(newSelection: any[]) => emit('update:selected', newSelection)}
                      v-slots={{
                        empty: () => <ElEmpty description={dataEmptyTip.value} />,
                        ...slots,
                      }}
                    >
                      {props.selectable && <ElTableColumn type='selection' fixed='left' selectable={props.selectOptions}/>}
                      {expandedRowTsx()}
                      {columns.value.map((v, i) => (
                        <ElTableColumn
                          {...v}
                          key={i}
                          v-slots={{
                            default: (scope: { row: any, column: any, $index: number }) => {
                              return v?.render?.({ rowData: scope.row, rowIndex: scope.$index }) || <div>{scope.row[v.prop] || '-'}</div>
                            },
                          }}
                        />
                      ))}
                    </ElTable2>
            )
        }
        {
          props.needPagination
            && <ElPagination2
                style={{ width: '100%', justifyContent: 'end' }}
                currentPage={currentPage.value}
                onUpdate:currentPage={getList}
                size='small'
                layout='total, prev, pager, next, jumper'
                { ...mergedPaginationConfig.value }
                total={pagination?.total}
              />
        }
      </Space>
    )
  }
})
