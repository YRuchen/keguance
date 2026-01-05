// components/EnhancedSearchHeader.tsx
import { defineComponent, ref, computed, PropType, watch } from 'vue'
import {
  Search as SearchIcon,
  Calendar,
  CirclePlus,
  VideoPlay,
  VideoPause,
} from '@element-plus/icons-vue'
import {
  ElButton,
  ElIcon,
  ElDatePicker,
} from 'element-plus'
import { LogField, FilterCondition } from '@/api/logs/discover/interfaces'
import QueryBuilder, { type ICondition } from '../../retrieval/components/queryBuilder'
import { operatorOptions } from '../../retrieval/components/queryBuilder/constants'
import styles from '../index.module.scss'

export default defineComponent({
  name: 'EnhancedSearchHeader',
  props: {
    searchQuery: {
      type: String,
      required: true,
    },
    availableFields: {
      type: Array as PropType<LogField[]>,
      required: true,
    },
    startTimestamp: {
      type: Number,
      required: false,
    },
    endTimestamp: {
      type: Number,
      required: false,
    },
    searchTimeType: {
      type: Number as PropType<1 | 2>,
      required: false,
      default: 1,
    },
    minutesPast: {
      type: Number,
      required: false,
    },
    filterConditions: {
      type: Array as PropType<FilterCondition[]>,
      default: () => [],
    },
    isStreaming: {
      type: Boolean,
      default: false,
    },
    isTimePaused: {
      type: Boolean,
      default: false,
    },
  },
  emits: [
    'update:searchQuery',
    'search',
    'addFilter',
    'removeFilter',
    'update:startTimestamp',
    'update:endTimestamp',
    'update:searchTimeType',
    'update:minutesPast',
    'update:isTimePaused',
    'toggleLogStream',
    'fastFilterRestore',
    'update:queryCondition',
  ],
  setup(props, { emit, expose }) {
    const handleAddFilter = () => emit('addFilter')
    const handleRemoveFilter = (index: number) => emit('removeFilter', index)
    const handleToggleLogStream = async () => {
      emit('toggleLogStream')
    }

    // 保存 QueryBuilder 返回的 ICondition
    const queryConditionObj = ref<ICondition | null>(null)
    // QueryBuilder 实例引用
    const queryBuilderRef = ref<{
      addFastFilterBlock: (key: string, itemNames: string[]) => void
      removeFastFilterBlock: (key: string) => void
      updateFastFilterBlocks: (unselectedItems: Record<string, Array<{ name: string; value: number }>>) => void
      loadFromCondition: (condition: ICondition & { conditionGroups?: any[] }) => void
      clearAllFastFilterBlocks: () => void
      clearFastFilterRelatedBlocks: (fastFilterTypes: string[]) => void
      getAllBlocksContent: () => string[]
      getCurrentQueryCondition: () => ICondition & { conditionGroups?: any[] }
      clearAllBlocks: () => void
    } | null>(null)

    // 处理 QueryBuilder 的搜索事件
    const handleQueryBuilderSearch = (condition: ICondition) => {
      console.log('[EnhancedSearchHeader] handleQueryBuilderSearch received condition:', JSON.stringify(condition, null, 2))
      // 保存 ICondition 对象
      queryConditionObj.value = condition
      
      // 将 ICondition 转换为 queryCondition 字符串（用于显示）
      const queryParts = condition.conditions
        .filter((c) => c.value || c.field) // 过滤掉空的条件
        .map((c) => {
          // 从 operatorOptions 中找到对应的 label
          const operatorOption = operatorOptions.find((op) => op.value === c.operator)
          const operatorLabel = operatorOption ? operatorOption.label : c.operator
          
          if (c.field && c.operator) {
            // 有字段和操作符：field:operatorLabel:value
            return `${c.field}:${operatorLabel}:${c.value}`
          } else if (c.field) {
            // 只有字段：field:
            return `${c.field}:`
          } else if (c.value) {
            // 只有值：直接返回值
            return c.value
          }
          return ''
        })
        .filter((part) => part) // 过滤掉空字符串

      const queryCondition = queryParts.join(' ')
      emit('update:searchQuery', queryCondition)
      
      // 触发搜索
      handleSearch()
    }

    // 处理查询按钮点击
    const handleSearch = () => {
      // 检查时间范围是否有效
      if (!isTimeRangeValid.value) {
        console.error('开始时间不能晚于结束时间')
        return
      }

      const queryData: any = {
        queryCondition: props.searchQuery, // 字符串格式（用于显示和兼容）
        queryConditionObj: queryConditionObj.value, // ICondition 格式（用于接口调用）
        searchTimeType: props.searchTimeType,
        startTimestamp: props.startTimestamp,
        endTimestamp: props.endTimestamp,
      }

      // 如果是相对时间，添加minutesPast
      if (props.searchTimeType === 2) {
        queryData.minutesPast = props.minutesPast
      }

      emit('search', queryData)
    }

    // 预定义时间选择状态（由父组件传入）
    const isTimePaused = computed(() => props.isTimePaused)

    // 时间范围选择器的值（用于 ElDatePicker）
    // 使用 ref 来存储当前值，避免 computed 的响应式问题
    const dateRangeValue = ref<[Date, Date] | null>(null)
    
    // 监听 props 变化，同步到 dateRangeValue
    watch(
      () => [props.startTimestamp, props.endTimestamp] as const,
      ([startTimestamp, endTimestamp]) => {
        if (startTimestamp && endTimestamp) {
          dateRangeValue.value = [new Date(startTimestamp), new Date(endTimestamp)]
        } else {
          dateRangeValue.value = null
        }
      },
      { immediate: true }
    )

    // 处理时间范围变化
    const handleDateRangeChange = (value: [Date, Date] | null) => {
      if (value && Array.isArray(value) && value.length === 2) {
        // 更新本地值
        dateRangeValue.value = value
        
        // 转换为时间戳并 emit
        emit('update:startTimestamp', value[0].getTime())
        emit('update:endTimestamp', value[1].getTime())
        // 当选择绝对时间时，设置为绝对时间模式
        if (props.searchTimeType === 2) {
          emit('update:searchTimeType', 1)
          emit('update:minutesPast', undefined)
        }
      } else {
        dateRangeValue.value = null
        emit('update:startTimestamp', undefined as any)
        emit('update:endTimestamp', undefined as any)
      }
    }

    // 检查时间范围是否有效
    const isTimeRangeValid = computed(() => {
      if (!props.startTimestamp || !props.endTimestamp) return true
      return props.startTimestamp < props.endTimestamp
    })

    // 时间选择器快捷键配置
    const datePickerShortcuts = [
      {
        text: '今日',
        value: () => {
          const now = new Date()
          const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0)
          return [start, now]
        }
      },
      {
        text: '昨日',
        value: () => {
          const yesterday = new Date()
          yesterday.setDate(yesterday.getDate() - 1)
          const start = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 0, 0, 0)
          const end = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 23, 59, 59)
          return [start, end]
        }
      },
      {
        text: '本周',
        value: () => {
          const now = new Date()
          const dayOfWeek = now.getDay()
          const daysToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
          const monday = new Date(now)
          monday.setDate(now.getDate() + daysToMonday)
          monday.setHours(0, 0, 0, 0)
          return [monday, now]
        }
      },
      {
        text: '上周',
        value: () => {
          const now = new Date()
          const dayOfWeek = now.getDay()
          const daysToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
          const lastMonday = new Date(now)
          lastMonday.setDate(now.getDate() + daysToMonday - 7)
          lastMonday.setHours(0, 0, 0, 0)
          const lastSunday = new Date(lastMonday)
          lastSunday.setDate(lastMonday.getDate() + 6)
          lastSunday.setHours(23, 59, 59, 999)
          return [lastMonday, lastSunday]
        }
      },
      {
        text: '本月',
        value: () => {
          const now = new Date()
          const start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0)
          return [start, now]
        }
      },
      {
        text: '上月',
        value: () => {
          const now = new Date()
          const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1, 0, 0, 0)
          const lastDayOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999)
          return [lastMonth, lastDayOfLastMonth]
        }
      },
      {
        text: '最近1分钟',
        value: () => {
          const now = new Date()
          const oneMinuteAgo = new Date(now.getTime() - 60 * 1000)
          return [oneMinuteAgo, now]
        }
      },
      {
        text: '最近5分钟',
        value: () => {
          const now = new Date()
          const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000)
          return [fiveMinutesAgo, now]
        }
      }
    ]

    // 将 availableFields 转换为 QueryBuilder 需要的格式
    const queryBuilderSuggestions = computed(() => {
      // 如果字段列表为空，返回空数组，不显示字段列表下拉框
      if (!props.availableFields || props.availableFields.length === 0) {
        return []
      }
      return props.availableFields.map((field) => ({
        label: field.name,
        value: field.name,
      }))
    })

    // 暴露方法给父组件
    const updateFastFilterBlocks = (unselectedItems: Record<string, Array<{ name: string; value: number }>>) => {
      if (queryBuilderRef.value) {
        queryBuilderRef.value.updateFastFilterBlocks(unselectedItems)
      }
    }

    // 从 ICondition 加载 blocks（用于回显保存的视图）
    const loadFromCondition = (condition: ICondition & { conditionGroups?: any[] }) => {
      if (queryBuilderRef.value) {
        queryBuilderRef.value.loadFromCondition(condition)
      }
    }

    // 清除所有快速筛查方块
    const clearAllFastFilterBlocks = () => {
      if (queryBuilderRef.value) {
        queryBuilderRef.value.clearAllFastFilterBlocks()
      }
    }

    // 清除与快速筛查相关的小方块（根据枚举值判断）
    const clearFastFilterRelatedBlocks = (fastFilterTypes: string[]) => {
      if (queryBuilderRef.value) {
        queryBuilderRef.value.clearFastFilterRelatedBlocks(fastFilterTypes)
      }
    }

    // 获取所有小方块的内容（返回数组，每个元素是一个小方块的内容）
    const getAllBlocksContent = (): string[] => {
      if (queryBuilderRef.value) {
        return queryBuilderRef.value.getAllBlocksContent()
      }
      return []
    }

    // 获取当前的 queryCondition（用于同步到外部）
    const getCurrentQueryCondition = (): ICondition & { conditionGroups?: any[] } | null => {
      if (queryBuilderRef.value) {
        return queryBuilderRef.value.getCurrentQueryCondition()
      }
      return null
    }

    // 清除所有小方块（包括普通小方块和快速筛查小方块）
    const clearAllBlocks = () => {
      if (queryBuilderRef.value) {
        queryBuilderRef.value.clearAllBlocks()
      }
    }
    
    expose({
      updateFastFilterBlocks,
      loadFromCondition,
      clearAllFastFilterBlocks,
      clearFastFilterRelatedBlocks,
      getAllBlocksContent,
      getCurrentQueryCondition,
      clearAllBlocks
    })

    return () => (
      <div class={styles.searchHeader}>
        <div class={styles.searchInputGroup}>
          {/* QueryBuilder 搜索框 */}
          <div class={styles.searchInputWrapper} style={{ flex: 1 }}>
            <QueryBuilder
              ref={queryBuilderRef}
              suggestions={queryBuilderSuggestions.value}
              onSearch={handleQueryBuilderSearch}
              onUpdate:queryCondition={(condition: ICondition) => {
                // 只同步 queryConditionObj，不触发搜索
                queryConditionObj.value = condition
                
                // 将 ICondition 转换为 queryCondition 字符串（用于显示）
                const queryParts = condition.conditions
                  .filter((c) => c.value || c.field) // 过滤掉空的条件
                  .map((c) => {
                    // 从 operatorOptions 中找到对应的 label
                    const operatorOption = operatorOptions.find((op) => op.value === c.operator)
                    const operatorLabel = operatorOption ? operatorOption.label : c.operator
                    
                    if (c.field && c.operator) {
                      // 有字段和操作符：field:operatorLabel:value
                      return `${c.field}:${operatorLabel}:${c.value}`
                    } else if (c.field) {
                      // 只有字段：field:
                      return `${c.field}:`
                    } else if (c.value) {
                      // 只有值：直接返回值
                      return c.value
                    }
                    return ''
                  })
                  .filter((part) => part) // 过滤掉空字符串

                const queryCondition = queryParts.join(' ')
                emit('update:searchQuery', queryCondition)
                
                // 同步 queryConditionObj 到父组件
                emit('update:queryCondition', condition)
              }}
              onFastFilterRestore={(data: { key: string; itemNames: string[] }) => {
                emit('fastFilterRestore', data)
              }}
            />
          </div>

          <div class={styles.timeRangeBtnWrapper}>
            {/* 时间范围选择器 */}
            {isTimePaused.value ? (
              // 启用状态：显示预定义时间选择
              <div class={`${styles.timeRangeBtn} ${styles.timeRangeText}`}>
                <ElIcon class={styles.calendarIcon}>
                  <Calendar />
                </ElIcon>
                <div class={styles.timeRangeContent}>
                  <div class={styles.predefinedTimeDisplay}>
                    <span class={styles.predefinedTimeBadge}>
                      {props.minutesPast ? `${props.minutesPast}m` : '15m'}
                    </span>
                    <span class={styles.predefinedTimeText}>
                      {props.minutesPast ? `过去${props.minutesPast}分钟` : '过去15分钟'}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <ElDatePicker
                modelValue={dateRangeValue.value}
                onUpdate:modelValue={handleDateRangeChange}
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                format="YYYY-MM-DD HH:mm:ss"
                shortcuts={datePickerShortcuts}
                class={styles.timeRangePicker}
              />
            )}
            {/* 日志流控制按钮 */}
            <ElButton onClick={handleToggleLogStream} class={styles.pauseBtn}>
              <ElIcon size={22}>{props.isStreaming ? <VideoPause /> : <VideoPlay />}</ElIcon>
            </ElButton>

            <ElButton
              icon={SearchIcon}
              onClick={handleSearch}
              class={styles.refreshBtn}
              disabled={!isTimeRangeValid.value || isTimePaused.value}
            >
              查询
            </ElButton>
          </div>
        </div>
        <div class={styles.filterConditionsContainer}>
          {/* 过滤条件展示 */}
          {props.filterConditions.length > 0 && (
            <div class={styles.filterConditions}>
              {props.filterConditions.map((condition, index) => {
                // 将操作符的 value 转换为 label
                const operatorOption = operatorOptions.find((op) => op.value === condition.operator)
                const operatorLabel = operatorOption ? operatorOption.label : condition.operator
                
                return (
                  <div
                    key={index}
                    class={`${styles.filterCondition} ${
                      condition.isValid === false ? styles.filterConditionInvalid : ''
                    }`}
                  >
                    {condition.isValid === false && <span class={styles.forbiddenText}>禁止</span>}
                    <span class={styles.filterText}>
                      {condition.field} {operatorLabel} {condition.value}
                    </span>
                    <span class={styles.removeFilter} onClick={() => handleRemoveFilter(index)}>
                      ×
                    </span>
                  </div>
                )
              })}
            </div>
          )}

          {!isTimePaused.value && (
            <div class={styles.addFilterBtn} onclick={handleAddFilter}>
              <el-icon>
                <CirclePlus />
              </el-icon>
              添加过滤条件
            </div>
          )}
        </div>
      </div>
    )
  },
})
