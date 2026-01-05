// LogSearchView.tsx
import { defineComponent, ref, computed, onMounted, onUnmounted, reactive, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import {
  ElSelect,
  ElOption,
  ElInput,
  ElIcon,
  ElButton,
  ElDialog,
  ElDrawer,
  ElMessage,
} from 'element-plus'
import { Search, Refresh, Edit, Delete } from '@element-plus/icons-vue'
import {
  getIndexList,
  getQueryConds,
  getLogHistogram,
  getLogList,
  setQueryConds,
  createLogStream,
  editQueryConds,
  deleteQueryConds,
  getIndexLogListApi,
  getFastFilterSchemaApi,
} from '~/api/logs/discover'
import { hasPermission } from '~/utils/auth'
import { getDatasourceUseList } from '~/api/configManagement/dataSource'
import {
  LogField,
  LogDocument,
  logChartData,
  FilterCondition,
  SavedView,
} from '~/api/logs/discover/interfaces'
import EnhancedSearchHeader from './components/EnhancedSearchHeader'
import { type ICondition } from '../retrieval/components/queryBuilder'
import FieldPanel from './components/FieldPanel'
import DocumentView from './components/DocumentView'
import FilterDialog from './components/FilterDialog'
import StatusFilter, { type StatusKey } from './components/StatusFilter'
import LogChart from './components/LogChart/index'
import FastFilterPanel, { type FastFilterData } from './components/fastFilterPanel'
import { FastFilterType } from './components/fastFilterPanel/constants'
import { FormilyForm } from '~/KeepUp'
import { getDataSourceIndexSchema } from './schema'
import { indexOptions } from '../retrieval/constants'
import { operatorOptions } from '../retrieval/components/queryBuilder/constants'
import type { IFormilyFormExpose } from '~/KeepUp'
import type { Field } from '@formily/core'
import styles from './index.module.scss'

export default defineComponent({
  name: 'LogSearchView',
  setup() {
    const route = useRoute()
    
    // 统一的检索条件状态管理
    const searchConditions = reactive({
      // 数据源和索引
      dataSourceId: '',
      indexType: '', // 索引类型
      indexId: null,
      indexName: '',

      // 搜索条件
      queryCondition: '' as string | ICondition,
      queryConditionObj: null as ICondition | null, // 新增：保存 ICondition 格式的查询条件
      filterConditions: [] as FilterCondition[],
      levels: [] as string[], // 日志级别筛选

      // 时间范围
      startTimestamp: null as number | null,
      endTimestamp: null as number | null,
      searchTimeType: 1 as 1 | 2, // 1: 绝对时间, 2: 相对时间
      minutesPast: undefined as number | undefined,

      // 分页参数
      page: 1,
      pageSize: 50,
      sortOrder: 'desc' as 'desc' | 'asc',
    })
    // 数据源列表总数
    const total = ref(0)

    // 初始化时间范围为"本月"
    const now = new Date()
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0)

    // 设置初始时间范围（本月：从本月第一天到当前时间）
    searchConditions.startTimestamp = firstDayOfMonth.getTime()
    searchConditions.endTimestamp = now.getTime()
    searchConditions.minutesPast = undefined

    // 其他状态
    const searchField = ref('')
    const showFilterDialog = ref(false)
    // 直接搜索的字符串列表（来自没有操作符的小方块）
    const directSearchStrings = ref<string[]>([])

    // 视图管理状态
    const activeViewId = ref<string | null>(null)
    const activeViewTitle = ref<string>('')
    const showSaveDialog = ref(false)
    const saveTitle = ref('')
    const showOpenDrawer = ref(false)
    const viewSearch = ref('')
    const savedViews = ref<SavedView[]>([])
    // 编辑/删除视图
    const editDialogVisible = ref(false)
    const editViewName = ref('')
    const editTargetId = ref<number | null>(null)
    const editLoading = ref(false)
    const deleteDialogVisible = ref(false)
    const deleteTargetId = ref<number | null>(null)
    const deleteLoading = ref(false)

    const isHasIndexList = ref<any>(false)
    
    // 快速筛查相关状态
    const fastFilterData = ref<FastFilterData>({})
    const fastFilterSelected = ref<Record<string, string[]>>({})
    const fastFilterLoading = ref(false)
    // EnhancedSearchHeader 实例引用
    const enhancedSearchHeaderRef = ref<{
      updateFastFilterBlocks: (unselectedItems: Record<string, Array<{ name: string; value: number }>>) => void
      loadFromCondition: (condition: ICondition & { conditionGroups?: any[] }) => void
      clearAllFastFilterBlocks: () => void
      clearFastFilterRelatedBlocks: (fastFilterTypes: string[]) => void
      getAllBlocksContent: () => string[]
      getCurrentQueryCondition: () => ICondition & { conditionGroups?: any[] } | null
      clearAllBlocks: () => void
    } | null>(null)
    
    // FormilyForm 相关
    const formilyFormRef = ref<IFormilyFormExpose>()
    const formRef = computed(() => formilyFormRef.value?.formRef)
    
    // 处理索引变化，调用查询接口
    const handleIndexChange = async (indexId: number | string) => {
      if (!indexId || !formRef.value) return
      
      // 使用 query 方法获取字段值
      const dataSourceIdField = formRef.value.query('void.selectGroup1.dataSourceId')?.take() as Field
      const indexTypeField = formRef.value.query('void.selectGroup2.indexGroup.indexType')?.take() as Field
      const indexIdField = formRef.value.query('void.selectGroup2.indexGroup.indexId')?.take() as Field
      const dataSourceId = dataSourceIdField?.value
      const indexType = indexTypeField?.value || ''
      
      if (!dataSourceId) {
        ElMessage.warning('请先选择数据源')
        return
      }
      
      // 尝试从索引列表的原始数据中获取真实的 indexId（数字）
      let actualIndexId: number = 0
      let indexName: string = ''
      
      if (indexIdField?.dataSource) {
        // 从 dataSource 中找到对应的选项
        const selectedOption = indexIdField.dataSource.find((opt: any) => opt.value === indexId)
        if (selectedOption) {
          // 如果 value 是数字，直接使用
          if (typeof selectedOption.value === 'number') {
            actualIndexId = selectedOption.value
            indexName = selectedOption.label || String(indexId)
              } else {
                // 如果 value 是字符串（indexName），需要重新获取索引列表来找到对应的 id
                try {
                  if (!indexType) {
                    // 如果没有索引类型，无法获取索引列表
                    actualIndexId = Number(indexId) || 0
                    indexName = String(indexId)
                  } else {
                    const res = await getIndexList({ dataSourceId, indexType })
                    // getIndexList 返回的数据结构可能是 { data: { list: [...] } } 或直接是数组
                    const indexList = (Array.isArray(res) ? res : (res as any)?.data?.list || []) as any[]
                    const indexItem = indexList.find((item: any) => 
                      item.indexName === indexId || item.id === indexId || item.indexId === indexId || item.name === indexId
                    )
                    if (indexItem) {
                      // 优先使用 indexId，然后是 id，最后尝试转换为数字
                      actualIndexId = (indexItem as any).indexId || (indexItem as any).id || Number((indexItem as any).id) || 0
                      indexName = (indexItem as any).indexName || (indexItem as any).name || String(indexId)
                    } else {
                      // 如果找不到，尝试将 indexId 转换为数字
                      actualIndexId = Number(indexId) || 0
                      indexName = String(indexId)
                    }
                  }
                } catch (error) {
                  console.error('获取索引详情失败:', error)
                  actualIndexId = Number(indexId) || 0
                  indexName = String(indexId)
                }
              }
        } else {
          // 如果找不到选项，尝试直接转换
          actualIndexId = Number(indexId) || 0
          indexName = String(indexId)
        }
      } else {
        // 如果没有 dataSource，尝试直接转换
        actualIndexId = Number(indexId) || 0
        indexName = String(indexId)
      }
      
      // 同步到 searchConditions
      searchConditions.dataSourceId = dataSourceId
      searchConditions.indexType = indexType || ''
      searchConditions.indexName = indexName
      searchConditions.indexId = actualIndexId
      
      // 构建 getIndexLogListApi 的参数
      // 切换索引时，保留快速筛选的 conditionGroups，以便在调用列表接口时带上这些条件
      const existingConditionGroups = searchConditions.queryConditionObj ? (searchConditions.queryConditionObj as any).conditionGroups || [] : []
      
      const apiParams: any = {
        dataSourceId,
        indexType: indexType || '',
        indexId: actualIndexId,
        page: searchConditions.page,
        pageSize: searchConditions.pageSize,
        sortOrder: searchConditions.sortOrder === 'asc' ? 'SORT_ORDER_ASC' : 'SORT_ORDER_DESC',
        startTimestamp: searchConditions.startTimestamp || 0,
        endTimestamp: searchConditions.endTimestamp || 0,
        queryCondition: searchConditions.queryConditionObj ? {
          logic: 'LOGIC_AND' as const,
          conditions: searchConditions.queryConditionObj.conditions.map(c => ({
            field: c.field || '',
            operator: c.operator || '',
            value: filterInvisibleChars(c.value !== undefined && c.value !== null ? String(c.value) : ''),
          })),
          conditionGroups: existingConditionGroups,
        } : {
          logic: 'LOGIC_AND' as const,
          conditions: [],
          conditionGroups: existingConditionGroups,
        },
        filterConditions: searchConditions.filterConditions || [],
      }
      
      // 按照顺序调用：先列表，再柱状图，最后tags
      // 切换索引时，需要清空查询条件
      await handleIndexChangeSequence(apiParams, true)
    }
    
    // 处理索引切换时的接口调用顺序：tags -> 列表 -> 柱状图
    const handleIndexChangeSequence = async (apiParams: any, shouldClearQuery: boolean = false) => {
      try {
        loading.value = true
        fieldsLoading.value = true
        
        // 1. 先调用快速筛查接口，确保快速筛查数据为空时清除搜索框中的快速筛查数据
        await getFastFilterData()
        
        // 2. 在构建 apiParams 之前，先同步搜索框内容到 queryConditionObj
        // 这样可以确保切换索引时，搜索框中的小方块值被正确包含在 updatedApiParams 中
        let currentQueryCondition: ICondition & { conditionGroups?: any[] } | null = null
        if (enhancedSearchHeaderRef.value) {
          const searchBoxContent = enhancedSearchHeaderRef.value.getAllBlocksContent()
          // 如果搜索框有内容，从搜索框获取最新的 queryCondition
          if (searchBoxContent.length > 0) {
            currentQueryCondition = enhancedSearchHeaderRef.value.getCurrentQueryCondition()
            if (currentQueryCondition) {
              // 更新 searchConditions.queryConditionObj，确保后续使用最新的数据
              searchConditions.queryConditionObj = currentQueryCondition
            }
          }
        }
        
        // 3. 重新构建 apiParams，使用同步后的 queryConditionObj
        // 如果 shouldClearQuery 为 true，说明是切换索引，此时过滤条件小方块会消失，需要从入参中去除 filterConditions
        const updatedApiParams: any = {
          ...apiParams,
          queryCondition: (() => {
            // 优先使用同步后的 queryConditionObj，如果没有则使用 searchConditions.queryConditionObj
            const queryConditionObj = currentQueryCondition || searchConditions.queryConditionObj
            
            // 使用 rebuildQueryCondition 重新构建，确保快速筛查小方块正确分类
            return rebuildQueryCondition(queryConditionObj)
          })(),
          // 如果 shouldClearQuery 为 true（切换索引），过滤条件小方块会消失，需要从入参中去除 filterConditions
          // 使用 searchConditions.filterConditions 而不是 apiParams.filterConditions，确保使用最新的状态
          filterConditions: shouldClearQuery ? [] : (Array.isArray(searchConditions.filterConditions) ? searchConditions.filterConditions : []),
        }
        
        // 4. 获取搜索框里的小方块内容并打印（用于调试）
        let searchBoxContent: string[] = []
        if (enhancedSearchHeaderRef.value) {
          searchBoxContent = enhancedSearchHeaderRef.value.getAllBlocksContent()
        }
        console.log(`========>🚀小方块${searchBoxContent.join(' ')}`, updatedApiParams)
        
        // 3. 然后调用列表接口
        const res = await getIndexLogListApi(updatedApiParams)
        const logList = res.data.list as LogDocument[]
        logDocuments.value = transformLogData(logList)
        total.value = res.data.total
        getAvailableFields(logList)
        
        // 只有在切换索引时才清空查询与时间范围（shouldClearQuery = true）
        // 用户主动查询时不应该清空查询条件，以保持快速筛选小方块的状态
        // 但是要保留快速筛选的 conditionGroups，以便在刷新快速筛查列表时能同步状态
        if (shouldClearQuery) {
          searchConditions.queryCondition = ''
          // 保留 conditionGroups，只清空 conditions
          if (searchConditions.queryConditionObj) {
            const existingConditionGroups = (searchConditions.queryConditionObj as any).conditionGroups || []
            searchConditions.queryConditionObj = {
              logic: 'LOGIC_AND' as const,
              conditions: [],
              conditionGroups: existingConditionGroups,
            } as any
          } else {
            searchConditions.queryConditionObj = null
          }
          searchConditions.filterConditions = []
        }
        if (logList.length > 0) {
          isHasIndexList.value = false
        } else {
          logChartDatas.value = []
          isHasIndexList.value = true
        }
        searchConditions.searchTimeType = 1
        searchConditions.minutesPast = undefined
        searchConditions.sortOrder = 'desc'
        
        // 4. 然后调用柱状图接口（使用日期范围选择框的时间）
        const chartParams = {
          dataSourceId: updatedApiParams.dataSourceId,
          indexType: updatedApiParams.indexType,
          indexId: updatedApiParams.indexId,
          startTimestamp: searchConditions.startTimestamp || 0,
          endTimestamp: searchConditions.endTimestamp || 0,
          queryCondition: updatedApiParams.queryCondition,
          filterConditions: updatedApiParams.filterConditions,
        }
        await getChartData(chartParams)
      } finally {
        loading.value = false
        fieldsLoading.value = false
      }
    }
    
    // 创建 effectHooks
    const effectHooks = computed(() => ({
      fieldEffects: {
        'void.selectGroup1.dataSourceId': {
          onFieldValueChange: async (field: Field) => {
            if (!field.selfModified) {
              return
            }
            // 同步到 searchConditions
            searchConditions.dataSourceId = field.value || ''
            // 清空索引选择
            const indexIdField = field.query('.indexId')?.take() as Field
            if (indexIdField) {
              indexIdField.value = ''
            }
            searchConditions.indexName = ''
            searchConditions.indexId = null
          },
        },
        'void.selectGroup2.indexGroup.indexType': {
          onFieldValueChange: async (field: Field) => {
            if (!field.selfModified) {
              return
            }
            // 同步索引类型到 searchConditions
            searchConditions.indexType = field.value || ''
            // 当索引类型变化时，清空索引ID选择
            const indexIdField = field.query('.indexId')?.take() as Field
            if (indexIdField) {
              indexIdField.value = ''
            }
            searchConditions.indexName = ''
            searchConditions.indexId = null
          },
        },
        'void.selectGroup2.indexGroup.indexId': {
          onFieldValueChange: async (field: Field) => {
            if (!field.selfModified) {
              return
            }
            const selectedValue = field.value
            if (selectedValue) {
              // 从 dataSource 中找到对应的选项，获取真实的 indexId
              const dataSource = field.dataSource || []
              const selectedOption = dataSource.find((opt: any) => opt.value === selectedValue)
              
              // 如果找到选项，尝试获取 id；否则使用 value（可能是 indexName）
              let actualIndexId: number | string = selectedValue
              if (selectedOption) {
                // 如果 value 是数字，直接使用；否则可能是 indexName，需要从原始数据中找
                if (typeof selectedOption.value === 'number') {
                  actualIndexId = selectedOption.value
                } else {
                  // value 是字符串（可能是 indexName），需要从原始数据中找对应的 id
                  const dataSourceIdField = formRef.value?.query('void.selectGroup1.dataSourceId')?.take() as Field
                  const indexTypeField = formRef.value?.query('void.selectGroup2.indexGroup.indexType')?.take() as Field
                  const dataSourceId = dataSourceIdField?.value
                  const indexType = indexTypeField?.value
                  
                  if (dataSourceId && indexType) {
                    try {
                      const res = await getIndexList({ dataSourceId, indexType } as any)
                      // getIndexList 返回的数据结构可能是 { data: { list: [...] } } 或直接是数组
                      const indexList = (Array.isArray(res) ? res : (res as any)?.data?.list || []) as any[]
                      const indexItem = indexList.find((item: any) => 
                        item.indexName === selectedValue || item.name === selectedValue || 
                        String(item.id) === String(selectedValue) || String(item.indexId) === String(selectedValue)
                      )
                      if (indexItem) {
                        actualIndexId = (indexItem as any).indexId || (indexItem as any).id || Number((indexItem as any).id) || 0
                      } else {
                        // 如果找不到，尝试将 selectedValue 转换为数字
                        actualIndexId = Number(selectedValue) || 0
                      }
                    } catch (error) {
                      console.error('获取索引详情失败:', error)
                      actualIndexId = Number(selectedValue) || 0
                    }
                  } else {
                    actualIndexId = Number(selectedValue) || 0
                  }
                }
              }
              
              await handleIndexChange(actualIndexId)
            } else {
              // 清空索引时，清空相关数据
              searchConditions.indexName = ''
              searchConditions.indexId = null
            }
          },
        },
      },
    }))
    
      // 监听 form 值变化，同步到 searchConditions
      watch(
        () => {
          if (!formRef.value) return null
          const dataSourceIdField = formRef.value.query('void.selectGroup1.dataSourceId')?.take() as Field
          const indexIdField = formRef.value.query('void.selectGroup2.indexGroup.indexId')?.take() as Field
          return {
            dataSourceId: dataSourceIdField?.value,
            indexId: indexIdField?.value,
          }
        },
        (values) => {
          if (!values) return
          const { dataSourceId, indexId } = values
          
          if (dataSourceId !== searchConditions.dataSourceId) {
            searchConditions.dataSourceId = dataSourceId || ''
          }
          if (indexId !== searchConditions.indexName) {
            searchConditions.indexName = indexId || ''
            searchConditions.indexId = indexId || null
          }
        },
        { deep: true }
      )
    
    const loadViews = async () => {
      try {
        openViewListLoading.value = true
        const res = await getQueryConds()
        savedViews.value = res.data.views || []
      } catch (error) {
        console.error('加载保存的视图失败:', error)
        savedViews.value = []
      } finally {
        openViewListLoading.value = false
      }
    }
    const resetToNewView = () => {
      activeViewId.value = null
      activeViewTitle.value = ''
      saveTitle.value = ''
    }
    const handleNew = async () => {
      resetToNewView()
      
      // 1. 清空搜索框（包括所有小方块）
      if (enhancedSearchHeaderRef.value) {
        // 清空所有小方块（包括普通小方块和快速筛查小方块）
        enhancedSearchHeaderRef.value.clearAllBlocks()
      }
      searchConditions.queryCondition = ''
      searchConditions.queryConditionObj = null
      
      // 2. 时间范围选择器重置为本月
      const now = new Date()
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0)
      searchConditions.startTimestamp = firstDayOfMonth.getTime()
      searchConditions.endTimestamp = now.getTime()
      searchConditions.searchTimeType = 1
      searchConditions.minutesPast = undefined
      
      // 3. 快速筛查的勾选状态改为全部勾选
      // 如果 fastFilterData 有数据，将所有项设置为选中状态
      const newSelected: Record<string, string[]> = {}
      Object.keys(fastFilterData.value).forEach((key) => {
        const allItems = fastFilterData.value[key].map(item => item.name)
        newSelected[key] = allItems
      })
      fastFilterSelected.value = newSelected
      
      // 4. 过滤条件全部清空
      searchConditions.filterConditions = []
      
      // 5. 重新调用列表接口走流程
      // 需要等待 DOM 更新
      await nextTick()
      // 调用 executeSearch 重新查询列表
      await executeSearch({})
    }
    const handleSave = () => {
      saveTitle.value = activeViewTitle.value || ''
      showSaveDialog.value = true
    }
    const confirmSave = async () => {
      try {
        // 构建与查询列表接口入参格式一致的 content
        // 统一处理：无论何种情况，调用列表接口时都要带上搜索框中的快速筛选小方块字段（conditionGroups）
        const existingConditionGroups = searchConditions.queryConditionObj 
          ? ((searchConditions.queryConditionObj as any).conditionGroups || [])
          : []
        
        // 构建 queryCondition，格式与查询列表接口一致
        const queryCondition = searchConditions.queryConditionObj ? {
          logic: 'LOGIC_AND' as const,
          conditions: searchConditions.queryConditionObj.conditions.map(c => ({
            field: String(c.field || ''),
            operator: String(c.operator || ''),
            value: filterInvisibleChars(c.value !== undefined && c.value !== null ? String(c.value) : ''),
          })),
          conditionGroups: existingConditionGroups,
        } : {
          logic: 'LOGIC_AND' as const,
          conditions: [],
          conditionGroups: existingConditionGroups,
        }
        
        // 构建与 IGetIndexLogListApiParams 格式一致的 content
        const contentData = {
          dataSourceId: searchConditions.dataSourceId,
          indexType: searchConditions.indexType,
          indexId: searchConditions.indexId || 0,
          page: searchConditions.page,
          pageSize: searchConditions.pageSize,
          sortOrder: searchConditions.sortOrder === 'asc' ? 'SORT_ORDER_ASC' : 'SORT_ORDER_DESC',
          startTimestamp: searchConditions.startTimestamp || 0,
          endTimestamp: searchConditions.endTimestamp || 0,
          queryCondition: queryCondition,
          filterConditions: searchConditions.filterConditions || [],
        }
        
        const params: any = {
          viewName: saveTitle.value,
          content: JSON.stringify(contentData),
        }
        saveViewLoading.value = true
        await setQueryConds(params)
        saveViewLoading.value = true
        ElMessage.success('保存成功')

        // 重新加载视图列表
        await loadViews()

        // 设置当前活动视图
        const savedView = savedViews.value.find((v) => v.viewName === saveTitle.value)
        if (savedView) {
          activeViewId.value = savedView.viewName
          activeViewTitle.value = savedView.viewName
        }

        showSaveDialog.value = false
      } catch (error) {
        console.error('保存失败:', error)
        ElMessage.error('保存失败')
      } finally {
        saveViewLoading.value = false
      }
    }
    const handleOpen = async () => {
      viewSearch.value = ''
      showOpenDrawer.value = true
      await loadViews()
    }
    const filteredViews = computed(() => {
      const q = viewSearch.value.trim().toLowerCase()
      if (!q) return savedViews.value
      return savedViews.value.filter((v) => v.viewName.toLowerCase().includes(q))
    })
    const openView = async (v: SavedView) => {
      activeViewId.value = v.viewName
      activeViewTitle.value = v.viewName

      // 解析 content 字段（JSON 字符串），格式与 IGetIndexLogListApiParams 一致
      let parsedContent: any = null
      if (v.content) {
        try {
          parsedContent = JSON.parse(v.content)
        } catch (error) {
          console.error('解析视图 content 失败:', error)
          ElMessage.error('解析视图内容失败')
          return
        }
      }

      // 如果有解析后的 content，使用 content 中的数据；否则使用 v 对象中的字段（兼容旧数据）
      const viewData = parsedContent || v

      // 更新所有检索条件（格式与 IGetIndexLogListApiParams 一致）
      searchConditions.dataSourceId = viewData.dataSourceId || ''
      searchConditions.indexType = viewData.indexType || ''
      searchConditions.indexId = viewData.indexId || null
      searchConditions.indexName = viewData.indexName || ''
      
      // 处理 queryCondition（格式与接口一致）
      if (viewData.queryCondition) {
        // queryCondition 应该是对象格式，包含 logic、conditions、conditionGroups
        if (typeof viewData.queryCondition === 'object' && viewData.queryCondition !== null && !Array.isArray(viewData.queryCondition) && 'logic' in viewData.queryCondition) {
          searchConditions.queryConditionObj = viewData.queryCondition as ICondition
          searchConditions.queryCondition = ''
        } else {
          // 兼容旧格式（字符串）
          searchConditions.queryCondition = (typeof viewData.queryCondition === 'string' ? viewData.queryCondition : '') || ''
          searchConditions.queryConditionObj = null
        }
      } else {
        searchConditions.queryCondition = ''
        searchConditions.queryConditionObj = null
      }
      
      // 如果 viewData.filterConditions 存在（包括空数组），直接使用；否则设置为空数组
      searchConditions.filterConditions = Array.isArray(viewData.filterConditions) ? viewData.filterConditions : []
      
      // 处理时间相关字段
      if (viewData.startTimestamp !== undefined) {
        searchConditions.startTimestamp = Number(viewData.startTimestamp)
      }
      if (viewData.endTimestamp !== undefined) {
        searchConditions.endTimestamp = Number(viewData.endTimestamp)
      }
      
      // 处理分页参数
      if (viewData.page !== undefined) {
        searchConditions.page = viewData.page
      }
      if (viewData.pageSize !== undefined) {
        searchConditions.pageSize = viewData.pageSize
      }
      if (viewData.sortOrder) {
        searchConditions.sortOrder = viewData.sortOrder === 'SORT_ORDER_ASC' ? 'asc' : 'desc'
      }

      // 关闭抽屉
      showOpenDrawer.value = false

      // 如果没有 indexType，需要根据 indexName 推断 indexType
      // 先尝试"原始索引"，如果找不到，再尝试"索引模版"
      let inferredIndexType: string | undefined = viewData.indexType
      
      if (!inferredIndexType && viewData.dataSourceId && viewData.indexName) {
        try {
          // 先尝试"原始索引"
          const originalIndexValue = indexOptions.find(opt => opt.label === '原始索引')?.value
          if (originalIndexValue) {
            const res = await getIndexList({
              dataSourceId: viewData.dataSourceId,
              indexType: originalIndexValue,
            } as any)
            const indexList = (Array.isArray(res) ? res : (res as any)?.data?.list || []) as any[]
            const foundIndex = indexList.find((item: any) => 
              item.indexName === viewData.indexName || item.name === viewData.indexName
            )
            if (foundIndex) {
              inferredIndexType = originalIndexValue
            } else {
              // 如果原始索引中找不到，尝试"索引模版"
              const templateIndexValue = indexOptions.find(opt => opt.label === '索引模版')?.value
              if (templateIndexValue) {
                const res2 = await getIndexList({
                  dataSourceId: viewData.dataSourceId,
                  indexType: templateIndexValue,
                } as any)
                const indexList2 = (Array.isArray(res2) ? res2 : (res2 as any)?.data?.list || []) as any[]
                const foundIndex2 = indexList2.find((item: any) => 
                  item.indexName === viewData.indexName || item.name === viewData.indexName
                )
                if (foundIndex2) {
                  inferredIndexType = templateIndexValue
                }
              }
            }
          }
        } catch (error) {
          console.error('推断索引类型失败:', error)
        }
      }

      // 调用 init 函数，传入解析后的筛选条件（格式与 IGetIndexLogListApiParams 一致）
      await init({
        dataSourceId: viewData.dataSourceId,
        indexType: inferredIndexType || viewData.indexType,
        indexId: viewData.indexId,
        indexName: viewData.indexName,
        queryCondition: viewData.queryCondition,
        queryConditionObj: searchConditions.queryConditionObj,
        filterConditions: Array.isArray(viewData.filterConditions) ? viewData.filterConditions : [],
        startTimestamp: viewData.startTimestamp !== undefined ? Number(viewData.startTimestamp) : undefined,
        endTimestamp: viewData.endTimestamp !== undefined ? Number(viewData.endTimestamp) : undefined,
        page: viewData.page,
        pageSize: viewData.pageSize,
        sortOrder: searchConditions.sortOrder,
      })

      // 等待 init 完成后，回显小方块数据到搜索框
      await nextTick()
      if (searchConditions.queryConditionObj && enhancedSearchHeaderRef.value) {
        enhancedSearchHeaderRef.value.loadFromCondition(searchConditions.queryConditionObj as ICondition & { conditionGroups?: any[] })
      }
    }

    // 触发编辑
    const handleEditView = (v: SavedView) => {
      editTargetId.value = v.id
      editViewName.value = v.viewName || ''
      editDialogVisible.value = true
    }
    // 提交编辑
    const confirmEditView = async () => {
      if (!editTargetId.value || !editViewName.value.trim()) return
      try {
        editLoading.value = true
        await editQueryConds({ id: editTargetId.value, viewName: editViewName.value.trim() })
        await loadViews()
        // 如果当前活动视图就是被编辑的，更新标题
        if (activeViewId.value === activeViewTitle.value) {
          activeViewTitle.value = editViewName.value.trim()
        }
        editDialogVisible.value = false
        ElMessage.success('修改成功')
      } catch (e) {
        ElMessage.error('修改失败')
      } finally {
        editLoading.value = false
      }
    }

    // 触发删除
    const handleDeleteView = (v: SavedView) => {
      deleteTargetId.value = v.id
      deleteDialogVisible.value = true
    }
    // 确认删除
    const confirmDeleteView = async () => {
      if (!deleteTargetId.value) return
      try {
        deleteLoading.value = true
        await deleteQueryConds(deleteTargetId.value)
        await loadViews()
        // 如果删除当前活动视图，重置
        if (activeViewId.value && savedViews.value.every((sv) => sv.id !== deleteTargetId.value)) {
          activeViewId.value = null
          activeViewTitle.value = ''
        }
        deleteDialogVisible.value = false
        ElMessage.success('删除成功')
      } catch (e) {
        ElMessage.error('删除失败')
      } finally {
        deleteLoading.value = false
      }
    }

    // 字段数据 - 初始化为空，将从API动态获取
    const availableFields = ref<LogField[]>([])

    // 示例日志数据
    const logDocuments = ref<any[]>([])
    const logChartDatas = ref<logChartData[]>([])

    const currentDocument = ref(logDocuments.value[0])

    // Loading状态
    const loading = ref(false)
    const chartLoading = ref(false)
    const fieldsLoading = ref(false)
    const saveViewLoading = ref(false)
    const openViewListLoading = ref(false)

    // SSE连接状态
    const isStreaming = ref(false)
    const logStream = ref<EventSource | null>(null)

    // 搜索关键字（只在查询后生效）
    const searchKey = ref('')

    // 处理分页参数变化
    const handlePaginationUpdate = (params: {
      page: number
      pageSize: number
      sortOrder: 'desc' | 'asc'
    }) => {
      searchConditions.page = params.page
      searchConditions.pageSize = params.pageSize
      searchConditions.sortOrder = params.sortOrder
      console.log('分页参数更新:', params)
      // 这里可以触发重新查询数据
      const normalizedSearchTimeType =
        searchConditions.searchTimeType === 2
          ? 'SEARCH_TIME_TYPE_RELATIVE'
          : 'SEARCH_TIME_TYPE_ABSOLUTE'

      let payLoad: any = {
        dataSourceId: searchConditions.dataSourceId,
        indexName: searchConditions.indexName,
        filterConditions: searchConditions.filterConditions,
        queryCondition: searchConditions.queryCondition,
        searchTimeType: normalizedSearchTimeType,
      }

      if (normalizedSearchTimeType === 'SEARCH_TIME_TYPE_RELATIVE') {
        if (typeof searchConditions.minutesPast !== 'undefined') {
          payLoad.minutesPast = searchConditions.minutesPast
        }
      } else {
        if (typeof searchConditions.startTimestamp !== 'undefined') {
          payLoad.startTimestamp = searchConditions.startTimestamp
        }
        if (typeof searchConditions.endTimestamp !== 'undefined') {
          payLoad.endTimestamp = searchConditions.endTimestamp
        }
      }
      payLoad = {
        ...payLoad,
        page: searchConditions.page,
        pageSize: searchConditions.pageSize,
        sortOrder: searchConditions.sortOrder === 'asc' ? 'SORT_ORDER_ASC' : 'SORT_ORDER_DESC',
      }
      getList(payLoad)
    }

    // 计算属性
    const selectedFields = computed(() =>
      availableFields.value.filter((field) => field.selected).map((field) => field.name),
    )
    // Status counts based on example data. In real use, compute from response.
    const statusChecked = ref<StatusKey[]>(['Error', 'Warn', 'Info', 'Fatal', 'Debug'])

    // 初始化levels
    searchConditions.levels = statusChecked.value.map((key) => key.toUpperCase())

    // 将StatusKey转换为后端需要的格式（如'Error' -> 'ERROR'）
    const statusKeyToLevel = (key: StatusKey): string => {
      return key.toUpperCase()
    }

    // 处理状态改变，调用executeSearch
    const handleStatusChange = async (newStatuses: StatusKey[]) => {
      // 更新状态选中值
      statusChecked.value = newStatuses

      // 转换为后端需要的levels格式
      searchConditions.levels = newStatuses.map(statusKeyToLevel)

      // 如果已选择数据源和索引，则调用查询
      if (searchConditions.dataSourceId && searchConditions.indexName) {
        await executeSearch({})
      }
    }
    const statusCounts = computed<Record<StatusKey, number>>(() => {
      // 假计数：可根据 logDocuments 实际字段统计，比如 level 或 status
      const counts: Record<StatusKey, number> = { Error: 0, Warn: 0, Info: 0, Fatal: 0, Debug: 0 }
      logChartDatas.value.forEach((d) => {
        const level = (d as any).level as string | undefined
        if (!level) return

        // 处理后端返回的全大写格式，如 ERROR, WARN, INFO
        const normalizedLevel = level.toUpperCase()
        let key: StatusKey

        if (normalizedLevel === 'ERROR') key = 'Error'
        else if (normalizedLevel === 'WARN') key = 'Warn'
        else if (normalizedLevel === 'INFO') key = 'Info'
        else if (normalizedLevel === 'FATAL') key = 'Fatal'
        else if (normalizedLevel === 'DEBUG') key = 'Debug'
        else {
          // 如果不是标准格式，尝试首字母大写
          key = (level[0].toUpperCase() + level.slice(1).toLowerCase()) as StatusKey
        }

        if (counts[key] !== undefined) counts[key] = counts[key] + +d.count
      })
      console.log(counts)
      return counts
    })

    const selectedFieldObjects = computed(() => {
      const selectedFields = availableFields.value.filter((field) => field.selected)

      // 如果没有选中任何字段，默认显示 _source 字段
      if (selectedFields.length === 0) {
        const sourceField = availableFields.value.find((field) => field.name === '_source')
        if (sourceField) {
          // 检查搜索条件，如果 _source 字段名不匹配搜索条件，则不显示
          if (searchField.value.trim()) {
            const searchTerm = searchField.value.trim().toLowerCase()
            if (sourceField.name.toLowerCase().includes(searchTerm)) {
              return [sourceField]
            } else {
              return [] // 不匹配搜索条件，返回空数组
            }
          }
          return [sourceField]
        }
      }

      // 根据搜索字段进行过滤
      if (searchField.value.trim()) {
        const searchTerm = searchField.value.trim().toLowerCase()
        return selectedFields.filter((field) => field.name.toLowerCase().includes(searchTerm))
      }

      return selectedFields
    })

    const availableFieldObjects = computed(() => {
      const unselectedFields = availableFields.value.filter((field) => !field.selected)

      // 根据搜索字段进行过滤
      if (searchField.value.trim()) {
        const searchTerm = searchField.value.trim().toLowerCase()
        return unselectedFields.filter((field) => field.name.toLowerCase().includes(searchTerm))
      }

      return unselectedFields
    })

    // 方法
    const toggleFieldSelection = (field: LogField) => {
      field.selected = !field.selected

      // 如果选中了其他字段，自动取消 _source 字段的选中状态
      if (field.selected) {
        const sourceField = availableFields.value.find((f) => f.name === '_source')
        if (sourceField && sourceField.selected) {
          sourceField.selected = false
        }
      }
    }
    
    // 处理快速筛查变化
    const handleFastFilterChange = (selected: Record<string, string[]>) => {
      // 计算未选中的项（全选 - 当前选中 = 未选中）
      // 格式：{ key: [{ name: string, value: number }] }
      const unselectedItems: Record<string, Array<{ name: string; value: number }>> = {}
      Object.keys(fastFilterData.value).forEach((key) => {
        const allItems = fastFilterData.value[key]
        const currentSelected = selected[key] || []
        const unselected = allItems.filter(item => !currentSelected.includes(item.name))
        if (unselected.length > 0) {
          unselectedItems[key] = unselected
        }
      })
      
      // 通过 EnhancedSearchHeader 的 QueryBuilder 更新搜索框
      if (enhancedSearchHeaderRef.value) {
        enhancedSearchHeaderRef.value.updateFastFilterBlocks(unselectedItems)
      }
    }
    
    // 处理快速筛查恢复（当删除搜索框中的快速筛查方块时）
    const handleFastFilterRestore = (data: { key: string; itemNames: string[] }) => {
      // 重新选中对应的选项
      const currentSelected = fastFilterSelected.value[data.key] || []
      const newSelected = [...new Set([...currentSelected, ...data.itemNames])]
      fastFilterSelected.value = {
        ...fastFilterSelected.value,
        [data.key]: newSelected
      }
    }

    // 处理查询数据
    const executeSearch = async (queryData: any) => {
      if (!searchConditions.dataSourceId) {
        ElMessage.warning('请选择数据源')
        return
      }
      if (!searchConditions.indexType) {
        ElMessage.warning('请选择索引类型')
        return
      }
      if (!searchConditions.indexId) {
        ElMessage.warning('请选择索引')
        return
      }
      if (
        searchConditions.searchTimeType === 1 &&
        (!searchConditions.startTimestamp || !searchConditions.endTimestamp)
      ) {
        ElMessage.warning('请选择时间范围')
        return
      }
      if (searchConditions.searchTimeType === 2) {
        searchConditions.minutesPast = 15
      }
      // 同步查询数据到统一状态
      if (Object.keys(queryData).length !== 0) {
        // 如果 queryData 中有 queryConditionObj（ICondition 格式），优先使用
        if (queryData.queryConditionObj) {
          searchConditions.queryConditionObj = queryData.queryConditionObj
          // 同时更新字符串格式用于显示
          searchConditions.queryCondition = queryData.queryCondition || ''
        } else if (queryData.queryCondition) {
          // 兼容旧的字符串格式
          searchConditions.queryCondition = queryData.queryCondition
          searchConditions.queryConditionObj = null
        }
        if (queryData.searchTimeType) {
          searchConditions.searchTimeType = queryData.searchTimeType
        }
        if (queryData.startTimestamp) {
          searchConditions.startTimestamp = queryData.startTimestamp
        }
        if (queryData.endTimestamp) {
          searchConditions.endTimestamp = queryData.endTimestamp
        }
        if (queryData.minutesPast) {
          searchConditions.minutesPast = queryData.minutesPast
        }
      }

      // 先调用快速筛查接口，确保快速筛查数据为空时清除搜索框中的快速筛查数据
      await getFastFilterData()
      
      
      // 构建 getIndexLogListApi 的参数
      const apiParams: any = {
        dataSourceId: searchConditions.dataSourceId,
        indexType: searchConditions.indexType,
        indexId: searchConditions.indexId,
        page: searchConditions.page,
        pageSize: searchConditions.pageSize,
        sortOrder: searchConditions.sortOrder === 'asc' ? 'SORT_ORDER_ASC' : 'SORT_ORDER_DESC',
        startTimestamp: searchConditions.startTimestamp || 0,
        endTimestamp: searchConditions.endTimestamp || 0,
        queryCondition: (() => {
          // 统一处理：无论何种情况，调用列表接口时都要带上搜索框中的快速筛选小方块字段（conditionGroups）
          const existingConditionGroups = searchConditions.queryConditionObj 
            ? ((searchConditions.queryConditionObj as any).conditionGroups || [])
            : []
          
          if (searchConditions.queryConditionObj) {
            const mappedConditions = searchConditions.queryConditionObj.conditions.map(c => {
              // 确保 field、operator、value 三个字段始终存在，不能缺少任何一个
              const condition = {
                field: String(c.field || ''),
                operator: String(c.operator || ''),
                value: filterInvisibleChars(c.value !== undefined && c.value !== null ? String(c.value) : ''),
              }
              // 验证三个字段都存在
              if (!condition.field || !condition.operator || condition.value === undefined) {
                console.error('[executeSearch] 警告：条件缺少必要字段！', JSON.stringify({ input: c, output: condition }, null, 2))
              }
              return condition
            })
            console.log('[executeSearch] queryConditionObj.conditions:', JSON.stringify(searchConditions.queryConditionObj.conditions, null, 2))
            console.log('[executeSearch] mapped conditions:', JSON.stringify(mappedConditions, null, 2))
            const queryCondition = {
              logic: 'LOGIC_AND' as const,
              conditions: mappedConditions,
              conditionGroups: existingConditionGroups,
            }
            console.log('[executeSearch] 完整 queryCondition 对象:', JSON.stringify(queryCondition, null, 2))
            return queryCondition
      } else {
            // 即使 queryConditionObj 为 null，也要带上可能存在的 conditionGroups（从之前的 queryConditionObj 中保留）
            return {
              logic: 'LOGIC_AND' as const,
              conditions: [],
              conditionGroups: existingConditionGroups,
            }
          }
        })(),
        filterConditions: Array.isArray(searchConditions.filterConditions) ? searchConditions.filterConditions : [],
      }

      console.log('apiParams=======>', apiParams)

      // 构建 getIndexLogListApi 的参数
      // 先同步搜索框内容到 queryConditionObj
      let currentQueryCondition: ICondition & { conditionGroups?: any[] } | null = null
      if (enhancedSearchHeaderRef.value) {
        const searchBoxContent = enhancedSearchHeaderRef.value.getAllBlocksContent()
        if (searchBoxContent.length > 0) {
          currentQueryCondition = enhancedSearchHeaderRef.value.getCurrentQueryCondition()
          if (currentQueryCondition) {
            searchConditions.queryConditionObj = currentQueryCondition
          }
        }
      }
      
      // 使用 rebuildQueryCondition 重新构建 queryCondition，确保快速筛查小方块正确分类
      const rebuiltQueryCondition = rebuildQueryCondition(searchConditions.queryConditionObj)
      
      // 构建最终的 API 参数
      const updatedApiParams: any = {
        dataSourceId: searchConditions.dataSourceId,
        indexType: searchConditions.indexType,
        indexId: searchConditions.indexId,
        page: searchConditions.page,
        pageSize: searchConditions.pageSize,
        sortOrder: searchConditions.sortOrder === 'asc' ? 'SORT_ORDER_ASC' : 'SORT_ORDER_DESC',
        startTimestamp: searchConditions.startTimestamp || 0,
        endTimestamp: searchConditions.endTimestamp || 0,
        queryCondition: rebuiltQueryCondition,
        filterConditions: Array.isArray(searchConditions.filterConditions) ? searchConditions.filterConditions : [],
      }

      // 打印完整的查询参数对象
      console.log('[executeSearch] 完整查询参数对象:', JSON.stringify(updatedApiParams, null, 2))
      console.log('[executeSearch] queryCondition 详情:', JSON.stringify(updatedApiParams.queryCondition, null, 2))

      // 使用新的 API
      // 注意：快速筛选状态的同步在 getFastFilterData 中进行，因为需要等待快速筛选数据刷新后同步
      // 用户主动查询时，不应该清空查询条件（shouldClearQuery = false），以保持快速筛选小方块的状态
      // 传入 skipFastFilterData: true，因为 executeSearch 已经调用了 getFastFilterData()，避免重复调用
      // await getIndexLogListData(updatedApiParams, false, true)
      await getIndexLogListData(updatedApiParams, false, true)

      // 查询后更新searchKey
      const queryConditionStr = typeof searchConditions.queryCondition === 'string' 
        ? searchConditions.queryCondition 
        : ''
      searchKey.value = queryConditionStr
        ? queryConditionStr.split(' ')[0] || ''
        : ''
      
      // 提取没有操作符的小方块内容（直接搜索的字符串）
      if (searchConditions.queryConditionObj) {
        directSearchStrings.value = searchConditions.queryConditionObj.conditions
          .filter(c => !c.field && !c.operator && c.value)
          .map(c => String(c.value))
      } else {
        directSearchStrings.value = []
      }
    }
    // 获取图表数据
    const getChartData = async (params: any) => {
      try {
        chartLoading.value = true
        // 构建柱状图查询参数（使用新的 API 格式）
        const chartParams: any = {
          dataSourceId: params.dataSourceId,
          indexType: params.indexType,
          indexId: params.indexId,
          startTimestamp: params.startTimestamp,
          endTimestamp: params.endTimestamp,
          queryCondition: params.queryCondition,
          filterConditions: params.filterConditions || [],
        }
        const resCharts = await getLogHistogram(chartParams as any)
        logChartDatas.value = resCharts.data.histogram
      } finally {
        chartLoading.value = false
      }
    }
    // 获取日志列表
    const getList = async (params) => {
      try {
        loading.value = true
        fieldsLoading.value = true
        const res = await getLogList(params)
        const logList = res.data.list as LogDocument[]
        logDocuments.value = transformLogData(logList)
        total.value = res.data.total
        getAvailableFields(logList)
      } finally {
        loading.value = false
        fieldsLoading.value = false
      }
    }
    // 从第一个日志条目的logJson动态解析字段
    const getAvailableFields = (logList) => {
      if (logList && logList.length > 0) {
        const firstLog = logList[0]
        if (firstLog && firstLog.logJson) {
          const parsedFields = parseFieldsFromLogJson(firstLog.logJson)
          availableFields.value = parsedFields.filter((field) => !field.name.includes('_source.'))
        }
      }
    }

    const addFilterCondition = (filter: FilterCondition) => {
      searchConditions.filterConditions.push(filter)
    }
    // 打开添加过滤条件弹框
    const handleAddFilter = () => {
      showFilterDialog.value = true
    }
    // 从logJson动态解析字段
    const parseFieldsFromLogJson = (logJson: string) => {
      try {
        const logData = JSON.parse(logJson)
        const fields: LogField[] = []

        // 递归解析 logData 中的字段
        const parseObjectFields = (obj: any, prefix = '') => {
          // 如果存在 _source，则拍平到当前对象
          if (obj && typeof obj === 'object' && obj._source && typeof obj._source === 'object') {
            Object.assign(obj, obj._source) // 将 _source 的字段展开到 obj
            // delete obj._source // 删除原来的 _source 字段
          }

          Object.keys(obj).forEach((key) => {
            const fullKey = prefix ? `${prefix}.${key}` : key
            const value = obj[key]
            let type = 'string'

            if (value === null) {
              type = 'string'
            } else if (typeof value === 'number') {
              type = 'number'
            } else if (typeof value === 'boolean') {
              type = 'boolean'
            } else if (value instanceof Date) {
              type = 'date'
            } else if (typeof value === 'object' && value !== null) {
              type = 'object'
              // 递归处理嵌套对象
              parseObjectFields(value, fullKey)
            } else if (typeof value === 'string') {
              // 尝试判断是否为日期字符串
              if (key.toLowerCase().includes('time') || key.toLowerCase().includes('date')) {
                type = 'date'
              } else {
                type = 'string'
              }
            }

            // 避免重复添加字段
            if (!fields.some((f) => f.name === fullKey)) {
              fields.push({
                name: fullKey,
                type,
                selected: false,
              })
            }
          })
        }

        parseObjectFields(logData)
        return fields
      } catch (error) {
        console.error('解析logJson失败:', error)
        return []
      }
    }

    // 处理日志数据，将 logJson 字符串转换为对象
    const transformLogData = (data: LogDocument[]) => {
      return data.map((item) => {
        try {
          let logData: Record<string, any> = {}

          // 1️⃣ 兼容：如果存在 logJson 且是字符串，则尝试解析
          if (item.logJson && typeof item.logJson === 'string') {
            logData = JSON.parse(item.logJson)
          }
          // 2️⃣ 否则，认为 item 已经是解析后的对象
          else if (typeof item === 'object' && item !== null) {
            logData = { ...item }
          }

          // 3️⃣ 创建新对象，包含 timestamp 和解析结果
          const result: Record<string, any> = {
            timestamp: item.timestamp,
            ...logData,
          }

          // 4️⃣ 如果存在 _source 字段，将其拍平到第一层级
          if (logData._source && typeof logData._source === 'object') {
            Object.entries(logData._source).forEach(([key, value]) => {
              result[key] = value
            })
            delete result._source
          }

          return result
        } catch (error) {
          console.error('解析 JSON 失败:', error)
          // 返回原始数据并标记解析错误
          return {
            timestamp: item.timestamp,
            logJson: item.logJson ?? item,
            parseError: true,
          }
        }
      })
    }


    // 启动SSE日志流
    const startLogStream = () => {
      if (!searchConditions.indexId) {
        ElMessage.warning('请先选择索引')
        return
      }

      // 如果已有连接，先关闭
      if (logStream.value) {
        stopLogStream()
      }

      try {
        logStream.value = createLogStream(searchConditions.indexId)
        isStreaming.value = true
        // 监听消息
        logStream.value.onmessage = (event) => {
          try {
            const newLogData = JSON.parse(event.data).list
            if (Array.isArray(newLogData)) {
              // 将新日志数据添加到现有列表中
              const transformedLogs = transformLogData(newLogData)
              if (logDocuments.value.length <= 0) {
                getAvailableFields(newLogData)
              }
              logDocuments.value = [...transformedLogs, ...logDocuments.value]

              // 更新图表数据
              const newChartData = transformedLogs.map((log) => ({
                time: log.timestamp,
                level: (log as any).level || 'INFO',
                count: '1',
              }))
              logChartDatas.value = [...logChartDatas.value, ...newChartData]
            }
          } catch (error) {
            console.error('解析SSE日志数据失败:', error)
          }
        }

        // 监听错误
        logStream.value.onerror = (error) => {
          console.error('SSE连接错误:', error)
          ElMessage.error('日志流连接失败')
          stopLogStream()
        }

        // 监听连接关闭
        logStream.value.onopen = () => {
          console.log('SSE日志流连接已建立')
        }
      } catch (error) {
        console.error('创建SSE连接失败:', error)
        ElMessage.error('启动日志流失败')
        isStreaming.value = false
      }
    }

    // 停止SSE日志流
    const stopLogStream = () => {
      if (logStream.value) {
        logStream.value.close()
        logStream.value = null
      }
      isStreaming.value = false
      console.log('SSE日志流连接已关闭')
    }

    // 切换日志流状态
    const toggleLogStream = async () => {
      if (isStreaming.value) {
        // 关闭流，然后执行一次正常查询
        stopLogStream()
        searchConditions.searchTimeType = 1
        await executeSearch({})
      } else {
        console.log(searchConditions)
        // 开启前先执行一次正常查询（若未选索引则内部会提示并中断）
        if (!searchConditions.dataSourceId) {
          ElMessage.warning('请选择数据源')
          return
        }
        if (!searchConditions.indexId) {
          ElMessage.warning('请选择索引')
          return
        }
        // 只清空 queryCondition、filterConditions、levels 三个字段
        // 但是要保留快速筛选的 conditionGroups，以便在刷新快速筛查列表时能同步状态
        searchConditions.queryCondition = ''
        // 保留 conditionGroups，只清空 conditions
        if (searchConditions.queryConditionObj) {
          const existingConditionGroups = (searchConditions.queryConditionObj as any).conditionGroups || []
          searchConditions.queryConditionObj = {
            logic: 'LOGIC_AND' as const,
            conditions: [],
            conditionGroups: existingConditionGroups,
          } as any
        } else {
          searchConditions.queryConditionObj = null
        }
        searchConditions.filterConditions = []
        // 重置 levels 为全选状态（默认值）
        statusChecked.value = ['Error', 'Warn', 'Info', 'Fatal', 'Debug']
        searchConditions.levels = statusChecked.value.map((key) => key.toUpperCase())

        // 清除搜索关键字
        searchKey.value = ''

        searchConditions.searchTimeType = 2
        searchConditions.minutesPast = 15
        await executeSearch({})
        startLogStream()
      }
    }
    // 根据搜索框中的快速筛选小方块同步快速筛选的勾选状态
    // 统一处理：无论何种情况，只要快速筛查列表刷新，都要和顶部搜索框的小方块做对比
    // 重新构建 queryCondition，根据快速筛查类型正确分类小方块
    // 方块分两种：快速筛查方块和自定义方块
    // 快速筛查方块判断条件：
    //   1. 首字符为 `-`
    //   2. `-` 之后第一个单词能和快速筛查中某一栏匹配（字段名匹配）
    //   3. 第一个单词后是 `:`
    //   4. `:` 后的一个或多个单词能和快速筛查匹配（值匹配）
    // 过滤不可见字符的辅助函数
    const filterInvisibleChars = (str: string): string => {
      if (typeof str !== 'string') {
        return String(str || '')
      }
      return str.replace(/[\u200B-\u200D\uFEFF]/g, '')
    }

    const rebuildQueryCondition = (queryConditionObj: ICondition & { conditionGroups?: any[] } | null): ICondition & { conditionGroups?: any[] } => {
      // 获取所有小方块内容（已经是数组格式，每个元素是一个小方块的内容）
      let blockValues: string[] = []
      if (enhancedSearchHeaderRef.value) {
        blockValues = enhancedSearchHeaderRef.value.getAllBlocksContent()
      }
      
      // 如果没有小方块内容，返回空结果
      if (blockValues.length === 0) {
        return {
          logic: 'LOGIC_AND' as const,
          conditions: [],
          conditionGroups: undefined,
        }
      }
      
      // 分类：快速筛查和普通条件
      const fastFilterGroups: Record<string, Array<{ field: string; operator: string; value: string }>> = {}
      const normalConditions: Array<{ field: string; operator: string; value: string }> = []
      
      // 操作符选项列表（从 constants.ts 导入，包含所有操作符，如"字段不存在"等）
      // 按 label 长度降序排序，确保长操作符（如"字段不存在"）优先匹配
      const sortedOperatorOptions = [...operatorOptions].sort((a, b) => b.label.length - a.label.length)
      
      // 遍历所有小方块内容，逐个验证和处理
      blockValues.forEach(blockValue => {
        console.log('sdsadasdsa-------->', { blockValue })
        // 判断是否为快速筛查方块
        let isFastFilterBlock = false
        let fastFilterFieldName = ''
        let fastFilterValues: string[] = []
        
        // 检查是否以 `-` 开头
        if (blockValue.startsWith('-')) {
          // 提取 `-` 后面的内容
          const afterDash = blockValue.slice(1)
          const colonIndex = afterDash.indexOf(':')
          
          // 必须有 `:`
          if (colonIndex !== -1) {
            // 提取字段名（`:` 前面的内容，第一个单词）
            const fieldName = afterDash.slice(0, colonIndex).trim()
            
            // 检查字段名是否在 FastFilterType 枚举中（大小写不敏感）
            const fastFilterTypeValues = Object.values(FastFilterType) as string[]
            const matchedFastFilterType = fastFilterTypeValues.find(
              type => type.toLowerCase() === fieldName.toLowerCase()
            )
            
            // 如果字段名匹配快速筛查类型
            if (matchedFastFilterType) {
              // 提取 `:` 后面的内容
              let valueStr = afterDash.slice(colonIndex + 1).trim()
              
              // 检查是否有操作符（快速筛查格式不应该有操作符）
              let hasOperator = false
              for (const op of sortedOperatorOptions) {
                if (valueStr.startsWith(op.label)) {
                  hasOperator = true
                  break
                }
              }
              
              // 如果没有操作符，继续检查值的格式
              if (!hasOperator) {
                // 检查值是否包含括号和 OR（格式：`(value1 OR value2)`）
                const trimmedValue = valueStr.trim()
                if (trimmedValue.startsWith('(') && trimmedValue.endsWith(')')) {
                  // 括号格式，解析括号内的内容，按 OR 分割
                  const innerContent = trimmedValue.slice(1, -1).trim()
                  if (innerContent.includes(' OR ') || innerContent.includes(' or ')) {
                    fastFilterValues = innerContent.split(/\s+OR\s+/i).map(v => v.trim()).filter(v => v)
                    isFastFilterBlock = true
                    fastFilterFieldName = matchedFastFilterType
                  }
                } else {
                  // 单个值格式
                  fastFilterValues = [trimmedValue]
                  isFastFilterBlock = true
                  fastFilterFieldName = matchedFastFilterType
                }
              }
            }
          }
        }
        
        // 处理快速筛查方块
        if (isFastFilterBlock) {
          // 检查每个值是否在快速筛查数据中存在
          const fastFilterItems: string[] = []
          const customItems: string[] = []
          
          if (fastFilterData.value && fastFilterData.value[fastFilterFieldName]) {
            const fastFilterItemNames = fastFilterData.value[fastFilterFieldName].map(item => item.name)

            fastFilterValues.forEach(v => {
              console.log({ fastFilterItemNames: fastFilterItemNames.includes(v) })
              // 检查值是否在快速筛查数据中存在（精确匹配，区分大小写）
              if (fastFilterItemNames.includes(v)) {
                fastFilterItems.push(v)
              } else {
                customItems.push(v)
              }
            })
            console.log({ customItems, fastFilterItems })
          } else {
            // 如果没有快速筛查数据，所有值都作为自定义项
            customItems.push(...fastFilterValues)
          }
          
          // 自定义项全部放入 conditions
          customItems.forEach(customValue => {
            normalConditions.push({
              field: fastFilterFieldName,
              operator: 'OPERATOR_NE',
              value: filterInvisibleChars(customValue)
            })
          })
          
          // 快速筛查项：如果大于1个，放入 conditionGroups；如果小于等于1个，放入 conditions
          // 对于快速筛查数据中存在的项，field 需要加上 $tag$ 前缀
          const tagPrefix = '$tag$'
          const taggedFieldName = `${tagPrefix}${fastFilterFieldName.toLowerCase()}`
          
          if (fastFilterItems.length > 1) {
            // 大于1个，放入 conditionGroups
            if (!fastFilterGroups[fastFilterFieldName]) {
              fastFilterGroups[fastFilterFieldName] = []
            }
            fastFilterItems.forEach(v => {
              fastFilterGroups[fastFilterFieldName].push({
                field: taggedFieldName,
                operator: 'OPERATOR_NE',
                value: filterInvisibleChars(v)
              })
            })
          } else if (fastFilterItems.length === 1) {
            // 等于1个，放入 conditions
            normalConditions.push({
              field: taggedFieldName,
              operator: 'OPERATOR_NE',
              value: filterInvisibleChars(fastFilterItems[0])
            })
          }
        } else {
          // 处理自定义方块
          // 匹配 `:` 后面的操作符，操作符前面是 field，操作符后面是 value
          const firstColonIndex = blockValue.indexOf(':')
          
          if (firstColonIndex === -1) {
            // 没有 `:`，检查是否包含操作符
            let hasOperator = false
            for (const op of sortedOperatorOptions) {
              if (blockValue.includes(op.label)) {
                hasOperator = true
                break
              }
            }
            
            // 如果没有 `:` 且不包含操作符，判断为纯文本小方块
            // 纯文本小方块需要构建为：{ field: 'all', operator: 'OPERATOR_QUERY_STRING', value: blockValue }
            // field 和 operator 在这种情况下是写死的
            if (!hasOperator) {
              normalConditions.push({
                field: 'all',
                operator: 'OPERATOR_QUERY_STRING',
                value: filterInvisibleChars(blockValue)
              })
            } else {
              // 包含操作符但没有 `:`，所有内容作为 value
              normalConditions.push({
                field: '',
                operator: '',
                value: filterInvisibleChars(blockValue)
              })
            }
          } else {
            // 处理 key:操作符value 格式的小方块
            // 格式：key:操作符value（操作符在操作符列表中能匹配到，目前是橙色显示的操作符）
            // 解析为：{ field: key, operator: 从操作符列表中匹配到的操作符的value, value: value }
            
            // 提取第一个 `:` 前面的内容作为 field（key）
            const field = blockValue.slice(0, firstColonIndex).trim()
            const afterFirstColon = blockValue.slice(firstColonIndex + 1).trim()
            
            // 查找操作符（按 label 匹配，匹配操作符列表中橙色显示的操作符）
            let operatorValue = ''
            let operatorEnd = 0
            
            for (const op of sortedOperatorOptions) {
              if (afterFirstColon.startsWith(op.label)) {
                // 找到匹配的操作符，使用操作符的 value（如 'OPERATOR_EQ'）
                operatorValue = op.value
                operatorEnd = op.label.length
                break
              }
            }
            
            // 如果没有找到操作符，但有 field 和 value，默认使用 OPERATOR_EQ
            if (!operatorValue && field && afterFirstColon) {
              operatorValue = 'OPERATOR_EQ'
              operatorEnd = 0
            }
            
            // 提取操作符后面的内容作为 value
            let value = afterFirstColon.slice(operatorEnd).trim()
            if (value.startsWith(':')) {
              value = value.slice(1).trim()
            }
            
            // 构建条件对象：{ field: key, operator: 操作符的value, value: value }
            normalConditions.push({
              field: String(field || ''),
              operator: String(operatorValue || ''),
              value: filterInvisibleChars(String(value || ''))
            })
          }
        }
      })
      
      // 将快速筛查分组转换为 conditionGroups
      // 注意：快速筛查小方块在展示时用 OR 隔开，但在构建入参时需要将 OR 操作符变成 AND 操作符（LOGIC_AND）
      const conditionGroups: any[] = []
      Object.keys(fastFilterGroups).forEach((fieldName) => {
        const groupConditions = fastFilterGroups[fieldName]
        if (groupConditions.length > 0) {
          conditionGroups.push({
            logic: 'LOGIC_AND',
            conditions: groupConditions
          })
        }
      })
      
      console.log('sdsadasdsa-------->', {
        logic: 'LOGIC_AND' as const,
        conditions: normalConditions,
        conditionGroups: conditionGroups.length > 0 ? conditionGroups : undefined,
      })
      return {
        logic: 'LOGIC_AND' as const,
        conditions: normalConditions,
        conditionGroups: conditionGroups.length > 0 ? conditionGroups : undefined,
      }
    }
    
    const syncFastFilterFromQueryCondition = () => {
      if (!fastFilterData.value) {
        return
      }
      
      // 获取 conditionGroups（可能来自 queryConditionObj）
      const conditionGroups = searchConditions.queryConditionObj 
        ? ((searchConditions.queryConditionObj as any).conditionGroups || [])
        : []
      
      if (conditionGroups.length === 0) {
        // 如果没有 conditionGroups，说明没有快速筛选的小方块，设置为全选
        const initialSelected: Record<string, string[]> = {}
        Object.keys(fastFilterData.value).forEach((key) => {
          initialSelected[key] = fastFilterData.value[key].map(item => item.name)
        })
        fastFilterSelected.value = initialSelected
        return
      }
      
      // 解析 conditionGroups，提取未选中的项
      // conditionGroups 格式: [{ logic: 'LOGIC_AND', conditions: [{ field: 'status', operator: 'OPERATOR_NE', value: 'INFO' }, ...] }]
      // 注意：field 是去掉 `-` 前缀后的字段名，如 'status'，对应 fastFilterData 的 key
      // value 是选项的名称，如 'INFO'，对应 fastFilterData[key] 中 item.name
      // 快速筛查小方块在展示时用 OR 隔开，但在构建入参时使用 LOGIC_AND
      const unselectedMap: Record<string, string[]> = {}
      
      // 创建 fastFilterData 的 key 到原始 key 的映射（用于大小写不敏感匹配）
      const fastFilterKeyMap: Record<string, string> = {}
      Object.keys(fastFilterData.value).forEach((key) => {
        fastFilterKeyMap[key.toLowerCase()] = key
      })
      
      conditionGroups.forEach((group: any) => {
        // 兼容处理：既支持 LOGIC_OR（旧逻辑）也支持 LOGIC_AND（新逻辑）
        if ((group.logic === 'LOGIC_OR' || group.logic === 'LOGIC_AND') && Array.isArray(group.conditions)) {
          group.conditions.forEach((condition: any) => {
            if (condition.operator === 'OPERATOR_NE' && condition.field && condition.value) {
              const field = String(condition.field).trim().toLowerCase()
              const value = String(condition.value).trim()
              
              // 查找匹配的 fastFilterData key（大小写不敏感）
              const matchedKey = fastFilterKeyMap[field]
              if (matchedKey && value) {
                if (!unselectedMap[matchedKey]) {
                  unselectedMap[matchedKey] = []
                }
                // 避免重复添加（值匹配时区分大小写，因为选项名称可能有大小写差异）
                if (!unselectedMap[matchedKey].includes(value)) {
                  unselectedMap[matchedKey].push(value)
                }
              }
            }
          })
        }
      })
      
      // 更新 fastFilterSelected：对于每个 key，全选减去未选中的项 = 选中的项
      const newSelected: Record<string, string[]> = {}
      Object.keys(fastFilterData.value).forEach((key) => {
        const allItems = fastFilterData.value[key].map(item => item.name)
        const unselected = unselectedMap[key] || []
        // 选中的项 = 全部项 - 未选中的项（值匹配时区分大小写，因为选项名称可能有大小写差异）
        newSelected[key] = allItems.filter(item => !unselected.includes(item))
      })
      
      fastFilterSelected.value = newSelected
    }
    
    // 获取快速筛查数据
    const getFastFilterData = async () => {
      if (!searchConditions.dataSourceId || !searchConditions.indexType || !searchConditions.indexId) {
        return
      }
      try {
        fastFilterLoading.value = true
        const res = await getFastFilterSchemaApi({
        dataSourceId: searchConditions.dataSourceId,
          indexType: searchConditions.indexType,
          indexId: searchConditions.indexId,
          startTimestamp: searchConditions.startTimestamp || 0,
          endTimestamp: searchConditions.endTimestamp || 0,
        })
        
        fastFilterData.value = res.data || {}
        // 获取当前快速筛查列表中的所有 key（枚举值）
        const currentFastFilterKeys = Object.keys(fastFilterData.value || {})
        const isEmpty = Object.entries(fastFilterData.value).every(([key, value]) => value.length === 0)
        // 如果快速筛查列表为空（没有数据），清除搜索框中所有与快速筛查相关的小方块
        if (isEmpty) {
          // 获取所有快速筛查类型枚举值
          const allFastFilterTypes = Object.values(FastFilterType) as string[]
          
          // 清除搜索框中所有与快速筛查相关的小方块（根据枚举值判断）
          if (enhancedSearchHeaderRef.value) {
            enhancedSearchHeaderRef.value.clearFastFilterRelatedBlocks(allFastFilterTypes)
          }
          // 等待 DOM 更新和同步完成
          await nextTick()
          // 确保 queryConditionObj 中的 conditionGroups 被清除（双重保险）
          // 这里需要确保清除 conditionGroups，以便后续调用列表接口时入参正确
          if (searchConditions.queryConditionObj) {
            (searchConditions.queryConditionObj as any).conditionGroups = []
          } else {
            // 如果 queryConditionObj 为 null，创建一个空对象以确保 conditionGroups 为空
            searchConditions.queryConditionObj = {
              logic: 'LOGIC_AND' as const,
              conditions: [],
              conditionGroups: [],
            } as any
          }
          // 重置快速筛查选中状态
          fastFilterSelected.value = {}
          // 注意：这里不 return，继续执行同步逻辑，确保状态一致
        }
        
        // 如果快速筛查列表有数据，检查搜索框中的小方块
        // 找出当前快速筛查列表中不存在的 key（枚举值）
        const allFastFilterTypes = Object.values(FastFilterType) as string[]
        const missingKeys = allFastFilterTypes.filter(key => !currentFastFilterKeys.includes(key))
        
        // 如果有缺失的 key，清除搜索框中对应的快速筛查小方块
        if (missingKeys.length > 0 && enhancedSearchHeaderRef.value) {
          enhancedSearchHeaderRef.value.clearFastFilterRelatedBlocks(missingKeys)
          await nextTick()
        }
        
        // 数据更新后，统一根据搜索框中的快速筛选小方块同步快速筛选的勾选状态
        // 无论何种情况，只要快速筛查列表刷新，都要和顶部搜索框的小方块做对比
        syncFastFilterFromQueryCondition()
      } catch (error) {
        console.error('获取快速筛查数据失败:', error)
      } finally {
        fastFilterLoading.value = false
      }
    }
    
    const getIndexLogListData = async (params: any, shouldClearQuery: boolean = false, skipFastFilterData: boolean = false) => {
      try {
        loading.value = true
        fieldsLoading.value = true
        
        // 1. 先调用快速筛查接口，确保快速筛查数据为空时清除搜索框中的快速筛查数据
        // 如果 skipFastFilterData 为 true，则跳过调用（因为调用方已经调用过了）
        if (!skipFastFilterData) {
          await getFastFilterData()
        }
        
        // 2. 重新构建 params，因为 getFastFilterData 可能清除了 conditionGroups
        const updatedParams: any = {
          ...params,
          // queryCondition: (() => {
          //   // 先同步搜索框内容到 queryConditionObj
          //   let currentQueryCondition: ICondition & { conditionGroups?: any[] } | null = null
          //   if (enhancedSearchHeaderRef.value) {
          //     const searchBoxContent = enhancedSearchHeaderRef.value.getAllBlocksContent()
          //     if (searchBoxContent.trim()) {
          //       currentQueryCondition = enhancedSearchHeaderRef.value.getCurrentQueryCondition()
          //       if (currentQueryCondition) {
          //         searchConditions.queryConditionObj = currentQueryCondition
          //       }
          //     }
          //   }
            
          //   // 使用 rebuildQueryCondition 重新构建，确保快速筛查小方块正确分类
          //   return rebuildQueryCondition(searchConditions.queryConditionObj)
          // })(),
        }
        
        // 3. 然后调用列表接口
        const res = await getIndexLogListApi(updatedParams)
        const logList = res.data.list as LogDocument[]
        logDocuments.value = transformLogData(logList)
        total.value = res.data.total
        getAvailableFields(logList)
        
        // 只有在切换索引时才清空查询与时间范围（shouldClearQuery = true）
        // 用户主动查询时不应该清空查询条件，以保持快速筛选小方块的状态
        if (shouldClearQuery) {
        searchConditions.queryCondition = ''
          searchConditions.queryConditionObj = null
        searchConditions.filterConditions = []
        }
        // 不再根据列表数据修改时间范围，保持用户手动选择的时间
        if (logList.length > 0) {
          isHasIndexList.value = false
        } else {
          logChartDatas.value = []
          isHasIndexList.value = true
        }
        searchConditions.searchTimeType = 1
        searchConditions.minutesPast = undefined
        searchConditions.sortOrder = 'desc'
        
        // 4. 然后调用柱状图接口（使用日期范围选择框的时间）
        const chartParams = {
          dataSourceId: updatedParams.dataSourceId,
          indexType: updatedParams.indexType,
          indexId: updatedParams.indexId,
          startTimestamp: searchConditions.startTimestamp || 0,
          endTimestamp: searchConditions.endTimestamp || 0,
          queryCondition: updatedParams.queryCondition,
          filterConditions: updatedParams.filterConditions,
        }
        await getChartData(chartParams)
      } finally {
        loading.value = false
        fieldsLoading.value = false
      }
    }
    // 页面初始化函数
    // 支持传入外部筛选条件（从保存的视图中解析）
    const init = async (externalConditions?: {
      dataSourceId?: string
      indexType?: string
      indexId?: string | number
      indexName?: string
      queryCondition?: string | ICondition
      queryConditionObj?: ICondition | null
      filterConditions?: FilterCondition[]
      startTimestamp?: number
      endTimestamp?: number
      searchTimeType?: 1 | 2
      minutesPast?: number
      page?: number
      pageSize?: number
      sortOrder?: 'desc' | 'asc'
    }) => {
      if (!formRef.value) {
        console.warn('FormilyForm 未初始化，无法执行初始化逻辑')
        return
      }

      try {
        // 检查是否有 URL 参数（从索引管理页面跳转过来）
        const urlParams = route.query
        const hasUrlParams = urlParams.dataSourceId && urlParams.indexId && urlParams.indexType
        
        // 如果有外部传入的条件，优先使用外部条件
        const hasExternalConditions = !!externalConditions

        // 1. 请求数据源列表
        const dataSourceRes = await getDatasourceUseList()
        const dataSourceList = (dataSourceRes.data?.list || []).map((v: any) => ({ 
          label: v.name || v.indexName, 
          value: v.id || v.indexName 
        }))
        
        if (dataSourceList.length === 0) {
          console.warn('数据源列表为空，无法初始化')
          return
        }

        const dataSourceIdField = formRef.value.query('void.selectGroup1.dataSourceId')?.take() as Field
        if (!dataSourceIdField) {
          console.warn('无法获取数据源字段')
          return
        }

        dataSourceIdField.dataSource = dataSourceList

        // 优先级：外部条件 > URL 参数 > 默认值
        let selectedDataSourceId: string
        let selectedIndexType: string
        let selectedIndexId: string | number
        let filterConditions: FilterCondition[] = []

        if (hasExternalConditions && externalConditions?.dataSourceId) {
          // 使用外部传入的条件（从保存的视图中解析）
          selectedDataSourceId = externalConditions.dataSourceId
          // 如果 externalConditions.filterConditions 存在（包括空数组），直接使用；否则设置为空数组
          filterConditions = Array.isArray(externalConditions.filterConditions) ? externalConditions.filterConditions : []
          
          // 同步筛选条件到 searchConditions（包括空数组的情况）
          if (Array.isArray(externalConditions.filterConditions)) {
            searchConditions.filterConditions = externalConditions.filterConditions
          } else {
            searchConditions.filterConditions = []
          }
          if (externalConditions.queryConditionObj) {
            searchConditions.queryConditionObj = externalConditions.queryConditionObj
          } else if (externalConditions.queryCondition) {
            if (typeof externalConditions.queryCondition === 'object' && 'logic' in externalConditions.queryCondition) {
              searchConditions.queryConditionObj = externalConditions.queryCondition as ICondition
            } else {
              searchConditions.queryCondition = String(externalConditions.queryCondition)
            }
          }
          if (externalConditions.startTimestamp !== undefined) {
            searchConditions.startTimestamp = externalConditions.startTimestamp
          }
          if (externalConditions.endTimestamp !== undefined) {
            searchConditions.endTimestamp = externalConditions.endTimestamp
          }
          if (externalConditions.searchTimeType !== undefined) {
            searchConditions.searchTimeType = externalConditions.searchTimeType
          }
          if (externalConditions.minutesPast !== undefined) {
            searchConditions.minutesPast = externalConditions.minutesPast
          }
          if (externalConditions.page !== undefined) {
            searchConditions.page = externalConditions.page
          }
          if (externalConditions.pageSize !== undefined) {
            searchConditions.pageSize = externalConditions.pageSize
          }
          if (externalConditions.sortOrder) {
            searchConditions.sortOrder = externalConditions.sortOrder
          }

          // 设置数据源
          dataSourceIdField.value = selectedDataSourceId
        } else if (hasUrlParams) {
          // 使用 URL 参数
          selectedDataSourceId = String(urlParams.dataSourceId)
          selectedIndexType = String(urlParams.indexType)
          selectedIndexId = urlParams.indexId as string | number

          // 解析过滤条件（如果有）
          if (urlParams.filterCondition) {
            try {
              const filterConditionStr = String(urlParams.filterCondition)
              filterConditions = JSON.parse(filterConditionStr)
              searchConditions.filterConditions = filterConditions
            } catch (error) {
              console.error('解析过滤条件失败:', error)
            }
          }

          // 设置数据源
          dataSourceIdField.value = selectedDataSourceId
        } else {
          // 使用默认值（第一条数据源）
          dataSourceIdField.value = dataSourceList[0].value
          selectedDataSourceId = dataSourceList[0].value
        }

        // 等待数据源字段的 x-reactions 执行完成
        await nextTick()
        await new Promise(resolve => setTimeout(resolve, 100))

        // 2. 设置索引类型
        const indexTypeField = formRef.value.query('void.selectGroup2.indexGroup.indexType')?.take() as Field
        if (!indexTypeField) {
          console.warn('无法获取索引类型字段')
          return
        }

        if (hasExternalConditions && externalConditions?.indexType) {
          // 使用外部传入的索引类型
          selectedIndexType = externalConditions.indexType
          indexTypeField.value = selectedIndexType
        } else if (hasUrlParams) {
          // 使用 URL 参数中的索引类型
          indexTypeField.value = selectedIndexType
        } else {
          // 使用默认值（原始索引）
          const originalIndexValue = indexOptions.find(opt => opt.label === '原始索引')?.value
          if (!originalIndexValue) {
            console.warn('无法找到原始索引类型')
            return
          }
          indexTypeField.value = originalIndexValue
          selectedIndexType = originalIndexValue
        }

        // 等待索引类型字段的 x-reactions 执行完成
        await nextTick()
        await new Promise(resolve => setTimeout(resolve, 200))

        // 3. 使用数据源ID和索引类型请求索引值列表
        const indexListRes = await getIndexList({
          dataSourceId: selectedDataSourceId,
          indexType: selectedIndexType,
        } as any)
        
        // getIndexList 返回的数据结构可能是 { data: { list: [...] } } 或直接是数组
        const rawIndexList = (Array.isArray(indexListRes) ? indexListRes : (indexListRes as any)?.data?.list || []) as any[]
        const indexList = rawIndexList.map((v: any) => ({ 
          label: v.name || v.indexName, 
          value: v.id || v.indexName 
        }))

        if (indexList.length === 0) {
          console.warn('索引列表为空，无法初始化')
          return
        }

        const indexIdField = formRef.value.query('void.selectGroup2.indexGroup.indexId')?.take() as Field
        if (!indexIdField) {
          console.warn('无法获取索引ID字段')
          return
        }

        indexIdField.dataSource = indexList

        // 4. 设置索引ID
        let actualIndexId: number | string
        let indexName: string

        if (hasExternalConditions && externalConditions?.indexId !== undefined && externalConditions?.indexId !== null) {
          // 优先使用外部传入的 indexId（从保存的视图中解析）
          actualIndexId = Number(externalConditions.indexId) || 0
          
          // 从索引列表中找到对应的选项
          const indexItem = rawIndexList.find((item: any) => 
            String(item.indexId) === String(actualIndexId) || 
            String(item.id) === String(actualIndexId) ||
            Number(item.indexId) === actualIndexId ||
            Number(item.id) === actualIndexId
          )
          
          if (indexItem) {
            // 如果找到了，使用找到的 indexId 和 indexName
            actualIndexId = (indexItem as any).indexId || (indexItem as any).id || Number((indexItem as any).id) || 0
            indexName = (indexItem as any).indexName || (indexItem as any).name || String(actualIndexId)
            
            // 设置表单值（优先使用匹配的选项的 value）
            const matchedOption = indexList.find((opt: any) => 
              opt.value === actualIndexId || 
              String(opt.value) === String(actualIndexId) ||
              Number(opt.value) === actualIndexId
            )
            if (matchedOption) {
              indexIdField.value = matchedOption.value
            } else {
              // 如果找不到匹配的选项，尝试使用 indexName 匹配
              const nameOption = indexList.find((opt: any) => opt.label === indexName)
              if (nameOption) {
                indexIdField.value = nameOption.value
              } else {
                // 最后尝试直接使用 actualIndexId
                indexIdField.value = actualIndexId
              }
            }
          } else {
            // 如果找不到匹配的项，直接使用传入的 indexId
            indexName = externalConditions.indexName || String(actualIndexId)
            // 尝试在 indexList 中查找匹配的 value
            const matchedOption = indexList.find((opt: any) => 
              opt.value === actualIndexId || 
              String(opt.value) === String(actualIndexId) ||
              Number(opt.value) === actualIndexId
            )
            if (matchedOption) {
              indexIdField.value = matchedOption.value
            } else {
              // 如果找不到，直接使用 indexId
              indexIdField.value = actualIndexId
            }
          }
        } else if (hasExternalConditions && externalConditions?.indexName) {
          // 如果没有 indexId，但有 indexName，使用 indexName 查找
          indexName = externalConditions.indexName
          // 需要从索引列表中找到对应的选项
          const indexItem = rawIndexList.find((item: any) => 
            item.indexName === indexName || item.name === indexName
          )
          
          if (indexItem) {
            actualIndexId = (indexItem as any).indexId || (indexItem as any).id || Number((indexItem as any).id) || 0
            // 设置表单值（使用 value 格式，可能是 id 或 indexName）
            const matchedOption = indexList.find((opt: any) => 
              opt.value === actualIndexId || 
              String(opt.value) === String(actualIndexId) ||
              opt.label === indexName
            )
            if (matchedOption) {
              indexIdField.value = matchedOption.value
            } else {
              // 如果找不到匹配的选项，尝试使用 indexName
              const nameOption = indexList.find((opt: any) => opt.label === indexName)
              if (nameOption) {
                indexIdField.value = nameOption.value
              } else {
                indexIdField.value = indexName
              }
            }
          } else {
            // 如果找不到匹配的项，尝试使用 indexName 作为值
            actualIndexId = externalConditions.indexId ? Number(externalConditions.indexId) || 0 : 0
            indexIdField.value = indexName
          }
        } else if (hasUrlParams) {
          // 使用 URL 参数中的索引ID
          // 需要从索引列表中找到对应的选项
          const indexItem = rawIndexList.find((item: any) => 
            String(item.indexId) === String(selectedIndexId) || 
            String(item.id) === String(selectedIndexId) ||
            item.indexName === selectedIndexId ||
            item.name === selectedIndexId
          )
          
          if (indexItem) {
            actualIndexId = (indexItem as any).indexId || (indexItem as any).id || Number((indexItem as any).id) || 0
            indexName = (indexItem as any).indexName || (indexItem as any).name || String(selectedIndexId)
            // 设置表单值（使用 value 格式，可能是 id 或 indexName）
            const matchedOption = indexList.find((opt: any) => 
              opt.value === selectedIndexId || 
              String(opt.value) === String(selectedIndexId) ||
              opt.label === indexName
            )
            if (matchedOption) {
              indexIdField.value = matchedOption.value
            } else {
              // 如果找不到匹配的选项，使用索引ID作为值
              indexIdField.value = selectedIndexId
            }
          } else {
            // 如果找不到匹配的项，直接使用 URL 参数中的值
            actualIndexId = Number(selectedIndexId) || 0
            indexName = String(selectedIndexId)
            indexIdField.value = selectedIndexId
          }
        } else {
          // 使用默认值（第一条索引）
          indexIdField.value = indexList[0].value
          const selectedValue = indexList[0].value

          // 从原始数据中获取真实的 indexId
          if (typeof selectedValue === 'number') {
            actualIndexId = selectedValue
            indexName = String(selectedValue)
          } else {
            const indexItem = rawIndexList.find((item: any) => 
              item.indexName === selectedValue || item.name === selectedValue || 
              String(item.id) === String(selectedValue) || String(item.indexId) === String(selectedValue)
            )
            if (indexItem) {
              actualIndexId = (indexItem as any).indexId || (indexItem as any).id || Number((indexItem as any).id) || 0
              indexName = (indexItem as any).indexName || (indexItem as any).name || String(selectedValue)
            } else {
              actualIndexId = Number(selectedValue) || 0
              indexName = String(selectedValue)
            }
          }
        }

        // 等待索引ID字段的 x-reactions 执行完成
        await nextTick()
        await new Promise(resolve => setTimeout(resolve, 100))

        // 5. 更新 searchConditions
        searchConditions.dataSourceId = selectedDataSourceId
        searchConditions.indexType = selectedIndexType
        searchConditions.indexId = actualIndexId
        searchConditions.indexName = indexName

        // 6. 设置时间范围
        // 如果有外部条件，使用外部条件的时间；否则使用默认值（本月）
        if (!hasExternalConditions || externalConditions?.startTimestamp === undefined) {
          const now = new Date()
          const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0)
          searchConditions.startTimestamp = firstDayOfMonth.getTime()
          searchConditions.endTimestamp = now.getTime()
          searchConditions.searchTimeType = 1
        }

        // 7. 请求列表数据
        // 统一处理：无论何种情况，调用列表接口时都要带上搜索框中的快速筛选小方块字段（conditionGroups）
        const existingConditionGroups = searchConditions.queryConditionObj 
          ? ((searchConditions.queryConditionObj as any).conditionGroups || [])
          : []
        
        const apiParams: any = {
          dataSourceId: selectedDataSourceId,
          indexType: selectedIndexType,
          indexId: actualIndexId,
          page: searchConditions.page,
          pageSize: searchConditions.pageSize,
          sortOrder: searchConditions.sortOrder === 'asc' ? 'SORT_ORDER_ASC' : 'SORT_ORDER_DESC',
          startTimestamp: searchConditions.startTimestamp || 0,
          endTimestamp: searchConditions.endTimestamp || 0,
          queryCondition: searchConditions.queryConditionObj ? {
            logic: 'LOGIC_AND' as const,
            conditions: searchConditions.queryConditionObj.conditions.map(c => ({
              field: String(c.field || ''),
              operator: String(c.operator || ''),
              value: filterInvisibleChars(c.value !== undefined && c.value !== null ? String(c.value) : ''),
            })),
            conditionGroups: existingConditionGroups,
          } : {
            logic: 'LOGIC_AND' as const,
            conditions: [],
            conditionGroups: existingConditionGroups,
          },
          filterConditions: filterConditions,
        }

        await getIndexLogListData(apiParams, false)
      } catch (error) {
        console.error('页面初始化失败:', error)
      }
    }

    // 监听 formRef 的变化，当 FormilyForm 初始化完成后执行 init
    const initExecuted = ref(false)
    watch(
      () => formRef.value,
      (newFormRef) => {
        if (newFormRef && !initExecuted.value) {
          initExecuted.value = true
          nextTick().then(() => {
            init()
          })
        }
      },
      { immediate: true }
    )

    onMounted(async () => {
      // 如果 formRef 已经存在，直接执行初始化
      if (formRef.value && !initExecuted.value) {
        initExecuted.value = true
        await nextTick()
        await init()
      }
    })

    onUnmounted(() => {
      // 组件卸载时清理SSE连接
      stopLogStream()
    })

    return () => (
      <div class={styles.logSearchContainer}>
        {/* 视图管理栏：新建/保存/打开 */}
        <div class={styles.viewBar}>
          <div class={styles.viewLeft}>
            <span class={styles.viewBadge}>{activeViewId.value ? '已打开' : '视图'}</span>
            {activeViewTitle.value ? (
              <span class={styles.viewTitle}>{activeViewTitle.value}</span>
            ) : null}
          </div>
          <div class={styles.viewActions}>
            <ElButton size='small' onClick={handleNew} disabled={!hasPermission(['log:get'])}>
              新建
            </ElButton>
            <ElButton
              size='small'
              type='primary'
              onClick={handleSave}
              disabled={!hasPermission(['log:get'])}
            >
              保存
            </ElButton>
            <ElButton size='small' onClick={handleOpen} disabled={!hasPermission(['log:get'])}>
              打开
            </ElButton>
          </div>
        </div>
        <div class={styles.mainContent}>
          {/* 左侧面板 */}
          <div class={styles.leftPanel}>
            {/* 选择数据源和索引 - 使用 FormilyForm */}
            <div class={styles.panelSection}>
              <FormilyForm
                ref={formilyFormRef}
                config={getDataSourceIndexSchema(formRef, handleIndexChange)}
                effectHooks={effectHooks.value}
                initialValues={{
                  void: {
                    selectGroup1: {
                      dataSourceId: searchConditions.dataSourceId,
                    },
                    selectGroup2: {
                      indexGroup: {
                        indexId: searchConditions.indexName,
                      },
                    },
                  },
                }}
              />
              </div>
            {/* 快速筛查 */}
            <div v-loading={fastFilterLoading.value} class={styles.panelSection}>
              <FastFilterPanel
                data={fastFilterData.value}
                modelValue={fastFilterSelected.value}
                onUpdate:modelValue={(value) => {
                  fastFilterSelected.value = value
                }}
                onChange={handleFastFilterChange}
              />
            </div>
          </div>
          {/* 右侧面板 */}
          <div class={styles.rightContent}>
            {/* 搜索栏 */}
            <EnhancedSearchHeader
              ref={enhancedSearchHeaderRef}
              searchQuery={searchConditions.queryCondition}
              availableFields={availableFields.value}
              startTimestamp={searchConditions.startTimestamp}
              endTimestamp={searchConditions.endTimestamp}
              searchTimeType={searchConditions.searchTimeType}
              minutesPast={searchConditions.minutesPast}
              filterConditions={searchConditions.filterConditions}
              isStreaming={isStreaming.value}
              isTimePaused={searchConditions.searchTimeType === 2}
              onUpdate:searchQuery={(value) => {
                searchConditions.queryCondition = value
              }}
              onUpdate:queryCondition={(condition: ICondition) => {
                // 同步 queryConditionObj（删除小方块时触发，不触发搜索）
                searchConditions.queryConditionObj = condition
                // 当小方块内容变化时（包括快速筛查小方块被编辑），同步快速筛查的勾选状态
                // 使用 nextTick 确保 queryConditionObj 已更新
                nextTick(() => {
                  syncFastFilterFromQueryCondition()
                })
              }}
              onSearch={executeSearch}
              onAddFilter={handleAddFilter}
              onRemoveFilter={(index: number) => {
                searchConditions.filterConditions.splice(index, 1)
              }}
              onUpdate:startTimestamp={(timestamp: number) => {
                searchConditions.startTimestamp = timestamp
              }}
              onUpdate:endTimestamp={(timestamp: number) => {
                searchConditions.endTimestamp = timestamp
              }}
              onUpdate:searchTimeType={(type: 1 | 2) => {
                searchConditions.searchTimeType = type
              }}
              onUpdate:minutesPast={(minutes: number | undefined) => {
                searchConditions.minutesPast = minutes
              }}
              onUpdate:isTimePaused={(paused: boolean) => {
                searchConditions.searchTimeType = paused ? 2 : 1
              }}
              onToggleLogStream={toggleLogStream}
            />
            {/* 动态柱状图 */}
            <div v-loading={chartLoading.value}>
              <LogChart
                logChartData={logChartDatas.value}
                selectedStatuses={statusChecked.value}
                isHasIndexList={isHasIndexList.value}
              />
            </div>
            {/* 搜索结果 */}
            {logDocuments.value.length > 0 && (
              <div v-loading={loading.value}>
                <DocumentView
                  logDocuments={logDocuments.value}
                  selectedFieldObjects={selectedFieldObjects.value}
                  pagination={{
                    page: searchConditions.page,
                    pageSize: searchConditions.pageSize,
                    sortOrder: searchConditions.sortOrder,
                  }}
                  total={total.value}
                  searchKey={searchKey.value}
                  directSearchStrings={directSearchStrings.value}
                  isStreaming={isStreaming.value}
                  onUpdate:pagination={handlePaginationUpdate}
                />
              </div>
            )}
          </div>
        </div>

        {/* 保存对话框 */}
        <ElDialog
          modelValue={showSaveDialog.value}
          title='保存检索视图'
          width='480px'
          onUpdate:modelValue={(v: boolean) => (showSaveDialog.value = v)}
          v-slots={{
            footer: () => (
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <ElButton onClick={() => (showSaveDialog.value = false)}>取消</ElButton>
                <ElButton
                  type='primary'
                  disabled={!saveTitle.value.trim()}
                  onClick={confirmSave}
                  loading={saveViewLoading.value}
                >
                  保存
                </ElButton>
              </div>
            ),
          }}
        >
          <div style={{ marginBottom: '12px', color: '#606266' }}>
            保存您的检索视图，以便在可视化和仪表板中使用它
          </div>
          <ElInput placeholder='请输入标题' v-model={saveTitle.value} />
        </ElDialog>

        {/* 打开抽屉 */}
        <ElDrawer
          modelValue={showOpenDrawer.value}
          title='打开检索视图'
          size='40%'
          withHeader
          onUpdate:modelValue={(v: boolean) => (showOpenDrawer.value = v)}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <ElInput placeholder='搜索...' v-model={viewSearch.value} clearable />
          </div>
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
            v-loading={openViewListLoading.value}
          >
            {filteredViews.value.map((v) => (
              <div class={styles.viewItem}>
                <div
                  style={{ display: 'flex', alignItems: 'center', flex: 1 }}
                  onClick={() => openView(v)}
                >
                  <ElIcon style={{ marginRight: '6px' }}>
                    <Search />
                  </ElIcon>
                  <span style={{ flex: 1 }}>{v.viewName}</span>
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <ElButton size='small' circle onClick={() => handleEditView(v)}>
                    <ElIcon>
                      <Edit />
                    </ElIcon>
                  </ElButton>
                  <ElButton size='small' circle type='danger' onClick={() => handleDeleteView(v)}>
                    <ElIcon>
                      <Delete />
                    </ElIcon>
                  </ElButton>
                </div>
              </div>
            ))}
          </div>
        </ElDrawer>
        {/* 编辑视图名 */}
        <ElDialog
          modelValue={editDialogVisible.value}
          title='编辑视图名称'
          width='420px'
          onUpdate:modelValue={(v: boolean) => (editDialogVisible.value = v)}
          v-slots={{
            footer: () => (
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <ElButton onClick={() => (editDialogVisible.value = false)}>取消</ElButton>
                <ElButton
                  type='primary'
                  loading={editLoading.value}
                  onClick={confirmEditView}
                  disabled={!editViewName.value.trim()}
                >
                  确认
                </ElButton>
              </div>
            ),
          }}
        >
          <ElInput placeholder='请输入新的名称' v-model={editViewName.value} />
        </ElDialog>

        {/* 删除确认 */}
        <ElDialog
          modelValue={deleteDialogVisible.value}
          title='删除确认'
          width='420px'
          onUpdate:modelValue={(v: boolean) => (deleteDialogVisible.value = v)}
          v-slots={{
            footer: () => (
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <ElButton onClick={() => (deleteDialogVisible.value = false)}>取消</ElButton>
                <ElButton type='danger' loading={deleteLoading.value} onClick={confirmDeleteView}>
                  删除
                </ElButton>
              </div>
            ),
          }}
        >
          确认要删除该视图吗？删除后不可恢复。
        </ElDialog>
        <FilterDialog
          modelValue={showFilterDialog.value}
          availableFields={availableFields.value}
          currentDocument={currentDocument.value}
          onUpdate:modelValue={(value) => (showFilterDialog.value = value)}
          onAddFilter={addFilterCondition}
        />
      </div>
    )
  },
})
