import { defineComponent, ref, computed } from 'vue'
import { ElTooltip } from 'element-plus'
import { useEcharts } from '~/hooks/useEcharts'
import type { IBarChartResponse } from '~/api/availabilityMonitoring/situationAwareness/interfaces'
import type { EChartsOption } from 'echarts'
import styles from './BarChart.module.scss'
import * as echarts from 'echarts'

interface Props {
  title: string
  tip: string
  data: IBarChartResponse | null
  loading?: boolean
}

export default defineComponent({
  name: 'BarChart',
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
  setup(props: Props, { slots }) {
    const chartRef = ref<HTMLDivElement>()

    // 计算异常占比最大和最小协议（仅针对"不同协议异常统计"）
    const protocolStats = computed(() => {
      if (!props.data || props.title !== '不同协议异常统计') {
        return null
      }

      const { category, series } = props.data
      const alarmSeries = series.find((s) => s.name === '告警')
      const totalSeries = series.find((s) => s.name === '全部')

      if (!alarmSeries || !totalSeries) {
        return null
      }

      const ratios: Array<{ protocol: string; ratio: number }> = []

      category.forEach((protocol, index) => {
        const alarmCount = alarmSeries.data[index]
        const totalCount = totalSeries.data[index]
        const ratio = totalCount > 0 ? (alarmCount / totalCount) * 100 : 0
        ratios.push({ protocol, ratio })
      })

      const maxRatio = ratios.reduce(
        (max, item) => (item.ratio > max.ratio ? item : max),
        ratios[0],
      )
      const minRatio = ratios.reduce(
        (min, item) => (item.ratio < min.ratio ? item : min),
        ratios[0],
      )

      return {
        max: {
          protocol: maxRatio?.protocol || '',
          ratio: maxRatio?.ratio || 0,
        },
        min: {
          protocol: minRatio?.protocol || '',
          ratio: minRatio?.ratio || 0,
        },
      }
    })

    const chartOption = computed<EChartsOption>(() => {
      if (!props.data) {
        return {}
      }
      const linearGradient = (offset0, offset1) => {
        return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: offset0 },
          { offset: 1, color: offset1 },
        ])
      }
      const colors = {
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
          top: '3%',
          left: 0,
          right: '5%',
          bottom: '15%',
          containLabel: true,
        },
        xAxis: {
          type: 'category',
          data: props.data.category,
          axisTick: {
            alignWithLabel: true,
          },
          show: props.data.category.length > 0,
        },
        yAxis: {
          type: 'value',
        },
        series: props.data.series.map((s) => ({
          name: s.name,
          type: 'bar',
          stack: 'total',
          data: s.data,
          barWidth: 18,
          itemStyle: {
            color: colors[s.name as keyof typeof colors],
            borderRadius: [4, 4, 0, 0],
          },
          emphasis: {
            focus: 'series',
          },
        })),
      }
    })

    useEcharts(chartRef, chartOption)

    return () => (
      <div class={styles.barChart}>
        <div class={styles.chartHeader}>
          <div class={[styles.chartHeader, styles.gap]}>
            <span class={styles.chartTitle}>{props.title}</span>
            <ElTooltip content={props.tip} placement='top'>
              <span class={styles.tipIcon}>?</span>
            </ElTooltip>
          </div>
          {slots.chartHeader?.()}
        </div>
        <div class={styles.chartWrapper}>
          <div class={styles.chartContent}>
            <div ref={chartRef} class={styles.chartContainer}></div>
          </div>
          {slots.default?.()}
        </div>
      </div>
    )
  },
})
