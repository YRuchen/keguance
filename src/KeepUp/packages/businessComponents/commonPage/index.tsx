import { defineComponent, ref, onMounted, onUnmounted, nextTick, provide, h } from 'vue'
import { isEmpty } from 'lodash'
import { ElButton, ElSpace } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { IconFont } from '~/KeepUp'
import Space from '../../basicComponents/space'
import emitter from '../../__builtins__/emitter'
import CommonFilter from '../commonFilter'
import CommonSetter from '../commonSetter'
import CommonTable from '../commonTable'
import CommonEditor from '../commonEditor'
import usePage from './usePage'
import { usePageActions } from './usePageActions'
import { useLayout } from './useLayout'
import { COMMON_FILTER_INJECTION_KEY } from './constants'
import styles from './index.module.scss'

import type { PropType, Ref, VNode } from 'vue'
import type { IListApi, ICommonObj } from '../../interfaces/common'
import type { IField } from '../../interfaces/commonPage'
import type { IExpose, IExpandedRowRenderParams } from './interfaces'
import type { ICommonFilterExpose } from '../commonFilter'
import type { ICommonEditorExpose, IEditorLayout } from '../commonEditor'
import type { ICommonTableExpose } from '../commonTable'

const props = {
  /** fields */
  fields: {
    type: Array as PropType<IField[] | Ref<IField[]>>,
    default: () => ([]),
  },
  /** 获取列表 */
  listApi: {
    type: Function as PropType<IListApi>,
    default: undefined,
  },
  /** 创建 */
  createApi: {
    type: Function as PropType<(p: ICommonObj) => Promise<ICommonObj>>,
    default: undefined,
  },
  /** 编辑 */
  editApi: {
    type: Function as PropType<(p: ICommonObj) => Promise<ICommonObj>>,
    default: undefined,
  },
  /** 下载 */
  downloadApi: {
    type: Function as PropType<(p?: ICommonObj) => Promise<ICommonObj>>,
    default: undefined,
  },
  /** 导出 */
  exportApi: {
    type: Function as PropType<(p?: ICommonObj) => Promise<ICommonObj>>,
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
  /** 格式化创建&编辑接口入参 */
  formatExportParams: {
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
    default: () => ([]),
  },
  /** 表格展开区域渲染器 */
  expandedRowRender: {
    type: Function as PropType<(p: IExpandedRowRenderParams) => VNode>,
    default: undefined,
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
      }
    }),
  },
  /** 刷新 */
  refreshable: {
    type: Boolean,
    default: false,
  },
  /** 单行操作栏 */
  singleActionBar: {
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
    const commonIconBtnStyle = ref({
      padding: '8px',
      marginLeft: 0,
    })
    const { 
      allEditFields, 
      fetchEffects,
      visibleFilterFields, 
      visibleColumns,
      allVisibleFilterFields,
      allVisibleColumnFields,
      setPagePreferences,
    } = usePage(props) // 数据派生
    const {
      query,
      openEditor,
      create,
      filterReset,
      download,
      exportFn,
      watchList,
    } = usePageActions(
      props.paginationConfig,
      props.downloadApi,
      props.exportApi,
      props.formatExportParams,
      commonFilterRef,
      commonEditorRef,
      commonTableRef,
    ) // 动作抽离
    watchList(ref([visibleColumns]))
    provide(COMMON_FILTER_INJECTION_KEY, commonFilterRef)
    const {
      commonTableRefHeight,
      updateTableHeight,
      watchLayout,
    } = useLayout(
      containerRef,
      setterBarRef,
      extraPaneRef,
    ) // ui副作用
    watchLayout([visibleFilterFields, visibleColumns])
    onMounted(async() => {
      emitter.on('openEditor', openEditor)
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
    /** 筛选区域 */
    const commonFilterTsx = (needPadding: boolean = false) => (
      <Space 
        class={styles.commonFilterContainer} 
        style={{ padding: needPadding ? '0 16px' : '0px', boxSizing: 'border-box' }}
        align='flex-start' 
        justify='start' 
        size={12}
        fill
      >
        {
          isEmpty(visibleFilterFields.value)
            ? null
            : <CommonFilter
                ref={commonFilterRef}
                maxColumns={props.filterColumns}
                filterFields={visibleFilterFields.value}
                operateActions={{ query, reset: filterReset }}
                effectHooks={fetchEffects.value}
                pageKey={props.pageKey}
                v-slots={{
                  ...(slots.filterTitle ? { title: slots.filterTitle } : {}),
                }}
              />
        }
        {
          commonFilterRef.value?.collapseData?.collapsible
            && <ElButton 
                class={styles.collapse} 
                size={0} 
                icon={
                  h(
                    IconFont,
                    { 
                      name: 'double_arrow_down', 
                      class: styles.collapseIcon, 
                      style: {
                        transform: `rotate(${commonFilterRef.value?.visible ? '180deg' : '0deg'})`
                      },
                      size: '10',
                    },
                  )
                }
                text
                onClick={async () => {
                  if (!commonFilterRef.value?.collapseData?.collapsible) {
                    return
                  }
                  commonFilterRef.value?.collapse()
                  await nextTick()
                  updateTableHeight()
                }}
              >
                {commonFilterRef.value?.visible ? '收起' : '展开'}
              </ElButton>
        }
      </Space>
    )
    /** 纯操作栏 */
    const actionTsx = () => (
      <Space class={styles.setter} align='flex-start' justify='end' size={12}>
        <ElSpace>
          {props.createApi && <ElButton type='primary' icon={Plus} onClick={create}>新增</ElButton>}
          {slots.setterPrefix?.()}
          {props.downloadApi && (slots.download?.(download) || <ElButton onClick={download}>下载</ElButton>)}
        </ElSpace>
        <Space class={styles.end} size={12} justify='end' fill>
          {slots.setterSuffix?.()}
          {props.exportApi && (slots.exportBtn?.(exportFn) || <ElButton style={commonIconBtnStyle.value} icon={h(IconFont, { name: 'export', size: '22' })} onClick={exportFn} />)}
          {props.refreshable && <ElButton style={commonIconBtnStyle.value} icon={h(IconFont, { name: 'refresh', size: '22' })} onClick={() => query({ text: '刷新' })} />}
          {
            props.pageKey
              && <CommonSetter
                allVisibleFilterFields={allVisibleFilterFields}
                allVisibleColumnFields={allVisibleColumnFields}
                onConfirm={setPagePreferences}
                v-slots={{
                  reference: () => (<ElButton style={{ margin: 0, ...commonIconBtnStyle.value }} icon={h(IconFont, { name: 'setter', size: '22' })} />)
                }}
              />
          }
        </Space>
      </Space>
    )
    /** 操作栏 + 筛选区域 */
    const action2Tsx = () => {
      const hasSetter = (props.createApi || props.downloadApi || slots.setterPrefix) && !(isEmpty(visibleFilterFields.value))
      return (
        <Space class={styles.setter} align='flex-start' justify='end' size={12}>
          <ElSpace>
            {props.createApi && <ElButton type='primary' icon={Plus} onClick={create}>新增</ElButton>}
            {slots.setterPrefix?.()}
            {props.downloadApi && (slots.download?.(download) || <ElButton onClick={download}>下载</ElButton>)}
          </ElSpace>
          { hasSetter && <el-divider direction="vertical" class={styles.line} />}
          { commonFilterTsx() }
          <Space class={styles.end} size={12} justify='end' fill>
            {slots.setterSuffix?.()}
            {props.exportApi && (slots.exportBtn?.(exportFn) || <ElButton style={commonIconBtnStyle.value} icon={h(IconFont, { name: 'export', size: '22' })} onClick={exportFn} />)}
            {props.refreshable && <ElButton style={commonIconBtnStyle.value} icon={h(IconFont, { name: 'refresh', size: '22' })} onClick={() => query({ text: '刷新' })} />}
            {
              props.pageKey
                && <CommonSetter
                  allVisibleFilterFields={allVisibleFilterFields}
                  allVisibleColumnFields={allVisibleColumnFields}
                  onConfirm={setPagePreferences}
                  v-slots={{
                    reference: () => (<ElButton style={{ margin: 0, ...commonIconBtnStyle.value }} icon={h(IconFont, { name: 'setter', size: '22' })} />)
                  }}
                />
            }
          </Space>
        </Space>
      )
    }
    return () => (
      <>
        <Space ref={containerRef} class={styles.container} direction='column'>
          <Space ref={setterBarRef} direction='column' fill>
            {
              props.singleActionBar
                ? actionTsx()
                : null
            }
            {props.singleActionBar ? commonFilterTsx(true) : action2Tsx()}
          </Space>
          {slots?.extraPane && <div ref={extraPaneRef} class={styles.extraPane}>
            {slots.extraPane()}
          </div>}
          <Space class={styles.tableContainer} justify='start'>
            {slots?.commonTableLeftPane?.({ height: commonTableRefHeight.value })}
            <CommonTable
              style={{ flex: 1 }}
              ref={commonTableRef}
              rowKey={props.rowKey}
              height={commonTableRefHeight.value}
              columns={visibleColumns}
              listApi={props.listApi}
              formatListParams={props.formatListParams}
              beforeFetch={({ formData }) => { commonFilterRef.value?.keepFilter?.(formData) }}
              selectable={props.selectable}
              selectOptions={props.selectOptions}
              selected={props.selected}
              expandedRowRender={props.expandedRowRender}
              onUpdate:selected={(val: any[]) => { 
                emit('update:selected', val)
              }}
              needPagination={props.needPagination}
              onRowClick={(row: any, column: any, event: Event) => { emit('rowClick', { rowData: row, column, event }) }}
              v-slots={{
                empty: slots?.commonTableEmpty,
                content: slots?.commonTableContent,
              }}
            />
            {slots?.commonTableRightPane?.({ height: commonTableRefHeight.value })}
          </Space>
        </Space>
        <CommonEditor
          ref={commonEditorRef}
          createApi={props.createApi}
          editApi={props.editApi}
          editFields={allEditFields.value}
          layout={props.editorLayout}
          effectHooks={fetchEffects.value}
          formatEditParams={props.formatEditParams}
          onConfirmSuccess={() => { query({ page: commonTableRef.value.pagination?.page }) }}
        />
      </>
    )
  }
})
