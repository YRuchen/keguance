import { defineComponent, computed, PropType } from 'vue'
import {
  ElRadioGroup,
  ElRadioButton,
  ElSelect,
  ElOption,
  ElButton,
  ElDatePicker,
} from 'element-plus'
import { RefreshRight } from '@element-plus/icons-vue'
import { timeTypeOptions, refreshRateOptions, TimeType } from '../constants'
import styles from './FilterPanel.module.scss'

interface Props {
  timeValue: string
  timeRange: [Date, Date] | null
  refreshRate: string
  lastUpdateTime: string
  onTimeChange: (value: string) => void
  onTimeRangeChange: (value: [Date, Date] | null) => void
  onRefreshRateChange: (value: string) => void
  onRefresh: () => void
  onExport: () => void
}

export default defineComponent({
  name: 'FilterPanel',
  props: {
    timeValue: {
      type: String,
      required: true,
    },
    timeRange: {
      type: Array as PropType<Date[]>,
      default: null,
    },
    refreshRate: {
      type: String,
      required: true,
    },
    lastUpdateTime: {
      type: String,
      default: '',
    },
    onTimeChange: {
      type: Function,
      required: true,
    },
    onTimeRangeChange: {
      type: Function,
      required: true,
    },
    onRefreshRateChange: {
      type: Function,
      required: true,
    },
    onRefresh: {
      type: Function,
      required: true,
    },
    onExport: {
      type: Function,
      required: true,
    },
  },
  setup(props: Props) {
    const isCustomTime = computed(() => props.timeValue === TimeType.CUSTOM)

    return () => (
      <div class={styles.filterPanel}>
        <div class={styles.filterRow}>
          <div class={styles.filterLeft}>
            <span>时间范围</span>
            <ElRadioGroup
              modelValue={props.timeValue}
              onUpdate:modelValue={props.onTimeChange}
              class={styles.timeRadioGroup}
            >
              {timeTypeOptions.map((option) => (
                <ElRadioButton key={option.value} label={option.value}>
                  {option.label}
                </ElRadioButton>
              ))}
            </ElRadioGroup>
            <span>自动刷新频率</span>
            <ElSelect
              modelValue={props.refreshRate}
              onUpdate:modelValue={props.onRefreshRateChange}
              class={styles.refreshRateSelect}
            >
              {refreshRateOptions.map((option) => (
                <ElOption key={option.value} label={option.label} value={option.value} />
              ))}
            </ElSelect>
            {props.lastUpdateTime && (
              <span class={styles.lastUpdateTime}>最近一次更新时间：{props.lastUpdateTime}</span>
            )}

            <ElButton icon={RefreshRight} onClick={props.onRefresh} class={styles.refreshBtn}>
              刷新
            </ElButton>
          </div>

          <div class={styles.filterRight}>
            <ElButton onClick={props.onExport} style={{ display: 'unset' }}>
              导出报告
            </ElButton>
          </div>
        </div>

        {isCustomTime.value && (
          <div class={styles.customTimeRow}>
            <span class={styles.customTimeLabel}>自定义时间</span>
            <div>
              <ElDatePicker
                modelValue={props.timeRange}
                onUpdate:modelValue={props.onTimeRangeChange}
                type='datetimerange'
                range-separator='至'
                start-placeholder='开始日期'
                end-placeholder='结束日期'
                format='YYYY-MM-DD HH:mm:ss'
                value-format='YYYY-MM-DD HH:mm:ss'
              />
            </div>
            <span class={styles.customTimeTip}>仅支持近30天的数据统计</span>
          </div>
        )}
      </div>
    )
  },
})
