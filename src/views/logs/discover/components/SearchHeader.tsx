// components/SearchHeader.tsx
import { defineComponent, ref, computed, PropType, watch } from 'vue'
import {
  Search as SearchIcon,
  Calendar,
  Collection,
  CirclePlus,
  VideoPlay,
  VideoPause,
} from '@element-plus/icons-vue'
import {
  ElInput,
  ElButton,
  ElPopover,
  ElTabs,
  ElTabPane,
  ElIcon,
  ElDatePickerPanel,
  ElInputNumber,
  ElSelect,
  ElOption,
  ElSwitch,
} from 'element-plus'
import { LogField, FilterCondition } from '@/api/logs/discover/interfaces'
import SearchSuggestions from './SearchSuggestions'
import styles from '../index.module.scss'
import {
  RELATIVE_TIME_OPTIONS,
  DEFAULT_RELATIVE_AMOUNT,
  DEFAULT_RELATIVE_UNIT,
  DATE_FORMAT_OPTIONS,
  POPOVER_CONFIG,
  PREDEFINED_TIME_OPTIONS,
  type RelativeTimeUnit,
  type TimeTab,
  type PredefinedTimeOption,
} from '../constants'

export default defineComponent({
  name: 'SearchHeader',
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
  ],
  setup(props, { emit }) {
    const handleAddFilter = () => emit('addFilter')
    const handleRemoveFilter = (index: number) => emit('removeFilter', index)
    const handleToggleLogStream = async () => {
      emit('toggleLogStream')
    }
    // 切换暂停/启用状态
    const toggleTimePause = async () => {
      const next = !isTimePaused.value
      emit('update:isTimePaused', next)
      if (!next) {
        // 如果从暂停切换到启用，清除预定义时间选择
        selectedPredefinedTime.value = null
        await emit('update:searchTimeType', 1) // 绝对时间
      } else {
        await emit('update:searchTimeType', 2) // 相对时间
      }
      handleSearch()
    }
    // 处理查询按钮点击，传递查询数据给后端
    const handleSearch = () => {
      // 检查时间范围是否有效
      if (!isTimeRangeValid.value) {
        console.error('开始时间不能晚于结束时间')
        return
      }

      const queryData: any = {
        queryCondition: props.searchQuery,
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

    // 搜索建议相关状态
    const suggestionsVisible = ref(false)
    const cursorPosition = ref(0)
    const searchInputRef = ref<any>() // ElInput 组件引用

    // 时间选择弹层
    const timeRangeVisible = ref(false)
    const activeTimePart = ref<'start' | 'end'>()
    const activeTab = ref<TimeTab>('absolute')
    const relativeAmount = ref<number>(DEFAULT_RELATIVE_AMOUNT)
    const relativeUnit = ref<RelativeTimeUnit>(DEFAULT_RELATIVE_UNIT)
    const includeWeek = ref(false)

    // 预定义时间选择状态（由父组件传入）
    const isTimePaused = computed(() => props.isTimePaused)
    const selectedPredefinedTime = ref<PredefinedTimeOption | null>({
      label: '15m',
      description: '过去15分钟',
      value: 15,
    })

    // 从props计算当前时间
    const startDate = computed(() => {
      if (props.startTimestamp) {
        return new Date(props.startTimestamp)
      }
      return null
    })

    const endDate = computed(() => {
      if (props.endTimestamp) {
        console.log(new Date(props.endTimestamp))
        return new Date(props.endTimestamp)
      }
      return null
    })

    // 标记哪些时间是"现在"时间
    const isStartTimeNow = ref(false)
    const isEndTimeNow = ref(false)

    const formatDate = (d?: Date | null) => {
      if (!d) return ''
      const year = d.getFullYear()
      const month = String(d.getMonth() + 1).padStart(2, '0')
      const day = String(d.getDate()).padStart(2, '0')
      const hours = String(d.getHours()).padStart(2, '0')
      const minutes = String(d.getMinutes()).padStart(2, '0')
      const seconds = String(d.getSeconds()).padStart(2, '0')
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
    }

    // 格式化时间显示，如果是"现在"时间则显示"现在"
    const formatTimeDisplay = (date: Date | null, isNow: boolean) => {
      if (!date) return ''
      if (isNow) return ''
      return formatDate(date)
    }

    // 检查时间范围是否有效
    const isTimeRangeValid = computed(() => {
      if (!startDate.value || !endDate.value) return true

      // 获取实际用于比较的时间
      const now = new Date()
      const actualStartTime = isStartTimeNow.value ? now : startDate.value
      const actualEndTime = isEndTimeNow.value ? now : endDate.value

      return actualStartTime < actualEndTime
    })

    const setNow = () => {
      const now = new Date()
      if (activeTimePart.value === 'start') {
        isStartTimeNow.value = true
        emit('update:startTimestamp', now.getTime())
      } else {
        isEndTimeNow.value = true
        emit('update:endTimestamp', now.getTime())
      }
      timeRangeVisible.value = false
    }

    // 计算相对时间
    const calculateRelativeTime = (amount: number, unit: RelativeTimeUnit) => {
      const now = new Date()
      const calculatedTime = new Date(now)
      const isFromNow = unit.includes('_from_now')
      const timeUnit = unit.replace('_from_now', '') as Exclude<
        RelativeTimeUnit,
        `${string}_from_now`
      >

      const multiplier = isFromNow ? 1 : -1

      switch (timeUnit) {
        case 'seconds':
          calculatedTime.setSeconds(calculatedTime.getSeconds() + amount * multiplier)
          break
        case 'minutes':
          calculatedTime.setMinutes(calculatedTime.getMinutes() + amount * multiplier)
          break
        case 'hours':
          calculatedTime.setHours(calculatedTime.getHours() + amount * multiplier)
          break
        case 'days':
          calculatedTime.setDate(calculatedTime.getDate() + amount * multiplier)
          break
        case 'weeks':
          calculatedTime.setDate(calculatedTime.getDate() + amount * 7 * multiplier)
          break
        case 'months':
          calculatedTime.setMonth(calculatedTime.getMonth() + amount * multiplier)
          break
        case 'years':
          calculatedTime.setFullYear(calculatedTime.getFullYear() + amount * multiplier)
          break
      }

      // 如果启用了舍入功能，则对时间进行舍入处理
      if (includeWeek.value) {
        return roundToNearestUnit(calculatedTime, timeUnit)
      }

      return calculatedTime
    }

    // 舍入到最近的时间单位
    const roundToNearestUnit = (date: Date, unit: string) => {
      const roundedDate = new Date(date)

      switch (unit) {
        case 'seconds':
          roundedDate.setMilliseconds(0)
          break
        case 'minutes':
          roundedDate.setSeconds(0, 0)
          break
        case 'hours':
          roundedDate.setMinutes(0, 0, 0)
          break
        case 'days':
          roundedDate.setHours(0, 0, 0, 0)
          break
        case 'weeks':
          // 舍入到本周的开始（周一）
          const dayOfWeek = roundedDate.getDay()
          const daysToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
          roundedDate.setDate(roundedDate.getDate() + daysToMonday)
          roundedDate.setHours(0, 0, 0, 0)
          break
        case 'months':
          roundedDate.setDate(1)
          roundedDate.setHours(0, 0, 0, 0)
          break
        case 'years':
          roundedDate.setMonth(0, 1)
          roundedDate.setHours(0, 0, 0, 0)
          break
      }

      return roundedDate
    }

    // 实时更新相对时间
    const updateRelativeTime = () => {
      if (activeTimePart.value) {
        const calculatedTime = calculateRelativeTime(relativeAmount.value, relativeUnit.value)

        if (activeTimePart.value === 'start') {
          isStartTimeNow.value = false // 清除"现在"标记
          emit('update:startTimestamp', calculatedTime.getTime())
        } else {
          isEndTimeNow.value = false // 清除"现在"标记
          emit('update:endTimestamp', calculatedTime.getTime())
        }
      }
    }
    const generateTimeSlots = (): string[] => {
      const times: string[] = []
      for (let hour = 0; hour <= 24; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
          // 跳过24:30，因为它不存在
          if (hour === 24 && minute !== 0) break

          const formattedHour = hour.toString().padStart(2, '0')
          const formattedMinute = minute.toString().padStart(2, '0')
          times.push(`${formattedHour}:${formattedMinute}`)
        }
      }
      return times
    }

    // 计算当前活跃的日期
    const currentDate = computed(() => {
      return activeTimePart.value === 'start' ? startDate.value : endDate.value
    })

    // 计算当前活跃的日期设置函数
    const setCurrentDate = (value: Date | null) => {
      if (activeTimePart.value === 'start') {
        isStartTimeNow.value = false // 清除"现在"标记
        if (value) {
          emit('update:startTimestamp', value.getTime())
        }
      } else {
        isEndTimeNow.value = false // 清除"现在"标记
        if (value) {
          emit('update:endTimestamp', value.getTime())
        }
      }
    }

    // 计算舍入单位显示文本
    const roundingUnitText = computed(() => {
      const unit = relativeUnit.value.replace('_from_now', '')
      const unitMap: Record<string, string> = {
        seconds: '秒',
        minutes: '分钟',
        hours: '小时',
        days: '天',
        weeks: '周',
        months: '月',
        years: '年',
      }
      return unitMap[unit] || 'unit'
    })

    // 搜索建议处理函数
    const handleInputFocus = () => {
      suggestionsVisible.value = true
    }

    const handleInputBlur = () => {
      // 延迟隐藏，以便点击建议项
      setTimeout(() => {
        suggestionsVisible.value = false
      }, 200)
    }

    const handleInputChange = (value: string) => {
      emit('update:searchQuery', value)
    }

    const handleInputKeyup = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleSearch()
        suggestionsVisible.value = false
      }
    }

    const handleInputClick = (e: MouseEvent) => {
      const target = e.target as HTMLInputElement
      cursorPosition.value = target.selectionStart || 0
    }

    const handleInputKeydown = (e: KeyboardEvent) => {
      const target = e.target as HTMLInputElement
      cursorPosition.value = target.selectionStart || 0
    }

    const handleSuggestionSelect = (suggestion: {
      value: string
      type: string
      backendId?: string
    }) => {
      const currentQuery = props.searchQuery
      const beforeCursor = currentQuery.substring(0, cursorPosition.value)
      const afterCursor = currentQuery.substring(cursorPosition.value)

      // 如果光标前有空格，说明是选择运算符
      if (beforeCursor.endsWith(' ')) {
        const newQuery = beforeCursor + suggestion.value + afterCursor
        emit('update:searchQuery', newQuery)

        // 如果有后端标识符，发送给后端
        if (suggestion.type === 'operator' && suggestion.backendId) {
          // 这里可以发送后端标识符给父组件
          console.log('Operator backend ID:', suggestion.backendId)
        }

        // 将光标移动到插入内容的末尾
        setTimeout(() => {
          if (searchInputRef.value) {
            const newCursorPos = beforeCursor.length + suggestion.value.length
            // 获取 ElInput 内部的 input 元素
            const inputElement = searchInputRef.value.input || searchInputRef.value.$refs?.input
            if (inputElement) {
              inputElement.focus() // 保持焦点
              if (inputElement.setSelectionRange) {
                inputElement.setSelectionRange(newCursorPos, newCursorPos)
                cursorPosition.value = newCursorPos
              }
            }
          }
        }, 0)
      } else {
        // 选择字段，替换整个输入内容
        emit('update:searchQuery', suggestion.value)
        // 保持焦点
        setTimeout(() => {
          if (searchInputRef.value) {
            const inputElement = searchInputRef.value.input || searchInputRef.value.$refs?.input
            if (inputElement) {
              inputElement.focus()
              const newCursorPos = suggestion.value.length
              if (inputElement.setSelectionRange) {
                inputElement.setSelectionRange(newCursorPos, newCursorPos)
                cursorPosition.value = newCursorPos
              }
            }
          }
        }, 0)
      }

      // 保持建议列表显示
      suggestionsVisible.value = true
    }

    const handleSuggestionsClose = () => {
      suggestionsVisible.value = false
    }

    // 处理预定义时间选择
    const handlePredefinedTimeSelect = (option: PredefinedTimeOption) => {
      selectedPredefinedTime.value = option
      timeRangeVisible.value = false // 关闭弹框
      // 更新父组件状态
      emit('update:searchTimeType', 2) // 相对时间
      emit('update:minutesPast', option.value)
    }

    // 监听搜索查询变化，更新光标位置
    watch(
      () => props.searchQuery,
      () => {
        if (searchInputRef.value) {
          const inputElement = searchInputRef.value.input || searchInputRef.value.$refs?.input
          if (inputElement) {
            cursorPosition.value = inputElement.selectionStart || 0
          }
        }
      },
    )
    // 父组件负责同步 isTimePaused 与 searchTimeType，无需本地watch
    return () => (
      <div class={styles.searchHeader}>
        <div class={styles.searchInputGroup}>
          {/* 搜索框 */}
          <div class={styles.searchInputWrapper}>
            <ElInput
              ref={searchInputRef}
              modelValue={props.searchQuery}
              onUpdate:modelValue={handleInputChange}
              placeholder='支持key value查询，以空格键隔开'
              class={styles.searchInput}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              onKeyup={handleInputKeyup}
              onClick={handleInputClick}
              onKeydown={handleInputKeydown}
              clearable
              disabled={isTimePaused.value}
            >
              {{
                prepend: () => (
                  <ElButton class={styles.iconSquareBtn}>
                    <ElIcon>
                      <Collection />
                    </ElIcon>
                  </ElButton>
                ),
              }}
            </ElInput>

            {/* 搜索建议 */}
            <SearchSuggestions
              visible={suggestionsVisible.value}
              availableFields={props.availableFields}
              searchQuery={props.searchQuery}
              cursorPosition={cursorPosition.value}
              onSelect={handleSuggestionSelect}
              onClose={handleSuggestionsClose}
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
                <div
                  class={styles.timeRangeContent}
                  onClick={() => {
                    timeRangeVisible.value = !timeRangeVisible.value
                  }}
                >
                  <div class={styles.predefinedTimeDisplay}>
                    <span class={styles.predefinedTimeBadge}>
                      {selectedPredefinedTime.value?.label}
                    </span>
                    <span class={styles.predefinedTimeText}>
                      {selectedPredefinedTime.value?.description}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <ElPopover
                placement={POPOVER_CONFIG.placement}
                width={isTimePaused.value ? '300px' : POPOVER_CONFIG.width}
                v-model:visible={timeRangeVisible.value}
                trigger='manual'
                append-to-body
                persistent
              >
                {{
                  reference: () => (
                    <div class={styles.timeRangeBtn}>
                      <ElIcon class={styles.calendarIcon}>
                        <Calendar />
                      </ElIcon>
                      <div
                        class={styles.timeRangeContent}
                        onClick={() => {
                          timeRangeVisible.value = !timeRangeVisible.value
                        }}
                      >
                        <>
                          <span
                            class={`${styles.timePart} ${
                              activeTimePart.value === 'start' ? styles.timePartActive : ''
                            } ${!isTimeRangeValid.value ? styles.timePartError : ''}`}
                            onClick={(e) => {
                              e.stopPropagation()
                              activeTimePart.value = 'start'
                              timeRangeVisible.value = true
                            }}
                          >
                            {formatTimeDisplay(startDate.value, isStartTimeNow.value)}
                          </span>
                          <span
                            class={`${styles.arrow} ${
                              !isTimeRangeValid.value ? styles.arrowError : ''
                            }`}
                          >
                            →
                          </span>
                          <span
                            class={`${styles.timePart} ${
                              activeTimePart.value === 'end' ? styles.timePartActive : ''
                            } ${!isTimeRangeValid.value ? styles.timePartError : ''}`}
                            onClick={(e) => {
                              e.stopPropagation()
                              activeTimePart.value = 'end'
                              timeRangeVisible.value = true
                            }}
                          >
                            {formatTimeDisplay(endDate.value, isEndTimeNow.value)}
                          </span>
                        </>
                      </div>
                    </div>
                  ),
                  default: () => (
                    <div class={styles.timePopover}>
                      {isTimePaused.value ? (
                        // 启用状态：显示预定义时间选项列表
                        {
                          /* <div class={styles.predefinedTimeList}>
                         {PREDEFINED_TIME_OPTIONS.map((option) => (
                          <div
                            key={option.label}
                            class={[
                              styles.predefinedTimeItem,
                              selectedPredefinedTime.value?.label === option.label
                                ? styles.predefinedTimeItemActive
                                : '',
                            ]}
                            onClick={() => handlePredefinedTimeSelect(option)}
                          >
                            <span class={styles.predefinedTimeLabel}>{option.label}</span>
                            <span class={styles.predefinedTimeDescription}>
                              {option.description}
                            </span>
                          </div>
                        ))} 
                      </div>*/
                        }
                      ) : (
                        // 暂停状态：显示原有的时间选择器
                        <ElTabs
                          modelValue={activeTab.value}
                          onUpdate:modelValue={(v) => (activeTab.value = v as any)}
                        >
                          {/* 绝对时间选择器 */}
                          <ElTabPane label='绝对时间' name='absolute'>
                            <div class={styles.timeAbsolute}>
                              <div class={styles.calendarCol}>
                                <ElDatePickerPanel
                                  modelValue={currentDate.value}
                                  onUpdate:modelValue={setCurrentDate}
                                  placeholder={
                                    activeTimePart.value === 'start' ? '开始时间' : '结束时间'
                                  }
                                  border={false}
                                />
                              </div>
                              <div class={styles.timeCol}>
                                {generateTimeSlots().map((t) => {
                                  const selectedDate = currentDate.value
                                  return (
                                    <div
                                      class={
                                        styles.timeItem +
                                        (selectedDate &&
                                        new Date(selectedDate).getHours() ===
                                          Number(t.split(':')[0]) &&
                                        new Date(selectedDate).getMinutes() ===
                                          Number(t.split(':')[1])
                                          ? ' ' + styles.timeItemActive
                                          : '')
                                      }
                                      onClick={() => {
                                        const baseDate =
                                          activeTimePart.value === 'start'
                                            ? startDate.value
                                            : endDate.value
                                        if (!baseDate) return
                                        const [h, m] = t.split(':').map((x) => Number(x))
                                        const d = new Date(baseDate)
                                        d.setHours(h, m, 0, 0)

                                        // 清除"现在"标记
                                        if (activeTimePart.value === 'start') {
                                          isStartTimeNow.value = false
                                          emit('update:startTimestamp', d.getTime())
                                        } else {
                                          isEndTimeNow.value = false
                                          emit('update:endTimestamp', d.getTime())
                                        }
                                      }}
                                    >
                                      {t}
                                    </div>
                                  )
                                })}
                              </div>
                            </div>
                            <div class={styles.timeFooterRow}>
                              <span>
                                {activeTimePart.value === 'start' ? '开始时间' : '结束时间'}
                              </span>
                              <div class={styles.timeFooterValue}>
                                {formatTimeDisplay(
                                  activeTimePart.value === 'start'
                                    ? startDate.value
                                    : endDate.value,
                                  activeTimePart.value === 'start'
                                    ? isStartTimeNow.value
                                    : isEndTimeNow.value,
                                )}
                              </div>
                            </div>
                          </ElTabPane>
                          {/* 相对时间选择器 */}
                          <ElTabPane label='相对时间' name='relative'>
                            <div class={styles.timeRelative}>
                              <ElInputNumber
                                min={1}
                                v-model={relativeAmount.value}
                                controls-position='right'
                                onChange={updateRelativeTime}
                                onClick={(e: Event) => e.stopPropagation()}
                              />
                              <ElSelect
                                v-model={relativeUnit.value}
                                class={styles.relativeUnitSel}
                                onChange={updateRelativeTime}
                                onClick={(e: Event) => e.stopPropagation()}
                                teleported={false}
                              >
                                {RELATIVE_TIME_OPTIONS.map((option) => (
                                  <ElOption
                                    key={option.value}
                                    label={option.label}
                                    value={option.value}
                                  />
                                ))}
                              </ElSelect>
                            </div>
                            <div class={styles.timeRelativeOptions}>
                              <ElSwitch
                                v-model={includeWeek.value}
                                onChange={updateRelativeTime}
                                onClick={(e: Event) => e.stopPropagation()}
                              />
                              <span class={styles.timeRelativeOptionsText}>
                                舍入为{roundingUnitText.value}
                              </span>
                            </div>
                            <div class={styles.timeFooterRow}>
                              <span>
                                {activeTimePart.value === 'start' ? '开始时间' : '结束时间'}
                              </span>
                              <div class={styles.timeFooterValue}>
                                {formatTimeDisplay(
                                  activeTimePart.value === 'start'
                                    ? startDate.value
                                    : endDate.value,
                                  activeTimePart.value === 'start'
                                    ? isStartTimeNow.value
                                    : isEndTimeNow.value,
                                )}
                              </div>
                            </div>
                          </ElTabPane>
                          {/* 现在时间选择器 */}
                          <ElTabPane label='现在' name='now'>
                            <div class={styles.timeNow}>
                              <div class={styles.timeTabBody}>
                                将时间设置为“现在”意味着每次查询时该时间都将设置为查询时间。
                              </div>
                              <ElButton type='primary' onClick={setNow}>
                                设置{activeTimePart.value === 'start' ? '开始时间' : '结束时间'}
                                为现在
                              </ElButton>
                            </div>
                          </ElTabPane>
                        </ElTabs>
                      )}
                    </div>
                  ),
                }}
              </ElPopover>
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
              {props.filterConditions.map((condition, index) => (
                <div
                  key={index}
                  class={`${styles.filterCondition} ${
                    condition.isValid === false ? styles.filterConditionInvalid : ''
                  }`}
                >
                  {condition.isValid === false && <span class={styles.forbiddenText}>禁止</span>}
                  <span class={styles.filterText}>
                    {condition.field} {condition.operator} {condition.value}
                  </span>
                  <span class={styles.removeFilter} onClick={() => handleRemoveFilter(index)}>
                    ×
                  </span>
                </div>
              ))}
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
