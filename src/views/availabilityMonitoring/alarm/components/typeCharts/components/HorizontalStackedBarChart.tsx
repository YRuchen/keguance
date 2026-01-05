import { defineComponent, ref, computed } from 'vue'
import { ElTooltip } from 'element-plus'
import { useEcharts } from '~/hooks/useEcharts'
import type { IBarChartResponse } from '~/api/availabilityMonitoring/situationAwareness/interfaces'
import type { EChartsOption } from 'echarts'
import styles from './HorizontalStackedBarChart.module.scss'
import * as echarts from 'echarts'

interface Props {
  title: string
  tip: string
  data: IBarChartResponse | null
  loading?: boolean
}

export default defineComponent({
  name: 'HorizontalStackedBarChart',
  props: {
    title: {
      type: String,
      required: true,
    },
    tip: {
      type: String,
      required: true,
    },
    data: {
      type: Object as () => IBarChartResponse | null,
      default: null,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  setup(props: Props) {
    const chartRef = ref<HTMLDivElement>()

    const chartOption = computed<EChartsOption>(() => {
      if (!props.data || !props.data.category || !props.data.series) {
        return {}
      }

      const linearGradient = (offset0: string, offset1: string) => {
        return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: offset0 },
          { offset: 1, color: offset1 },
        ])
      }

      const colors: Record<string, any> = {
        全部: linearGradient('#007DFF', '#7BB8FF'),
        正常: linearGradient('#47C1C1', '#A8EBEB'),
        告警: linearGradient('#F56C6C', '#FFB6B7'),
      }

      return {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        legend: {
          data: props.data.series.map((s) => s.name),
          bottom: 0,
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '15%',
          containLabel: true,
        },
        xAxis: {
          type: 'value',
        },
        yAxis: {
          type: 'category',
          data: props.data.category,
        },
        series: props.data.series.map((s) => ({
          name: s.name,
          type: 'bar',
          stack: 'total',
          data: s.data,
          itemStyle: {
            color: colors[s.name] || linearGradient('#F56C6C', '#FFB6B7'),
            borderRadius: [0, 4, 4, 0],
          },
          emphasis: {
            focus: 'series',
          },
        })),
      }
    })

    useEcharts(chartRef, chartOption)

    return () => (
      <div class={styles.horizontalStackedBarChart}>
        <div class={styles.chartHeader}>
          <div class={[styles.chartHeader, styles.gap]}>
            <span class={styles.chartTitle}>{props.title}</span>
            <ElTooltip content={props.tip} placement='top'>
              <span class={styles.tipIcon}>?</span>
            </ElTooltip>
          </div>
        </div>
        <div class={styles.chartContainer}>
          <div ref={chartRef} class={styles.chartContent}></div>
        </div>
      </div>
    )
  },
})

