import { defineComponent, ref, onMounted, onUnmounted, nextTick, provide } from 'vue'
import { ElDivider, ElButton, ElSpace, ElMessage } from 'element-plus'
import { ArrowDown, Refresh, Setting, Plus } from '@element-plus/icons-vue'
import Space from '~/basicComponents/space'
import emitter from '~/utils/emitter'
import CommonFilter from '../commonFilter'
import { useKeepFilter } from '../commonFilter/useKeepFilter'
import CommonSetter from '../commonSetter'
import CommonTable from '../commonTable'
import CommonEditor, { MODE } from '../commonEditor'
import usePage from './usePage'
import { COMMON_FILTER_INJECTION_KEY } from './constants'
import styles from './index.module.scss'

import type { PropType, Ref } from 'vue'
import type { IListApi, ICommonObj } from '~/interfaces/common'
import type { IField } from '~/interfaces/commonPage'
import type { IExpose, IQueryParams } from './interfaces'
import type { ICommonFilterExpose } from '../commonFilter'
import type { ICommonEditorExpose, IOpenParams, IEditorLayout } from '../commonEditor'
import type { ICommonTableExpose } from '../commonTable'

const props = {
  /** fields */
  fields: {
    type: Array as PropType<IField[] | Ref<IField[]>>,
    default: () => [],
  },
  /** 获取列表 */
  listApi: {
    type: Function as PropType<IListApi>,
    default: undefined,
  },
  /** 创建 */
  createApi: {
    type: Function as PropType<(p: ICommonObj) => Promise<void>>,
    default: undefined,
  },
  disabledAdd: {
    type: Boolean,
    default: false,
  },
  /** 编辑 */
  editApi: {
    type: Function as PropType<(p: ICommonObj) => Promise<void>>,
    default: undefined,
  },
  /** 下载 */
  downloadApi: {
    type: Function as PropType<(p?: ICommonObj) => Promise<void>>,
    default: undefined,
  },
  /** 格式化列表接口入参 */
  formatListParams: {
    type: Function as PropType<(p: any) => any>,
    default: undefined,
  },
  /** 格式化创建&编辑接口入参 */
  formatEditParams: {
    type: Function as PropType<(p: any) => any>,
    default: undefined,
  },
  /** 页面标识 */
  pageKey: {
    type: String,
    default: '',
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
  /** 筛选区域栅格数量 */
  filterColumns: {
    type: Number,
    default: 3,
  },
  /** 编辑器样式 */
  editorLayout: {
    type: Object as PropType<IEditorLayout>,
    default: () => ({
      columns: 0,
      labelStyle: {
        width: '100px',
        margin: '0',
      },
    }),
  },
  /** 刷新 */
  refreshable: {
    type: Boolean,
    default: false,
  },
}

export * from './constants'
export * from '../commonEditor/constants'
export type { IField, IExpose }
export default defineComponent({
  name: 'CommonPage',
  props,
  setup(props, { emit, slots, expose }) {
    const containerRef = ref()
    const commonFilterRef = ref<ICommonFilterExpose>()
    const commonEditorRef = ref<ICommonEditorExpose>()
    const commonTableRef = ref<ICommonTableExpose>()
    const setterBarRef = ref()
    const extraPaneRef = ref()
    const containerHeight = ref('0px')
    const commonTableRefHeight = ref('0px')
    const {
      allEditFields,
      fetchEffects,
      visibleFilterFields,
      visibleColumns,
      allVisibleFilterFields,
      allVisibleColumnFields,
      setPagePreferences,
    } = usePage({ fields: props.fields, pageKey: props.pageKey })
    provide(COMMON_FILTER_INJECTION_KEY, commonFilterRef)
    const { keepFilter } = useKeepFilter({ pageKey: props.pageKey })
    /** 查询 */
    const query = async ({ page, text }: IQueryParams = {}) => {
      await commonTableRef.value?.getList(page || 1, props.paginationConfig.pageSize, text)
    }
    /** 打开侧边栏 */
    const openEditor = (params: IOpenParams) => {
      commonEditorRef.value?.open?.(params)
    }
    /** 创建 */
    const create = () => {
      commonEditorRef.value?.open?.({ mode: MODE.CREATE, rowData: {}, rowIndex: 0 } as IOpenParams)
    }
    /** 重置筛选条件 */
    const filterReset = () => {
      commonFilterRef.value?.reset()
      query({ text: '重置' })
    }
    /** 下载 */
    const download = async () => {
      try {
        await props.downloadApi?.()
        ElMessage({
          message: '下载成功',
          type: 'success',
        })
      } catch (error: any) {
        console.error(`下载失败，失败原因：${error}`)
      }
    }
    /** 更新筛选器高度 */
    const updateTableHeight = () => {
      containerHeight.value = containerRef.value.$el.clientHeight
      const table = '15px - 16px - 8px - 24px'
      const elDividerHeight = `${setterBarRef.value.$el.clientHeight}px`
      commonTableRefHeight.value = `calc(${
        containerHeight.value
      }px - 32px - ${commonFilterRef.value?.getCommonFilterHeight()}px - ${
        extraPaneRef.value?.clientHeight || 0
      }px - 8px - 31px - 8px - ${elDividerHeight} - 8px - ${table})`
    }
    onMounted(async () => {
      emitter.on('openEditor', openEditor)
      setTimeout(() => {
        updateTableHeight()
      }, 250)
    })
    onUnmounted(() => {
      emitter.off('openEditor', openEditor)
    })
    expose<IExpose>({
      query,
      getFilterForm: () => commonFilterRef.value?.getForm(),
      getPagination: () => commonTableRef.value?.pagination,
      updateTableHeight,
    })
    return () => (
      <>
        <Space ref={containerRef} class={styles.container} direction='column'>
          <CommonFilter
            ref={commonFilterRef}
            class={styles.filterContainer}
            maxColumns={props.filterColumns}
            filterFields={visibleFilterFields.value}
            operateActions={{ query, reset: filterReset }}
            effectHooks={fetchEffects.value}
            pageKey={props.pageKey}
            v-slots={{
              ...(slots.filterTitle ? { title: slots.filterTitle } : {}),
            }}
          />
          <ElDivider
            class={styles.collapse}
            onClick={async () => {
              if (!commonFilterRef.value?.collapsible) {
                return
              }
              commonFilterRef.value?.collapse()
              await nextTick()
              updateTableHeight()
            }}
            v-slots={{
              default: () =>
                commonFilterRef.value?.collapsible && (
                  <ElButton
                    class={styles.btn}
                    style={{
                      transform: `rotate(${commonFilterRef.value?.visible ? '180deg' : '0deg'})`,
                    }}
                    icon={ArrowDown}
                    link
                  />
                ),
            }}
          />
          {slots?.extraPane && (
            <div ref={extraPaneRef} class={styles.extraPane}>
              {slots.extraPane()}
            </div>
          )}
          <Space ref={setterBarRef} class={styles.setter} justify='end'>
            <ElSpace>
              {props.createApi && (
                <ElButton disabled={props.disabledAdd} type='primary' icon={Plus} onClick={create}>
                  新增
                </ElButton>
              )}
              {slots.setterPrefix?.()}
              {props.downloadApi &&
                (slots.download?.(download) || <ElButton onClick={download}>下载</ElButton>)}
            </ElSpace>
            <ElSpace class={styles.end}>
              {slots.setterSuffix?.()}
              {props.refreshable && (
                <ElButton icon={Refresh} link onClick={() => query({ text: '刷新' })} />
              )}
              {props.pageKey && (
                <CommonSetter
                  allVisibleFilterFields={allVisibleFilterFields}
                  allVisibleColumnFields={allVisibleColumnFields}
                  onConfirm={setPagePreferences}
                  v-slots={{
                    reference: () => <ElButton icon={Setting} link />,
                  }}
                />
              )}
            </ElSpace>
          </Space>
          <div class={styles.tableContainer}>
            <CommonTable
              ref={commonTableRef}
              rowKey={props.rowKey}
              height={commonTableRefHeight.value}
              columns={visibleColumns}
              listApi={props.listApi}
              selectable={props.selectable}
              selectOptions={props.selectOptions}
              selected={props.selected}
              formatListParams={props.formatListParams}
              beforeFetch={({ formData }) => {
                keepFilter?.(formData)
              }}
              onUpdate:selected={(val: any[]) => {
                emit('update:selected', val)
              }}
              needPagination={props.needPagination}
              onRowClick={(row: any, column: any, event: Event) => {
                emit('rowClick', { rowData: row, column, event })
              }}
            />
          </div>
        </Space>
        <CommonEditor
          ref={commonEditorRef}
          createApi={props.createApi}
          editApi={props.editApi}
          editFields={allEditFields.value}
          layout={props.editorLayout}
          effectHooks={fetchEffects.value}
          formatEditParams={props.formatEditParams}
          onConfirmSuccess={() => {
            query({ page: commonTableRef.value.pagination?.page })
          }}
        />
      </>
    )
  },
})
